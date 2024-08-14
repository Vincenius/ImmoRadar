import fs from 'fs';
import { middleware } from './utils/middleware.js'
import { delay } from './utils/utils.js'

const parseData = (estates) => estates.map(e => {
    let gallery = e['resultlist.realEstate'].galleryAttachments?.attachment || []
    gallery = Array.isArray(gallery) ? gallery : [gallery]

    const featureMap = {
        'Balkon/Terrasse': 'BALCONY',
        'Einbauküche': 'FITTED_KITCHEN',
        'Garten': 'GARDEN',
        'Keller': 'BASEMENT',
        'Aufzug': 'PASSENGER_LIFT',
        'Stufenlos': 'BARRIER_FREE',
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

    return {
        id: e['@id'],
        created_at: new Date(),
        url: `https://www.immobilienscout24.de/expose/${e['@id']}`,
        provider: "immobilienscout24.de",
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
        features: mapFeatures((e.realEstateTags && e.realEstateTags.tag)
            ? (typeof e.realEstateTags.tag) === 'string'
                ? [e.realEstateTags.tag]
                : e.realEstateTags.tag
            : []),
    }
})

const scrapeData = async ({ page, collection, type }) => {
    let currentPage = 1;
    let lastPage = 1;
    let error;
    let data = [];
    let count = 0;
    let retry = 0;
    const prevEntries = await collection.find({ provider: "immobilienscout24.de" }, { projection: { id: 1 } }).toArray();

    while (lastPage && currentPage <= lastPage && !error && retry < 3) {
        const pageQuery = currentPage === 1 ? '' : `&pagenumber=${currentPage}`
        const BASE_URL = `https://www.immobilienscout24.de/Suche/de/berlin/berlin/wohnung-mieten?sorting=2${pageQuery}`

        console.log('Immobilienscout24 SCRAPING', currentPage, 'OF', lastPage);

        await page.goto(BASE_URL);
        await delay(3000);

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

                // fs.writeFileSync('./immoscout-tmp.json', JSON.stringify(estates))

                const parsedData = parseData(estates)
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
                console.error('Error parsing IS24.resultList:', error);
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
        error = true;
    }

    console.log('Immobilienscout24 scraped', count, ' new estates');

    if (type === 'FULL_SCAN' && !error) {
        const toRemove = prevEntries
            .filter(e => !data.find(d => d.id === e.id))
            .map(e => e.id);

        // Remove multiple entries by _id
        const result = await collection.deleteMany({ id: { $in: toRemove } });
        console.log(`Immobilienscout24 ${result.deletedCount} old estates were deleted.`);
    }
}

const crawler = async (type) => {
    await middleware(scrapeData, type, { randomBrowser: true });
}


export const immobilienscoutCrawler = crawler;

