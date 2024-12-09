import { middleware } from './utils/middleware.js'
import { parseFeatures } from './utils/parseFeatures.js'
import { archiveEntries } from './utils/archive.js'

const mapPriceType = {
    "Kaltmiete zzgl. Nebenkosten": "COLD_RENT",
    "Warmmiete": "WARM_RENT",
    "PURCHASE_PRICE": "PURCHASE_PRICE",
}

const parseData = (estates, searchUrl) => estates.map(e => {
    const result = {
        id: e.id,
        created_at: new Date(),
        url: `${e.url}`,
        provider: "immowelt.de",
        searchUrl,
        date: e.metadata.creationDate,
        price: {
            value: parseFloat(e.hardFacts.price.value.replace(/[^\d,]/g, '').replace(',', '.')),
            currency: "EUR",
            additionalInfo: mapPriceType[e.hardFacts.price.additionalInformation || e.hardFacts.price.addition.value],
        },
        livingSpace: e.hardFacts.facts.find(f => f.type === "livingSpace")?.splitValue || null,
        rooms: e.hardFacts.facts.find(f => f.type === "numberOfRooms")?.splitValue || null,
        // availability: e.hardFacts.facts.find(f => f.type === "availability")?.splitValue || "Now",
        address: {
            zipCode: e.location.address.zipCode,
            city: e.location.address.city,
            district: e.location.address.district,
            street: e.location.address.street,
        },
        title: e.mainDescription.headline.trim(),
        gallery: e.gallery ? e.gallery.images.map(p => ({ url: p.url, alt: p.alt })) : [],
        features: [],
        company: e.provider.intermediaryCard?.title || null,
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
            await page.waitForSelector('[data-testid="serp-core-scrollablelistview-testid"]')

            const content = await page.content();
            const scriptMatch = content.match(/window\["__UFRN_FETCHER__"\]=JSON\.parse\("(.+?)"\);/);
            
            if (scriptMatch && scriptMatch[1]) {
                let jsonData = scriptMatch[1].trim();
    
                try {
                    // Parse the JSON data
                    const housingData = JSON.parse(JSON.parse(`"${jsonData}"`));
                    const pageProps = housingData.data['classified-serp-init-data'].pageProps
                    lastPage = Math.ceil(pageProps.totalCount / 30)
                    currentPage++;

                    // Access the specific data you need
                    if (pageProps.enrichedClassifiedsData && pageProps.classifiedsData) {
                        const estates = Object.values(pageProps.classifiedsData)
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
            await archiveEntries({ collection, query: { id: { $in: toRemove } } });
            const message = `Immowelt - Scraped ${count} new estates and removed ${toRemove.length} old estates.`;
            await logEvent({ scraper: 'immowelt.de', success: true, message });
            console.log(message);
        } else if (!error) {
            const message = `Immowelt - Scraped ${count} new estates`;
            await logEvent({ scraper: 'immowelt.de', success: true, message });
            console.log(message);
        }
    } catch (error) {
        const errorMsg = 'Unexpected error scraping Immowelt: ' + error
        console.error(errorMsg);
        await logEvent({ scraper: 'immowelt.de', success: false, message: errorMsg });
    }
}

// https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=299&priceMin=10&order=DateDesc
const scrapeUrls = [
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=299&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=359&priceMin=300&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=429&priceMin=360&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=509&priceMin=430&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=609&priceMin=510&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=729&priceMin=610&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=899&priceMin=730&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=1149&priceMin=900&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=1499&priceMin=1150&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMax=1999&priceMin=1500&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Rent&estateTypes=Apartment&locations=AD02DE1&priceMin=2000&order=DateDesc',
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
