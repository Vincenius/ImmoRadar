import puppeteer from 'puppeteer';
import fs from 'fs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    // PDF mit Puppeteer erstellen
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({ 'x-api-key': process.env.API_KEY });
    await page.goto(`${process.env.BASE_URL}/pdf?id=${req.query.id}`, { waitUntil: 'networkidle0' });

    // if tmp directory doesnt exist create it
    if (!fs.existsSync('./tmp')) {
      fs.mkdirSync('./tmp');
    }

    const path = `./tmp/${req.query.id}.pdf`;

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
      //       <span style="font-size: 16px; font-weight: bold;">Fertighaus Radar</span>
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
    res.setHeader('Content-Disposition', `attachment; filename="Mietvertrag.pdf"`);

    // Send the PDF as a response
    res.status(200).send(fileBuffer);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
