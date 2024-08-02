import fs from 'fs';
import { middleware } from './utils/middleware.js'

// 
// https://www.immonet.de/haus-mieten.html
const scrapeData = async (page) => {
    const BASE_URL = 'https://www.immonet.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD04DE11';
    await page.goto(BASE_URL);

    // const content = await page.content();

    // const scriptTagStart = `JSON.parse("`;
    // const scriptTagEnd = '");</script>';

    // // Locate the start and end positions of the script content
    // const startIndex = content.indexOf(scriptTagStart) + scriptTagStart.length;
    // const endIndex = content.indexOf(scriptTagEnd, startIndex);

    // if (startIndex === -1 || endIndex === -1) {
    //     throw new Error('Script tag not found');
    // }

    const scriptContent = await page.evaluate(() => {
        // Find all script tags
        const scripts = document.querySelectorAll('script');

        // Iterate over scripts to find the one containing `window["__UFRN_FETCHER__"]`
        for (let script of scripts) {
            if (script.innerHTML.includes('window["__UFRN_FETCHER__"]')) {
                return script.innerHTML;
            }
        }

        // Return null if no matching script is found
        return null;
    });

    if (!scriptContent) {
        throw new Error('Script tag not found');
    }

    // Use a regex to extract the JSON string inside JSON.parse
    const jsonStringMatch = scriptContent.match(/JSON\.parse\("(.*?)"\);/);
    const jsonString = jsonStringMatch[1];

    // Unescape the JSON string
    const unescapedJsonString = jsonString.replace(/\\"/g, '"');

    // Parse the JSON string into a JavaScript object
    try {
        const dataObject = JSON.parse(unescapedJsonString);
        console.log(dataObject); // Output the parsed data

        // const { page: pageNumber, classifiedsData } = data?.props?.pageProps?.pageProps || {}
        // fs.writeFileSync('./immonet.json', JSON.stringify(classifiedsData))
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
}

const crawler = async () => {
    try {
        await middleware(scrapeData);
    } catch (error) {
        console.error("Immonet Error:", error);
    }
}

export const immonetCrawler = crawler;


