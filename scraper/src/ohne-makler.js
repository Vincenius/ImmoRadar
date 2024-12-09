import { middleware } from './utils/middleware.js'
import { parseFeatures } from './utils/parseFeatures.js';
import { parseCurrencyString, germanDateToIso, germanAltDateToIso } from './utils/utils.js'
import { archiveEntries } from './utils/archive.js'

const featureMap = {
    'Keller': 'BASEMENT',
    'Einbauküche': 'FITTED_KITCHEN',
    'Barrierefrei': 'WHEELCHAIR_ACCESSIBLE',
    'Balkon': 'BALCONY',
    'Vollbad': 'BATH_WITH_TUB',
    'Terrasse': 'TERRACE',
    'Garten': 'GARDEN',
    'Gäste-WC': 'GUEST_TOILET',
    'Fahrstuhl': 'PASSENGER_LIFT',
    'Dachterrasse': 'TERRACE',
}

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
            const BASE_URL = `${searchUrl}?page=${currentPage}`
            currentPage++;

            await page.goto(BASE_URL);

            const [links, newLastPage] = await page.evaluate(() => {
                const pages = document.querySelectorAll("ul .align-items")
                const lastPageElem = pages[pages.length - 1]
                lastPage = lastPageElem
                    ? parseInt(lastPageElem.textContent)
                    : 1

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

            const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link))
            count += newLinks.length;


            for (const link of newLinks) {
                await page.goto(link);

                // Extract and parse the script content
                const subPageData = await page.evaluate(async () => {
                    const titleElement = document.querySelector('h1');
                    const priceElement = document.querySelector('.animation-underline')
                    const livingSpaceElement = document.querySelector('.order-2 div:last-child .whitespace-nowrap')
                    const roomsElement = document.querySelector('.order-2 div:first-child .whitespace-nowrap')
                    const addressText = document.querySelector('h1+a .leading-normal').textContent.trim();
                    const cleanedAddress = addressText.replace(/\s+/g, ' ').trim();
                    const gallery = []
                    document.querySelectorAll('swiper-slide .object-cover').forEach(el => {
                        gallery.push({
                            url: el.getAttribute('src'),
                            alt: el.getAttribute('alt')
                        })
                    });
                    const featuresLabel = Array.from(document.querySelectorAll('td')).find(td => td.textContent.trim() === 'Ausstattung');
                    let features = []
                    if (featuresLabel) {
                        const rawFeatures = featuresLabel.nextElementSibling.textContent.trim();
                        features = rawFeatures.split(',').map(f => f.trim());
                    }

                    function formatAddress(input) {
                        const regex = /^(?:(.+),\s*)?(\d{5})\s*([^\(–]+)(?:\s*\(([^)]+)\))?/;
                        const match = input.match(regex);
                        if (!match) {
                            return null; // Return null if the input doesn't match the expected format
                        }
                        const [, address, zip, city, district] = match;
                        return {
                            street: address ? address.trim() : null,
                            zipCode: zip.trim(),
                            city: city.trim(),
                            district: district ? district.trim() : null
                        };
                    }

                    if (!livingSpaceElement) { // ignore gewerbe
                        return null
                    }

                    const pageData = {
                        provider: "ohne-makler.net",
                        created_at: new Date(),
                        title: titleElement?.textContent.trim() || null,
                        price: {
                            value: parseInt(priceElement.textContent.split(' €')[0].replace('.', '')),
                            currency: 'EUR',
                            additionalInfo: 'COLD_RENT',
                        },
                        livingSpace: parseFloat(livingSpaceElement.textContent.replace(' m²', '').replace('.', '').replace(',', '.')),
                        rooms: parseFloat(roomsElement.textContent.replace(' m²', '').replace(',', '.')),
                        address: formatAddress(cleanedAddress),
                        gallery,
                        features
                    };

                    return pageData
                })

                if (subPageData) {
                    const id = link.match(/\/(\d+)\//)[1];
                    subPageData.id = id;
                    subPageData.url = link
                    subPageData.searchUrl = searchUrl
                    subPageData.features = subPageData.features.map(feat => featureMap[feat]).filter(Boolean)
                    subPageData.features = parseFeatures(subPageData);

                    await collection.insertOne(subPageData)
                }
            }

            if (type === 'NEW_SCAN' && newLinks.length < (links.length - 5)) { // -5 tolerance
                console.log('Found old entries on page - quit scan');
                lastPage = currentPage - 1;
            }
        }

        if (type === 'FULL_SCAN' && !error) {
            const toRemove = prevEntries
                .filter(e => data.indexOf(e.url) === -1)
                .map(e => e.url);

            // Remove multiple entries by _id
            await archiveEntries({ collection, query: { url: { $in: toRemove } }});
            const message = `Ohne Makler - Scraped ${count} new estates and removed ${toRemove.length} old estates.`;
            await logEvent({ scraper: 'ohne-makler.net', success: true, message });
            console.log(message);
        } else if (!error) {
            const message = `Ohne Makler - Scraped ${count} new estates`;
            await logEvent({ scraper: 'ohne-makler.net', success: true, message });
            console.log(message);
        } else if (error) {
            await logEvent({ scraper: 'ohne-makler.net', success: false, message: `Errors occured on scraping Ohne Makler, it still scraped ${count} new estates` });
        }
    } catch (error) {
        const message = 'Ohne Makler - Unexpected occured ' + error;
        console.error(message);
        await logEvent({ scraper: 'ohne-makler.net', success: false, message });
    }
}

const scrapeUrls = [
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/baden-wurttemberg/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/bayern/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/hamburg/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/hessen/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/rheinland-pfalz/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/sachsen/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/sachsen-anhalt/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/schleswig-holstein/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/thuringen/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/berlin/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/brandenburg/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/mecklenburg-vorpommern/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/niedersachsen/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/nordrhein-westfalen/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/saarland/',
    'https://www.ohne-makler.net/immobilien/immobilie-mieten/bremen/',
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
