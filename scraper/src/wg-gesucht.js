// https://www.wg-gesucht.de/1-zimmer-wohnungen-und-wohnungen-in-Berlin.8.1+2.1.0.html?offer_filter=1&city_id=8&sort_order=0&noDeact=1&categories%5B%5D=1&categories%5B%5D=2

import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async (page) => {
    const BASE_URL = 'https://www.kleinanzeigen.de/s-wohnung-mieten/c203'
    await page.goto(BASE_URL);
    // await delay(5000);

    const content = await page.content();
    console.log(content)
}

const crawler = async () => {
    await middleware(scrapeData);
}

export const wgGesuchtCrawler = crawler;
