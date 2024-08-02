// https://www.wg-gesucht.de/1-zimmer-wohnungen-und-wohnungen-in-Berlin.8.1+2.1.0.html?offer_filter=1&city_id=8&sort_order=0&noDeact=1&categories%5B%5D=1&categories%5B%5D=2

import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async (page, collection, type) => {
    let currentPage = 1;
    let lastPage = 1;
    let data = [];
    let count = 0;
    let error;

    const prevEntries = await collection.find({ provider: "wg-gesucht.de" }, { projection: { url: 1 } }).toArray();

    while (lastPage && currentPage <= lastPage && !error) {
        console.log('WG Gesucht SCRAPING', currentPage, 'OF', lastPage);
        // TODO page
        const BASE_URL = 'https://www.wg-gesucht.de/1-zimmer-wohnungen-und-wohnungen-in-Berlin.8.1+2.1.0.html?offer_filter=1&city_id=8&sort_order=0&noDeact=1&categories%5B%5D=1&categories%5B%5D=2'
        await page.goto(BASE_URL);
        currentPage++;

        const [links, newLastPage] = await page.evaluate(() => {
            const pages = document.querySelectorAll(".page-link")
            lastPage = parseInt(pages[pages.length - 2].textContent)

            const linkElements = document.querySelectorAll('h3.truncate_title a');
            const urls = [];
            linkElements.forEach(el => {
                const url = el.getAttribute('href');
                if (url && url.startsWith('/') && url.endsWith('.html')) {
                    urls.push(`https://www.wg-gesucht.de${url}`);
                }
            });
            return [urls, lastPage];
        });

        data = [...data, ...links]

        // lastPage = newLastPage; -> todo

        const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link));
        count += newLinks.length;

        for (const link of newLinks) {
            await page.goto(link);

            const subPageData = await page.evaluate(async () => {
                const pageData = {
                    provider: "wg-gesucht.de",
                    created_at: new Date(),
                };
                const titleElement = document.querySelector('h1.headline');
                pageData.title = titleElement ? titleElement.textContent.trim() : '';

                const dateAvailableElement = document.querySelector('#main_content .row:nth-child(6) .col-xs-12:nth-child(2) .row:nth-child(2) .col-xs-6:nth-child(2) .section_panel_value') 
                //  https://www.wg-gesucht.de/wohnungen-in-Berlin-Schoeneberg.10940551.html

                // return {
                //     date: e['@publishDate'],
                //     price: {
                //         value: e['resultlist.realEstate'].price.value,
                //         currency: e['resultlist.realEstate'].price.currency,
                //         additionalInfo: "COLD_RENT"
                //     },
                //     livingSpace: e['resultlist.realEstate'].livingSpace,
                //     rooms: e['resultlist.realEstate'].numberOfRooms,
                //     // "availabiltiy": "Now",
                //     address: {
                //         zipCode: e['resultlist.realEstate'].address.postcode,
                //         city: e['resultlist.realEstate'].address.city,
                //         district: e['resultlist.realEstate'].address.quarter,
                //         street: `${e['resultlist.realEstate'].address.street || ''} ${e['resultlist.realEstate'].address.houseNumber || ''}`.trim(),
                //         geolocation: e['resultlist.realEstate'].address.wgs84Coordinate ? {
                //             lat: e['resultlist.realEstate'].address.wgs84Coordinate.latitude,
                //             lon: e['resultlist.realEstate'].address.wgs84Coordinate.longitude,
                //         } : null
                //     },
                //     gallery: gallery
                //         .filter(a => a.urls && a.urls.length)
                //         .map(a => a.urls.map(u => u.url['@href'].replace("%WIDTH%", "420").replace("%HEIGHT%", "315")))
                //         .flat()
                //         .map(u => ({ url: u })),
                //     company: e['resultlist.realEstate'].privateOffer === 'true' ? 'Privat' : e['resultlist.realEstate'].contactDetails?.company || null,
                //     features: mapFeatures((e.realEstateTags && e.realEstateTags.tag)
                //         ? (typeof e.realEstateTags.tag) === 'string'
                //             ? [e.realEstateTags.tag]
                //             : e.realEstateTags.tag
                //         : []),
                // }

                return pageData
            })

            if (subPageData) {
                subPageData.id = link;
                subPageData.url = link;

                console.log('Scraped data from sub-page', link, subPageData);

                // await collection.insertOne(subPageData) // todo
            } else {
                console.log(`Failed to extract data from ${link}`);
                error = true;
            }
        }
    }
}

const crawler = async (type) => {
    await middleware(scrapeData, type);
}

export const wgGesuchtCrawler = crawler;
