import { middleware } from './utils/middleware.js'
import { parseCurrencyString, germanDateToIso } from './utils/utils.js'

import fs from 'fs'

const scrapeData = async (page, collection, type) => {
    let currentPage = 1;
    let lastPage = 10;
    let data = [];
    const tmpData =[]
    let count = 0;
    let error;

    const prevEntries = await collection.find({ provider: "kleinanzeigen.de" }, { projection: { url: 1 } }).toArray();

    while (lastPage && currentPage <= lastPage && !error) {
        console.log('Kleinanzeigen SCRAPING', currentPage, 'OF', lastPage);
        const BASE_URL = `https://www.kleinanzeigen.de/s-wohnung-mieten/berlin/anzeige:angebote/seite:${currentPage}/c203l3331+wohnung_mieten.swap_s:nein`
        currentPage++;

        await page.goto(BASE_URL);

        const [links, newLastPage] = await page.evaluate(() => {
            const pages = document.querySelectorAll(".pagination-page")
            lastPage = parseInt(pages[pages.length - 1].textContent)

            const linkElements = document.querySelectorAll('article.aditem');
            const urls = [];
            linkElements.forEach(el => {
                const url = el.getAttribute('data-href');
                if (url) {
                    urls.push(`https://www.kleinanzeigen.de${url}`);
                }
            });
            return [urls, lastPage];
        });

        data.push(links)

        // lastPage = newLastPage;

        const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link));

        // Loop through each link, navigate to the page, and scrape data
        // TODO only if scrape all
        for (const link of newLinks) {
            await page.goto(link);

            // Extract and parse the script content
            const subPageData = await page.evaluate(async () => {
                const pageData = {
                    provider: "kleinanzeigen.de",
                };

                const rawDetails = {};
                document.querySelectorAll('#viewad-details .addetailslist--detail').forEach(detailElement => {
                    const key = detailElement.childNodes[0].nodeValue.trim();
                    const value = detailElement.querySelector('.addetailslist--detail--value').textContent.trim();
                    rawDetails[key] = value;
                });

                const dateElement = document.querySelector('#viewad-extra-info .icon-calendar-gray-simple + span');
                pageData.date = dateElement ? dateElement.textContent.trim() : '';

                const priceElement = document.querySelector('#viewad-price');
                pageData.price = {
                    value: priceElement ? priceElement.textContent.trim() : '',
                    currency: 'EUR',
                    additionalInfo: rawDetails['Warmmiete']
                        ? rawDetails['Warmmiete'] === priceElement.textContent.trim() ? 'WARM_RENT' : 'COLD_RENT'
                        : null
                };

                pageData.livingSpace = parseInt(rawDetails['Wohnfläche'].replace(' m²', ''));
                pageData.rooms = parseInt(rawDetails['Zimmer']);
                pageData.availabiltiy = rawDetails['Verfügbar ab'];

                const lat = document.querySelector('meta[property="og:latitude"]')?.content || '';
                const lon = document.querySelector('meta[property="og:longitude"]')?.content || '';
                const rawLocality = document.querySelector('meta[property="og:locality"]')?.content || '';
                const district = rawLocality.split(" - ")[1] || rawLocality.split(" - ")[0]
                const streetElement = document.querySelector('#street-address');
                const street = streetElement ? streetElement.textContent.trim().replace(/,$/, '') : null;
                const localityElement = document.querySelector('#viewad-locality');
                const localityText = localityElement ? localityElement.textContent.trim() : '';
                const localityParts = localityText.split(' ');
                const zipCode = localityParts[0];

                pageData.address = {
                    zipCode,
                    district,
                    street,
                    geolocation: {
                        lat,
                        lon
                    }
                }

                const titleElement = document.querySelector('#viewad-title');
                pageData.title = titleElement ? titleElement.textContent.replace("Reserviert • Gelöscht • \n", "").trim() : '';

                pageData.gallery = [];
                document.querySelectorAll('.galleryimage-element img').forEach(imgElement => {
                    pageData.gallery.push({ url: imgElement.getAttribute('src'), alt: imgElement.getAttribute('alt') });
                });

                // TODO features: e.features,
                pageData.rawFeatures = [];
                document.querySelectorAll('#viewad-configuration .checktag').forEach(featureElement => {
                    pageData.rawFeatures.push(featureElement.textContent.trim());
                });

                const privateElement = document.querySelector('.userprofile-vip-details-text')
                const isPrivate = privateElement ? privateElement.textContent === 'Privater Nutzer' : false;
                
                if (isPrivate) {
                    pageData.company = "Privater Nutzer"
                } else {
                    const companyElement = document.querySelector('#viewad-bizteaser--title a')
                    pageData.company = companyElement ? companyElement.textContent : ''
                }

                return pageData;
            });

            if (subPageData) {
                console.log('Scraped data from sub-page', link);
                subPageData.link = link;
                subPageData.price.value = subPageData.price.value ? parseCurrencyString(subPageData.price.value) : '';
                subPageData.availabiltiy = subPageData.availabiltiy ? germanDateToIso(subPageData.availabiltiy) : '';
            
                if (subPageData.address.zipCode) {
                    const city = await fetch(`https://zip-api.eu/api/v1/info/DE-${subPageData.address.zipCode}`).then(res => res.json())
                    // TODO store zip - city mapping in database for less dependency on external API
                    subPageData.address.city = city
                }
    
                tmpData.push(subPageData);
                // Store the data
                // TODO STORE
            } else {
                console.log(`Failed to extract data from ${link}`);
                error = true;
            }
        }
    }

    fs.writeFileSync('./kleinanzeigen.json', JSON.stringify(tmpData))
}

const crawler = async (type) => {
    await middleware(scrapeData, type);
}

export const kleinanzeigenCrawler = crawler;
