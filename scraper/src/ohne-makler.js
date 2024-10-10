import { middleware } from './utils/middleware.js'
import { parseFeatures } from './utils/parseFeatures.js';
import { parseCurrencyString, germanDateToIso, germanAltDateToIso } from './utils/utils.js'

const scrapeData = async ({ page, collection, type, logEvent, searchUrl }) => {
    try {
        let currentPage = 1;
        let lastPage = 1;
        let data = [];
        let count = 0;
        let error;

        const prevEntries = await collection.find({ provider: "ohne-makler.net", searchUrl }, { projection: { url: 1 } }).toArray();

        while (lastPage && currentPage <= lastPage && !error) {
            console.log('Ohne Makler SCRAPING', currentPage, 'OF', lastPage, searchUrl);
            const BASE_URL = `${searchUrl}/?page=${currentPage}`
            currentPage++;

            await page.goto(BASE_URL);

            const [links, newLastPage] = await page.evaluate(() => {
                const pages = document.querySelectorAll("ul .align-items")
                lastPage = parseInt(pages[pages.length - 1].textContent)

                const linkElements = document.querySelectorAll('a[data-om-type="RENT"]');
                const urls = [];
                linkElements.forEach(el => {
                    const href = el.getAttribute('href');
                    if (href) {
                        urls.push(`https://www.ohne-makler.net${href}`);
                    }
                });
                return [urls, lastPage];
            });

            if (newLastPage > lastPage) {
                lastPage = newLastPage
            }

            // todo go through pages
        }
    } catch (error) {
        const message = 'Ohne Makler - Unexpected occured ' + error;
        console.error(message);
        await logEvent({ scraper: 'ohne-makler.net', success: false, message });
    }
}

const scrapeUrls = [
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/baden-wurttemberg/',
]

const crawler = (type) => {
    return scrapeUrls.map(searchUrl => {
        return () => new Promise(async (resolve, reject) => {
            try {
                await middleware(scrapeData, { type, searchUrl, preventScripts: true })
                resolve()
            } catch (e) {
                console.log('error on immowelt crawler', e)
                reject(e)
            }
        })
    })
}

export const ohneMaklerCrawler = crawler;
