import { middleware } from './utils/middleware.js'
import { parseFeatures } from './utils/parseFeatures.js'

const mapPriceType = {
    "COLD_RENT": "COLD_RENT",
    "RENT_INCLUDING_HEATING": "WARM_RENT",
    "PURCHASE_PRICE": "PURCHASE_PRICE",
}

const mapFeatures = {
    "CELLAR_SHARE": "BASEMENT",
    "BARRIER_FREE": "WHEELCHAIR_ACCESSIBLE",
    "PARKING_AREA": "CAR_PARK",
    "UNDERGROUND_PARKING": "CAR_PARK",
    "PARTLY_AIR_CONDITIONED": "AIR_CONDITIONED",
    "RENOVATED": "FULLY_RENOVATED",
}

const parseData = (estates, searchUrl) => estates.map(e => {
    const result = {
        id: e.id,
        created_at: new Date(),
        url: `https://www.immowelt.de/expose/${e.onlineId}`,
        provider: "immowelt.de",
        searchUrl,
        date: e.timestamp,
        price: {
            value: e.primaryPrice?.amountMax,
            currency: e.primaryPrice?.currency,
            additionalInfo: mapPriceType[e.primaryPrice?.type] || e.primaryPrice?.type,
        },
        livingSpace: e.primaryArea?.sizeMin,
        rooms: e.roomsMin,
        // "availabiltiy": "Now",
        address: {
            zipCode: e.place.postcode,
            city: e.place.city,
            district: e.place.district,
            street: e.place.street,
            geolocation: e.place.point ? {
                lat: e.place.point.lat,
                lon: e.place.point.lon,
            } : null
        },
        title: e.title.trim(),
        gallery: e.pictures.map(p => ({ url: p.imageUri, alt: p.description })),
        features: e.features.map(f => mapFeatures[f] || f),
        company: e.broker?.companyName
            ? e.broker?.companyName.trim()
            : null,
    }

    return {
        ...result,
        features: parseFeatures(result)
    }
})

const scrapeData = async ({ page, collection, type, logEvent, searchUrl }) => {
    try {
        const BASE_URL = searchUrl;
        let currentPage = 1;
        let lastPage = 1;
        let error;
        let data = [];
        let count = 0;
        const prevEntries = await collection.find({ provider: "immowelt.de", searchUrl }, { projection: { id: 1 } }).toArray();

        while (lastPage && currentPage <= lastPage && !error) {
            console.log('Immowelt SCRAPING', currentPage, 'OF', lastPage, searchUrl);

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
                        const parsedData = parseData(estates, searchUrl)
                        const newData = parsedData.filter(d => !prevEntries.find(p => p.id === d.id))

                        if (newData.length) {
                            await collection.insertMany(newData)
                        }

                        if (type === 'NEW_SCAN' && newData.length < parsedData.length) {
                            console.log('Found old entries on page - quit scan');
                            lastPage = currentPage - 1;
                        }

                        count += newData.length;
                        data = [...data, ...parsedData]
                    } else {
                        const message = `${content} - Housing data not found`
                        await logEvent({ scraper: 'immowelt.de', success: false, message });
                        console.log(message);
                        error = true;
                    }
                } catch (err) {
                    const message = `${err} - Failed to parse JSON data`
                    await logEvent({ scraper: 'immowelt.de', success: false, message });
                    console.error(message);
                    error = true;
                }
            } else {
                const message = `${content} - Script tag with JSON data not found`
                await logEvent({ scraper: 'immowelt.de', success: false, message });
                console.log(message);
                error = true;
            }
        }

        if (type === 'FULL_SCAN' && !error) {
            const toRemove = prevEntries
                .filter(e => !data.find(d => d.id === e.id))
                .map(e => e.id);

            // Remove multiple entries by _id
            const result = await collection.deleteMany({ id: { $in: toRemove } });
            const message = `Immowelt - Scraped ${count} new estates and removed ${result.deletedCount} old estates.`;
            await logEvent({ scraper: 'immowelt.de', success: true, message });
            console.log(message);
        } else if (!error) {
            const message = `Immowelt - Scraped ${count} new estates`;
            await logEvent({ scraper: 'immowelt.de', success: true, message });
            console.log(message);
        }
    } catch (error) {
        const errorMsg = 'Unexpected error scraping Immobilienscout24: ' + error
        console.error(errorMsg);
        await logEvent({ scraper: 'immowelt.de', success: false, message: errorMsg });
    }
}

const scrapeUrls = [
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=299&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=359&pmi=300&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=429&pmi=360&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=509&pmi=430&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=609&pmi=510&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=729&pmi=610&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=899&pmi=730&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pma=1499&pmi=1150&sd=DESC&sf=TIMESTAMP&sp=1',
    'https://www.immowelt.de/suche/deutschland/wohnungen/mieten?d=true&pmi=1500&sd=DESC&sf=TIMESTAMP&sp=1',
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

export const immoweltCrawler = crawler;
