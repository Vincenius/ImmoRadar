import { middleware } from './utils/middleware.js'
import { delay } from './utils/utils.js'
import { parseFeatures } from './utils/parseFeatures.js';

const parseData = (estates, searchUrl) => estates.map(e => {
    let gallery = e['resultlist.realEstate'].galleryAttachments?.attachment || []
    gallery = Array.isArray(gallery) ? gallery : [gallery]

    const featureMap = {
        'Balkon/Terrasse': 'BALCONY',
        'Einbauküche': 'FITTED_KITCHEN',
        'Garten': 'GARDEN',
        'Keller': 'BASEMENT',
        'Aufzug': 'PASSENGER_LIFT',
        'Stufenlos': 'WHEELCHAIR_ACCESSIBLE',
        'Gäste-WC': 'GUEST_TOILET',
        'WG-geeignet': 'FLAT_SHARE_POSSIBLE'
    };

    const mapFeatures = rawFeatures => rawFeatures.map(feature =>
        featureMap[feature] || `UNKNOWN_${feature}`
    )

    try {
        gallery
            .filter(a => a.urls && a.urls.length)
            .map(a => a.urls.map(u => u.url['@href'].replace("%WIDTH%", "420").replace("%HEIGHT%", "315")))
            .flat()
            .map(u => ({ url: u }))
    } catch(e) {
        console.log('FAILED TO PARSE GALLERY', gallery)
    }

    const features = mapFeatures((e.realEstateTags && e.realEstateTags.tag)
        ? (typeof e.realEstateTags.tag) === 'string'
            ? [e.realEstateTags.tag]
            : e.realEstateTags.tag
        : [])

    const result = {
        id: e['@id'],
        created_at: new Date(),
        url: `https://www.immobilienscout24.de/expose/${e['@id']}`,
        provider: "immobilienscout24.de",
        searchUrl,
        date: e['@publishDate'],
        price: {
            value: e['resultlist.realEstate'].price.value,
            currency: e['resultlist.realEstate'].price.currency,
            additionalInfo: "COLD_RENT"
        },
        livingSpace: e['resultlist.realEstate'].livingSpace,
        rooms: e['resultlist.realEstate'].numberOfRooms,
        // "availabiltiy": "Now",
        address: {
            zipCode: e['resultlist.realEstate'].address.postcode,
            city: e['resultlist.realEstate'].address.city,
            district: e['resultlist.realEstate'].address.quarter,
            street: `${e['resultlist.realEstate'].address.street || ''} ${e['resultlist.realEstate'].address.houseNumber || ''}`.trim(),
            geolocation: e['resultlist.realEstate'].address.wgs84Coordinate ? {
                lat: e['resultlist.realEstate'].address.wgs84Coordinate.latitude,
                lon: e['resultlist.realEstate'].address.wgs84Coordinate.longitude,
            } : null
        },
        title: e['resultlist.realEstate'].title,
        gallery: gallery
            .filter(a => a.urls && a.urls.length)
            .map(a => a.urls.map(u => u.url['@href'].replace("%WIDTH%", "420").replace("%HEIGHT%", "315")))
            .flat()
            .map(u => ({ url: u })),
        company: e['resultlist.realEstate'].privateOffer === 'true' ? 'Privat' : e['resultlist.realEstate'].contactDetails?.company || null,
        features,
    }

    return {
        ...result,
        features: parseFeatures(result)
    }
})

const scrapeData = async ({ page, collection, type, searchUrl, logEvent }) => {
    try {
        let currentPage = 1;
        let lastPage = 1;
        let error;
        let data = [];
        let count = 0;
        let retry = 0;
        const prevEntries = await collection.find({ provider: "immobilienscout24.de", searchUrl }, { projection: { id: 1 } }).toArray();
    
        while (lastPage && currentPage <= lastPage && !error && retry < 3) {
            const pageQuery = currentPage === 1 ? '' : `&pagenumber=${currentPage}`
            const BASE_URL = `${searchUrl}&sorting=2${pageQuery}`
    
            console.log('Immobilienscout24 SCRAPING', currentPage, 'OF', lastPage, searchUrl);
    
            await page.goto(BASE_URL);
            // await delay(3000);
            await page.waitForSelector('#resultlistpage')
    
            const content = await page.content();
            const scriptRegex = /IS24\.resultList\s*=\s*(\{[\s\S]*?\});/;
    
            const match = scriptRegex.exec(content);
            if (match && match[1]) {
                currentPage++;
                retry = 0;
                try {
                    const scriptContent = match[1];
                    const resultList = eval('(' + scriptContent + ')');
                    const result = resultList?.resultListModel?.searchResponseModel['resultlist.resultlist'];
                    lastPage = result.paging.numberOfPages;
    
                    const estates = result.resultlistEntries[0].resultlistEntry;
    
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
                } catch (error) {
                    const errorMsg = 'Error parsing IS24.resultList: ' + error
                    console.error(errorMsg);
                    await logEvent({ scraper: 'immobilienscout24.de', success: false, message: errorMsg });
                    error = true;
                }
            } else {
                console.log('No IS24.resultList found on page - retrying in 5 seconds...');
                await delay(5000); // wait and retry to bypass bot waiting screen
                retry++;
            }
        }

        if (retry === 3) {
            console.error('IS24.resultList object not found after three retries')
            await logEvent({ scraper: 'immobilienscout24.de', success: false, message: 'IS24.resultList object not found after three retries' });
            error = true;
        }

        if (type === 'FULL_SCAN' && !error) {
            const toRemove = prevEntries
                .filter(e => !data.find(d => d.id === e.id))
                .map(e => e.id);
    
            // Remove multiple entries by _id
            const result = await collection.deleteMany({ id: { $in: toRemove } });
            const message = `Immobilienscout24 scraped ${count} new estates and removed ${result.deletedCount} old estates.`
            console.log(message);
            await logEvent({ scraper: 'immobilienscout24.de', success: true, message });
        } else if (!error) {
            const message = `Immobilienscout24 scraped ${count} new estates`;
            console.log(message);
            await logEvent({ scraper: 'immobilienscout24.de', success: true, message });
        }
    } catch (error) {
        const errorMsg = 'Unexpected error scraping Immobilienscout24: ' + error
        console.error(errorMsg);
        await logEvent({ scraper: 'immobilienscout24.de', success: false, message: errorMsg });
    }
}

const scrapeUrls = [
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=-299.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=300.0-349.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=350.0-399.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=400.0-449.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=450.0-499.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=500.0-599.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=600.0-699.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=700.0-799.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=800.0-899.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=900.0-1099.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=1100.0-1299.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=1300.0-1699.99&pricetype=rentpermonth&enteredFrom=result_list',
    'https://www.immobilienscout24.de/Suche/de/wohnung-mieten?price=1700.0&pricetype=rentpermonth&enteredFrom=result_list',
]

const crawler = async (type) => {
    console.log('running immobilienscout scraper')
    await Promise.allSettled(
        scrapeUrls.map(searchUrl => middleware(scrapeData, { type, searchUrl, useFirefox: true }))
    )
    console.log('finished immobilienscout scraper')
}


export const immobilienscoutCrawler = crawler;

