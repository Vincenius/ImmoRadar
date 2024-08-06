// https://www.wg-gesucht.de/1-zimmer-wohnungen-und-wohnungen-in-Berlin.8.1+2.1.0.html?offer_filter=1&city_id=8&sort_order=0&noDeact=1&categories%5B%5D=1&categories%5B%5D=2

import fs from 'fs';
import { middleware } from './utils/middleware.js'
import { delay } from './utils/utils.js'

const scrapeData = async (page, collection, type) => {
    let currentPage = 1;
    let lastPage = 1;
    let data = [];
    let count = 0;
    let error;
    const result = []

    const prevEntries = await collection.find({ provider: "wg-gesucht.de" }, { projection: { url: 1 } }).toArray();

    while (lastPage && currentPage <= lastPage && !error) {
        console.log('WG Gesucht SCRAPING', currentPage, 'OF', lastPage);
        // TODO page
        const BASE_URL = 'https://www.wg-gesucht.de/1-zimmer-wohnungen-und-wohnungen-in-Berlin.8.1+2.1.0.html?offer_filter=1&city_id=8&sort_column=0&sort_order=0&noDeact=1&categories%5B%5D=1&categories%5B%5D=2&rent_types%5B%5D=2'
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

        lastPage = 4 // newLastPage; -> todo

        const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link));
        count += newLinks.length;

        for (const link of newLinks) {
            console.log('scraping', link)
            // wait between 2-6 seconds
            await delay(2000 + Math.floor(Math.random() * 4000)); // TODO Fix captcha error
            await page.goto(link);

            const subPageData = await page.evaluate(async () => {
                const pageData = {
                    provider: "wg-gesucht.de",
                    created_at: new Date(),
                };
                const titleElement = document.querySelector('h1.headline');
                pageData.title = titleElement ? titleElement.textContent.trim() : '';

                const dateAvailableElement = document.querySelector('#main_content .row:nth-child(6) .col-xs-12:nth-child(2) .row:nth-child(2) .col-xs-6:nth-child(2) .section_panel_value') 
                pageData.date = dateAvailableElement ? dateAvailableElement.textContent.trim() : '';

                const keyFactElemets = document.querySelectorAll('.key_fact_value');
                pageData.livingSpace = keyFactElemets[0] ? parseInt(keyFactElemets[0].textContent.replace('m²', '').trim()) : '';
                pageData.price = {
                    value: keyFactElemets[1] ? parseInt(keyFactElemets[1].textContent.replace('€', '').trim()) : '',
                    currency: '€',
                    additionalInfo: ""
                }
                pageData.rooms = keyFactElemets[2] ? parseInt(keyFactElemets[2].textContent.trim()) : null;

                const addressElement = document.querySelector('a[href="#mapContainer"] .section_panel_detail')
                    .innerHTML.trim().split("<br>").map(el => el.replace(/\n/g, ' ').trim()) // [ "Mierendorffstrasse 31", "10589 Berlin" ]
                const [zipCode, ...cityElems] = addressElement[1].split(" ") // [ "10589", "Berlin" ]
                pageData.address = {
                    street: addressElement[0] || '',
                    zipCode,
                    city: cityElems.join(" ") || '',
                    district: '',
                    geolocation: null,
                }

                const gallery = []
                document.querySelectorAll('.sp-image').forEach(imgElement => {
                    const src = imgElement.getAttribute('src')
                    if (src.startsWith('https://') && !gallery.find(g => g.url === src)) {
                        gallery.push({ url: imgElement.getAttribute('src'), alt: imgElement.getAttribute('alt') })
                    };
                });

                pageData.gallery = gallery;
                pageData.company = null;

                const rawFeatures = []
                document.querySelectorAll('.utility_icons .text-center').forEach(el => {
                    const content = el.textContent
                        .replace(/\n/g, ' ') // remove new lines
                        .replace(/\s+/g, ' ').trim() // remove multiple spaces
                    content.split(',').forEach(e => {
                        rawFeatures.push(e.trim())
                    })
                })

                pageData.rawFeatures = rawFeatures;

                // return {
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

                result.push(subPageData)

                // await collection.insertOne(subPageData) // todo
            } else {
                console.log(`Failed to extract data from ${link}`);
                error = true;
            }
        }
    }

    fs.writeFileSync(`./wg-gesucht.json`, JSON.stringify(result));
}

const crawler = async (type) => {
    await middleware(scrapeData, type);
}

export const wgGesuchtCrawler = crawler;
