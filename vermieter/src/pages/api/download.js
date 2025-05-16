import puppeteer from 'puppeteer';
import { MongoClient, ObjectId } from 'mongodb';
import fs from 'fs';
import CryptoJS from 'crypto-js'
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

const getFileName = async (contractId) => {
  const client = new MongoClient(process.env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('contracts');

    const [result] = await collection.find({ _id: new ObjectId(contractId) }).toArray();
    return `Mietvertrag_${result.street}_${result.tenantName}.pdf`
  } catch (error) {
    console.log('error on fetching filename', error)
    return "Mietvertrag.pdf"
  } finally {
    client.close();
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { token, id } = req.query
    let contractId

    if (id && process.env.NEXT_PUBLIC_DISABLE_STRIPE !== 'true') {
      // trigered from logged in
      const serverSession = await getServerSession(req, res, authOptions);
      if (!serverSession || !serverSession.user || !serverSession.user.email) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
          await client.connect();
          const db = client.db(process.env.MONGODB_DB);
          const collection = db.collection('contracts');
          const userCollection = db.collection('users');

          const user = await userCollection.find({ email: serverSession.user.email }).toArray();
          const contracts = await collection.find({ user_id: user[0]._id }).toArray();
          const requestedContract = contracts.find(c => c._id.toString() === id)

          if (requestedContract && requestedContract.paid) {
            contractId = id
          } else {
            return res.status(401).json({ message: 'Unauthorized' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        } finally {
          client.close();
        }
      }
    } else {
      // trigered from logged out
      let encryptedId = CryptoJS.AES.encrypt(id || '', process.env.PASSWORD_HASH_SECRET).toString();
      encryptedId = encryptedId.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const useToken = process.env.NEXT_PUBLIC_DISABLE_STRIPE === 'true'
        ? encryptedId
        : token
      const encrypted = useToken.replace(/-/g, '+').replace(/_/g, '/');
      const decrypted = CryptoJS.AES.decrypt(encrypted, process.env.PASSWORD_HASH_SECRET);
      contractId = decrypted.toString(CryptoJS.enc.Utf8);
    }

    // PDF mit Puppeteer erstellen
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const headers = {
      'x-api-key': process.env.API_KEY
    }
    if (process.env.PROTECTION) {
      headers['Authorization'] = `Basic ${process.env.PROTECTION}`;
    }

    const fileName = await getFileName(contractId)
    await page.setExtraHTTPHeaders(headers);
    await page.goto(`${process.env.BASE_URL}/pdf?id=${contractId}`, { waitUntil: 'networkidle0' });

    // if tmp directory doesnt exist create it
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp');
    }

    const path = `./tmp/${contractId}.pdf`;

    // Define PDF options
    const pdfOptions = {
      format: 'A4',
      margin: {
        top: '1.2in',
        right: '1in',
        bottom: '1in',
        left: '1in'
      },
      path,
      printBackground: true,
      displayHeaderFooter: true,
      //     headerTemplate: `
      //   <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 16px; margin: 0 1in 30px ; padding: 0 0 15px; font-family: 'Arial'; border-bottom: 1px solid  #dee2e5;">
      //     <div style="display: flex; gap: 12px; align-items: center;">
      //       <img src="${base64Logo}" width="40px" height="40px" style="width: 40px; height: 40px;" alt="alt" />
      //       <span style="font-size: 16px; font-weight: bold;">Vertragsfabrik</span>
      //     </div>
      //     <div>
      //       <p style="font-size: 12px; margin: 0; text-align: right;">Förderungen Report</p>
      //       <p style="font-size: 12px; margin: 0; text-align: right;">${new Date().toLocaleDateString('de-DE', { format: 'long' })}</p>
      //     </div>
      //   </div>
      // `,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="font-size:14px; width:100%; text-align:center; font-family: 'Arial';">
          Seite <span class="pageNumber"></span> von <span class="totalPages"></span>
        </div>`,
      // Adjust the footer and header height
      footerTemplateHeight: '30px',
      // headerTemplateHeight: '80px',
    };

    await page.pdf(pdfOptions);
    await browser.close();

    const fileBuffer = fs.readFileSync(path);

    fs.unlinkSync(path);

    // Set the response headers to initiate a download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // Send the PDF as a response
    res.status(200).send(fileBuffer);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
