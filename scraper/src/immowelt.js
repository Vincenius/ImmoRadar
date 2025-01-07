import { middleware } from './utils/middleware.js'

const parseData = (estates, searchUrl) => estates.map(e => {
    const result = {
        created_at: new Date(),
        provider: "immowelt.de",
        url: `${e.url}`,
        searchUrl,
        price: {
            value: parseFloat(e.hardFacts.price.value.replace(/[^\d,]/g, '').replace(',', '.')),
            currency: "EUR",
        },
        address: {
            zipCode: e.location.address.zipCode,
            city: e.location.address.city,
            district: e.location.address.district,
            street: e.location.address.street,
        },
        title: e.mainDescription.headline.trim(),
        size: parseFloat((e.hardFacts?.facts || []).find(f => f.type === "plotSpace")?.splitValue?.replace(',', '.')) || null,
        gallery: e.gallery ? e.gallery.images.map(p => ({ url: p.url, alt: p.alt })) : [],
    }

    return result
})

const scrapeData = async ({ page, collection, type, logEvent, searchUrl }) => {
    try {
        const BASE_URL = searchUrl;
        let currentPage = 1;
        let lastPage = 1;
        let error;
        let data = [];
        let count = 0;
        const prevEntries = await collection.find({ provider: "immowelt.de", searchUrl }, { projection: { url: 1 } }).toArray();

        while (lastPage && currentPage <= lastPage && !error) {
            console.log('Immowelt SCRAPING', currentPage, 'OF', lastPage, searchUrl);

            await page.goto(BASE_URL + `&page=${currentPage}`);
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
                        const newData = parsedData.filter(d => !prevEntries.find(p => p.url === d.url))

                        if (newData.length) {
                            await collection.insertMany(newData)
                        }

                        if (type === 'NEW_SCAN' && newData.length < (parsedData.length - 10)) {
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
                    console.log(err)
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
                .filter(e => !data.find(d => d.url === e.url))
                .map(e => e.url);

            await collection.deleteMany({ url: { $in: toRemove } });
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

const scrapeUrls = [
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=49999&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=69999&priceMin=5000&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=119999&priceMin=70000&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=189999&priceMin=120000&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=269999&priceMin=190000&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=389999&priceMin=270000&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMax=689999&priceMin=390000&useFor=Mixed,Living&order=DateDesc',
    'https://www.immowelt.de/classified-search?distributionTypes=Buy,Buy_Auction,Compulsory_Auction&estateTypes=Plot&locations=AD02DE1&priceMin=690000&useFor=Mixed,Living&order=DateDesc'
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
