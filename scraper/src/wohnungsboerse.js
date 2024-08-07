import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async ({ page }) => {
    const BASE_URL = 'https://www.wohnungsboerse.net/searches/index?isSearch=1&country=DE&page=1&estate_marketing_types=miete%2C1&marketing_type=miete&estate_types%5B%5D=1&cities%5B%5D=Berlin&zipcodes%5B%5D=&umkreiskm=&minprice=&maxprice=&minsize=&maxsize=&minrooms=&maxrooms=';
    await page.goto(BASE_URL);

    // const scriptContent = await page.evaluate(() => {
    //     // Find all script tags
    //     const scripts = document.querySelectorAll('script');

    //     // Iterate over scripts to find the one containing `window["__UFRN_FETCHER__"]`
    //     for (let script of scripts) {
    //         if (script.innerHTML.includes('window["__UFRN_FETCHER__"]')) {
    //             return script.innerHTML;
    //         }
    //     }

    //     // Return null if no matching script is found
    //     return null;
    // });

}

const crawler = async (type) => {
    try {
        await middleware(scrapeData, type);
    } catch (error) {
        console.error("Wohnungsboerse Error:", error);
    }
}

export const wohnungsboerseCrawler = crawler;


