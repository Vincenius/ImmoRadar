import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'
import fsPromises from 'fs/promises';
import { PDFDocument } from 'pdf-lib';
import base64Logo from './base64Logo.js';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import headers from '@/utils/fetchHeader';

const execAsync = promisify(exec);

const compressPdf = async (inputPath, outputPath) => {
  const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 \
  -dPDFSETTINGS=/printer -dPreserveAnnots=true \
  -dNOPAUSE -dQUIET -dBATCH \
  -sOutputFile="${outputPath}" "${inputPath}"`;

  await execAsync(command);
};


const generateSinglePagePdf = async (url, outputPath, noHeaderFooter = false, user) => {
  const browser = await puppeteer.launch({
    args: ['--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
      '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none',
      '--enable-font-antialiasing',
      '--disable-font-subpixel-positioning'],
  });

  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'x-api-key': process.env.API_KEY, ...headers });
  await page.goto(url, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: !noHeaderFooter ? true : false,
    margin: noHeaderFooter
      ? { top: '0in', right: '0in', bottom: '0in', left: '0in' }
      : {
        top: '1in',
        right: '0',
        bottom: '1in',
        left: '0'
      },
    footerTemplateHeight: noHeaderFooter ? '0' : '30px',
    headerTemplateHeight: noHeaderFooter ? '0' : '80px',
    headerTemplate: !noHeaderFooter
      ? `<div style="width: 100%; display: flex; justify-content: space-between; align-items: center; font-size: 16px; margin: 0 2.5em 30px ; padding: 0 0 15px; font-family: 'Arial'; border-bottom: 1px solid  #dee2e5;">
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${base64Logo}" width="169px" height="20px" style="width: 138px; height: 30px;" alt="${process.env.NEXT_PUBLIC_WEBSITE_NAME}" />
        </div>
        <div>
          <p style="font-size: 12px; margin: 0; text-align: right;"><b>Dein Förderreport</b>${user.Name ? ` | ${user.Name}` : ''}</p>
          <p style="font-size: 12px; margin: 0; text-align: right;">${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>` : '<div></div>',
    footerTemplate: !noHeaderFooter
      ? `<div style="font-size:14px; width:100%; text-align:center; font-family: 'Arial';">
        Seite <span class="pageNumber"></span> von <span class="totalPages"></span>
      </div>`
      : '<div></div>',
  });

  await browser.close();
};

const mergePdfs = async (pdfPaths, outputPath) => {
  const mergedPdf = await PDFDocument.create();

  for (const pdfPath of pdfPaths) {
    const pdfBytes = await fsPromises.readFile(pdfPath);
    const pdf = await PDFDocument.load(pdfBytes);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const finalPdfBytes = await mergedPdf.save();
  await fsPromises.writeFile(outputPath, finalPdfBytes);
};

const generatePdf = async (id, user) => {
  const tmpDir = './tmp';

  // if tmp directory doesnt exist create it
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
  }

  const uuid = uuidv4();
  const headerPath = path.join(tmpDir, `${uuid}-header.pdf`);
  const contentPath = path.join(tmpDir, `${uuid}-content.pdf`);
  const outputPath = path.join(tmpDir, `${uuid}.pdf`);
  const compressedPath = path.join(tmpDir, `${uuid}-compressed.pdf`);

  const headerUrl = `${process.env.BASE_URL}/protected/pdf-report-header?id=${id}`;
  const contentUrl = `${process.env.BASE_URL}/protected/pdf-report?id=${id}`;

  await Promise.all([
    generateSinglePagePdf(headerUrl, headerPath, true, user),
    generateSinglePagePdf(contentUrl, contentPath, false, user),
  ])

  await mergePdfs([headerPath, contentPath], outputPath);

  fs.unlinkSync(headerPath);
  fs.unlinkSync(contentPath);

  await compressPdf(outputPath, compressedPath);

  fs.unlinkSync(outputPath);

  return { filename: compressedPath };
};

export default generatePdf;
