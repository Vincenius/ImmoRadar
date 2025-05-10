import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import base64Logo from './base64Logo.js';

const generatePdf = async (id) => {
  // if tmp directory doesnt exist create it
  if (!fs.existsSync('./tmp')) {
    fs.mkdirSync('./tmp');
  }

  // PDF mit Puppeteer erstellen
  const fileName = uuidv4();
  const browser = await puppeteer.launch({
    args: ['--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'x-api-key': process.env.API_KEY });
  await page.goto(`${process.env.BASE_URL}/protected/pdf-report?id=${id}`, { waitUntil: 'networkidle0' });

  // Define PDF options
  const pdfOptions = {
    format: 'A4',
    margin: {
      top: '1.2in',
      right: '1in',
      bottom: '1in',
      left: '1in'
    },
    path: `./tmp/${fileName}.pdf`,
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 16px; margin: 0 1in 30px ; padding: 0 0 15px; font-family: 'Arial'; border-bottom: 1px solid  #dee2e5;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${base64Logo}" width="169px" height="20px" style="width: 169px; height: 20px;" alt="${process.env.NEXT_PUBLIC_WEBSITE_NAME}" />
        </div>
        <div>
          <p style="font-size: 12px; margin: 0; text-align: right;">FörderCheck Report</p>
          <p style="font-size: 12px; margin: 0; text-align: right;">${new Date().toLocaleDateString('de-DE', { format: 'long' })}</p>
        </div>
      </div>
    `,
    footerTemplate: `
      <div style="font-size:14px; width:100%; text-align:center; font-family: 'Arial';">
        Seite <span class="pageNumber"></span> von <span class="totalPages"></span>
      </div>
    `,
    // Adjust the footer and header height
    footerTemplateHeight: '30px',
    headerTemplateHeight: '80px',
  };

  // Generate the PDF
  await page.pdf(pdfOptions);
  await browser.close();

  // Return file path
  return { filename: `./tmp/${fileName}.pdf` };
};

export default generatePdf;
