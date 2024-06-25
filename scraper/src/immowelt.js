import fs from 'fs';
import { getBrowser } from './utils/playwright.js'

const scrapeData = async (page) => {
    const BASE_URL = 'https://www.immowelt.de/suche/berlin/wohnungen/mk?d=true&sd=DESC&sf=TIMESTAMP&sp=1';
    await page.goto(BASE_URL);

    const content = await page.content();

    const scriptRegex = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/;

    // Find the script tag and extract the content
    const scriptMatch = content.match(scriptRegex);
    if (scriptMatch && scriptMatch[1]) {
        let jsonData = scriptMatch[1].trim();

        // Remove potential HTML comments surrounding the JSON data
        if (jsonData.startsWith('<!--')) {
            jsonData = jsonData.slice(4);
        }
        if (jsonData.endsWith('-->')) {
            jsonData = jsonData.slice(0, -3);
        }
        try {
            // Parse the JSON data
            const housingData = JSON.parse(jsonData);
            console.log(housingData);

            // Access the specific data you need
            if (housingData.initialState && housingData.initialState.estateSearch && housingData.initialState.estateSearch.data && housingData.initialState.estateSearch.data.estates) {
                const estates = housingData.initialState.estateSearch.data.estates;

                fs.writeFileSync('./immowelt.json', JSON.stringify(estates))
            } else {
                console.log('Housing data not found');
            }
        } catch (err) {
            console.error('Failed to parse JSON data:', err);
        }
    } else {
        console.log('Script tag with JSON data not found');
    }
}

const crawler = async () => {
    try {
        await getBrowser(scrapeData);
    } catch (error) {
        console.error("Immowelt Error:", error);
    }
}

export const immoweltCrawler = crawler;
