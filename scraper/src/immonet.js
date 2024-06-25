import fs from 'fs';
import { getBrowser } from './utils/playwright.js'

// 
// https://www.immonet.de/haus-mieten.html
const scrapeData = async (page) => {
    const BASE_URL = 'https://www.immonet.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD04DE11';
    await page.goto(BASE_URL);

    const content = await page.content();

    const scriptTagStart = `<script id="__NEXT_DATA__" type="application/json">`;
    const scriptTagEnd = '</script>';

    // Locate the start and end positions of the script content
    const startIndex = content.indexOf(scriptTagStart) + scriptTagStart.length;
    const endIndex = content.indexOf(scriptTagEnd, startIndex);

    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Script tag not found');
    }

    // Extract the JSON string
    const jsonString = content.substring(startIndex, endIndex).trim();
    const data = JSON.parse(jsonString)
    const { page: pageNumber, classifiedsData } = data?.props?.pageProps?.pageProps || {}

    fs.writeFileSync('./immonet.json', JSON.stringify(classifiedsData))
}

const crawler = async () => {
    try {
        await getBrowser(scrapeData);
    } catch (error) {
        console.error("Immonet Error:", error);
    }
}

export const immonetCrawler = crawler;


