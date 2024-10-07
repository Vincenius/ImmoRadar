import { middleware } from './utils/middleware.js'
import { parseFeatures } from './utils/parseFeatures.js';
import { getZipByAddress } from './utils/utils.js'

const scrapeData = async ({ page, collection, logEvent, type }) => {
    try {
        let data = [];

        const providers = ["howoge.de", "gewobag.de", "stadtundland.de", "degewo.de", "wbm.de", "gesobau.de"];
        const prevEntries = await collection.find(
            { provider: { $in: providers } },
            { projection: { id: 1 } }
        ).toArray();

        console.log('inberlinwohnen SCRAPING');
        const BASE_URL = 'https://inberlinwohnen.de/wohnungsfinder/'

        await page.goto(BASE_URL);

        const pageData = await page.evaluate(async () => {
            const pageData = [];
            const providerMap = {
                'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/howoge-small-grey.jpg': 'howoge.de',
                'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/gewobag-small-grey.jpg': 'gewobag.de',
                'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/stadtundland-small-grey.jpg': 'stadtundland.de',
                'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/degewo-small-grey.jpg': 'degewo.de',
                'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/wbm-small-grey.jpg': 'wbm.de',
                'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/gesobau-small-grey.jpg': 'gesobau.de',
            }

            document.querySelectorAll('.tb-merkflat').forEach(el => {
                const logo = el.querySelector('.alg_c img')
                const id = el.getAttribute('id')

                const livingSpaceRow = Array.from(el.querySelectorAll('.tb-small-data tr')).find(row => {
                    return row.textContent.includes('Wohnfläche');
                });

                const livingSpace = livingSpaceRow ? parseFloat(
                    livingSpaceRow.querySelector('.alg_r').textContent.replace(' m²', '').replace(',', '.').trim()
                ) : null;

                const rawFeatures = Array.from(el.querySelectorAll('.tb-flatdet-smaller .hackerl')).map(feat => feat.textContent.trim())
                const featureMap = {
                    'Balkon/Loggia/Terrasse': 'BALCONY',
                    'Aufzug': 'PASSENGER_LIFT',
                    'Keller': 'BASEMENT',
                    'Badewanne': 'BATH_WITH_TUB',
                    'Barrierefrei': 'WHEELCHAIR_ACCESSIBLE',
                    'Seniorenwohnung': 'SENIOR_FRIENDLY',
                    'Gäste-WC': 'GUEST_TOILET'
                }
                const amount = el.querySelector('._tb_left strong:nth-child(3)');

                pageData.push({
                    id,
                    created_at: new Date(),
                    provider: providerMap[logo.src],
                    title: el.querySelector('h2').textContent,
                    url: 'https://inberlinwohnen.de' + el.querySelector('.org-but').getAttribute('href'),
                    price: {
                        value: parseFloat(
                            amount ? amount.textContent.replace('.', '').replace(',', '.') : null
                        ),
                        currency: 'EUR',
                        additionalInfo: 'Kaltmiete'
                    },
                    livingSpace,
                    rooms: parseInt(el.querySelector('._tb_left strong:nth-child(1)').textContent),
                    address: {
                        city: "Berlin",
                        district: (el.querySelector('.map-but').textContent.trim().split(',')[1] || '').trim(),
                        street: el.querySelector('.map-but').textContent.trim().split(',')[0].trim(),
                    },
                    gallery: [{
                        url: el.querySelector('.flat-image').getAttribute('style')
                            .replace('background-image:url(', '').replace(');', ''),
                        alt: el.querySelector('h2').textContent
                    }],
                    features: rawFeatures.map(feat => featureMap[feat]).filter(Boolean),
                })
            })

            return pageData;
        });

        const filteredData = pageData.filter(d => !prevEntries.find(e => e.id === d.id));

        for (let i = 0; i < filteredData.length; i++) {
            const newElem = {
                ...filteredData[i],
                address: {
                    ...filteredData[i].address,
                    zipCode: await getZipByAddress(filteredData[i].address)
                },
                features: parseFeatures(filteredData[i])
            }

            data.push(newElem)
        }

        if (data && data.length > 0) {
            await collection.insertMany(data);
        }

        console.log('data', pageData[0])

        console.log('preventries', prevEntries[0])

        const toRemove = prevEntries
            .filter(e => pageData.indexOf(e.id) === -1)
            .map(e => e.id);

        // Remove multiple entries by _id
        const result = await collection.deleteMany({ id: { $in: toRemove } });

        console.log(`inberlinwohnen.de scraped ${data.length} new estates & deleted ${result.deletedCount} old ones` );
        await logEvent({ scraper: 'inberlinwohnen.de', success: true, message: `scraped ${data.length} new estates & deleted ${result.deletedCount} old ones` });
    } catch (err) {
        console.error('inberlinwohnen.de unexpected error', err);
        await logEvent({ scraper: 'inberlinwohnen.de', success: false, message: err });
    }
}

const crawler = (type) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            await middleware(scrapeData, { type, useProxy: true, preventScripts: true })
            resolve()
        } catch (e) {
            console.log('error on immobilienscout crawler', e)
            reject(e)
        }
    })
}


export const inberlinwohnenCrawler = crawler;
