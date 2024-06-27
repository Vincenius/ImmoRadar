import fs from 'fs';
import { middleware } from './utils/middleware.js'

const mapPriceType = {
    "COLD_RENT": "COLD_RENT",
    "RENT_INCLUDING_HEATING": "WARM_RENT",
    "PURCHASE_PRICE": "PURCHASE_PRICE",
}

const parseData = (estates) => estates.map(e => ({
    id: e.id,
    url: `https://www.immowelt.de/expose/${e.onlineId}`,
    provider: "immonet.de",
    date: e.timestamp,
    price: {
        value: e.primaryPrice?.amountMax,
        currency: e.primaryPrice?.currency,
        additionalInfo: mapPriceType[e.primaryPrice?.type] || e.primaryPrice?.type,
    },
    livingSpace: e.primaryArea.sizeMin,
    rooms: e.roomsMin,
    // "availabiltiy": "Now",
    address: {
        zipCode: e.place.postcode,
        city: e.place.city,
        district: e.place.district,
        street: e.place.street,
        geolocation: {
            lat: e.place.point.lat,
            lon: e.place.point.lon,
        }
    },
    title: e.title,
    // "description": "",
    gallery: e.pictures.map(p => ({ url: p.imageUri, alt: p.description })),
    features: e.features,
    company: e.broker.companyName,
}) )

const scrapeData = async (page) => {
    const BASE_URL = 'https://www.immowelt.de/suche/berlin/wohnungen/mieten?d=true&sd=DESC&sf=TIMESTAMP';
    let currentPage = 1;
    let lastPage = 1;
    let error;
    let data = [];

    while (lastPage && currentPage <= lastPage && !error) {
        console.log('Immowelt SCRAPING', currentPage, 'OF', lastPage);

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

                    const parsedData = parseData(estates)

                    // todo check & push to database
                    data = [...data, ...parsedData]
                } else {
                    console.log(content, 'Housing data not found');
                    error = true;
                }
            } catch (err) {
                console.error(err, 'Failed to parse JSON data');
                error = true;
            }
        } else {
            console.log(content, 'Script tag with JSON data not found');
            error = true;
        }
    }

    console.log('Scraped', data.length, 'elements')
}

const crawler = async () => {
    try {
        await middleware(scrapeData);
    } catch (error) {
        console.error("Immowelt Error:", error);
    }
}

export const immoweltCrawler = crawler;
