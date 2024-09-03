import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async ({ page, collection, type }) => {
    const BASE_URL = 'https://home.meinestadt.de/deutschland/plz-9'
    await page.goto(BASE_URL);

    const zipCodes = await page.evaluate(() => {
        const rows = document.querySelectorAll(".m-table__row")
        const data = [];
        rows.forEach(row => {
            const zipCodeElements = row.querySelectorAll('[data-label="PLZ"] .m-table__dataInnerValue .m-textLink__linktext');
            const zipCodes = Array.from(zipCodeElements).map(el => el.innerText);

            if (zipCodes.length > 0) {
                // Extract other values
                const city = row.querySelector('[data-label="Stadt"] .m-table__dataInner').innerText.trim();
                const district = row.querySelector('[data-label="Stadtteil"] .m-table__dataInner').innerText.trim();
                const county = row.querySelector('[data-label="Landkreis"] .m-table__dataInner').innerText.trim();

                const rowData = {
                    zipCodes,
                    city,
                    district,
                    county,
                };
                console.log(rowData);
                data.push(rowData);
            }
        });
        return data;
    });

    console.log(zipCodes)
    // await collection.insertMany(zipCodes)
}

const crawler = async (type) => {
    await middleware(scrapeData, { type });
}


export const zipCodeCrawler = crawler;

