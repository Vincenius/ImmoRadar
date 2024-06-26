import fs from 'fs';
import { getBrowser } from './utils/playwright.js'

// TODO: optional parameter / scrape all or just recents
const scrapeData = async (page) => {
    let currentPage = 1;
    let lastPage = 1;
    let error;
    let data = [];

    while (lastPage && currentPage <= lastPage && !error) {
        console.log('Immowelt SCRAPING', currentPage, 'OF', lastPage);
        const BASE_URL = 'https://www.immowelt.de/suche/berlin/wohnungen/mieten?d=true&sd=DESC&sf=TIMESTAMP';

        await page.goto(BASE_URL + `&sp=${currentPage}`);

        const content = await page.content();

        const scriptRegex = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/;
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
                lastPage = housingData.initialState.estateSearch.ui.pagination.pagesCount
                currentPage++;

                // Access the specific data you need
                if (housingData.initialState && housingData.initialState.estateSearch && housingData.initialState.estateSearch.data && housingData.initialState.estateSearch.data.estates) {
                    const estates = housingData.initialState.estateSearch.data.estates;

                    data = [...data, ...estates]
                } else {
                    console.log(content, 'Housing data not found');
                    error = true;
                }
            } catch (err) {
                console.error(err, 'Failed to parse JSON data');
                error = true;
            }
        } else {
            console.log(content, 'Script tag with JSON data not found');
            error = true;
        }
    }

    console.log('Scraped', data.length, 'elements')
    // TODO parse data
    // TODO handle database
    fs.writeFileSync('./immowelt.json', JSON.stringify(data))
}

const crawler = async () => {
    try {
        await getBrowser(scrapeData);
    } catch (error) {
        console.error("Immowelt Error:", error);
    }
}

export const immoweltCrawler = crawler;
