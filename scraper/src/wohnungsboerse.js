import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async ({ page, collection, type }) => {
    const BASE_URL = 'https://www.wohnungsboerse.net/searches/index?isSearch=1&country=DE&page=1&estate_marketing_types=miete%2C1&marketing_type=miete&estate_types%5B%5D=1&cities%5B%5D=Berlin&zipcodes%5B%5D=&umkreiskm=&minprice=&maxprice=&minsize=&maxsize=&minrooms=&maxrooms=';
    await page.goto(BASE_URL);

    let currentPage = 1;
    let lastPage = 1;
    let data = [];
    let count = 0;
    let error;

    const [links, newLastPage] = await page.evaluate(() => {
        const pages = document.querySelectorAll(".paging a")
        lastPage = parseInt(pages[pages.length-2].textContent.trim())

        const linkElements = document.querySelectorAll('.search_result_container > a');
        const urls = [];
        linkElements.forEach(el => {
            const url = el.getAttribute('href');
            if (url) {
                urls.push(url);
            }
        });
        return [urls, lastPage];
    });

    data = [...data, ...links]

    lastPage = newLastPage;

    const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link));
    count += newLinks.length;

    for (const link of newLinks) {
        await page.goto(link);

        // Extract and parse the script content
        const subPageData = await page.evaluate(async () => {
            const pageData = {
                provider: "wohnungsboerse.net",
                created_at: new Date(),
            };

                // const parsedData = {
    //     id: "35442515", // Assuming this ID is the "Objekt-ID" mentioned in the HTML
    //     types: ["APARTMENT"], // Hardcoded as "APARTMENT" for this example
    //     date: new Date().toLocaleDateString("de-DE"), // Use current date for this example
    //     price: {
    //       value: parseFloat(
    //         document.querySelector("meta[itemprop='price']").content
    //       ),
    //       currency: document.querySelector("meta[itemprop='priceCurrency']").content,
    //       additionalInfo: "Warmmiete", // Hardcoded additional info
    //     },
    //     livingSpace: parseFloat(
    //       document.querySelector("meta[itemprop='floorSize'] meta[itemprop='value']")
    //         .content
    //     ),
    //     availabiltiy: document
    //       .querySelector("td:contains('Frei ab:') + td")
    //       .textContent.trim(),
    //     rooms: parseInt(
    //       document.querySelector(
    //         "meta[itemprop='numberOfRooms'] meta[itemprop='value']"
    //       ).content
    //     ),
    //     address: {
    //       zipCode: "10717", // Assuming this is static or retrieved elsewhere
    //       city: document.querySelector(
    //         "meta[itemprop='addressLocality']"
    //       ).content,
    //       district: "Wilmersdorf", // Hardcoded as found in the document
    //       street: "Trautenaustraße", // Extracted from HTML
    //       geolocation: {
    //         lat: parseFloat(
    //           document.querySelector("meta[itemprop='latitude']").content
    //         ),
    //         lon: parseFloat(
    //           document.querySelector("meta[itemprop='longitude']").content
    //         ),
    //       },
    //     },
    //     title: document.querySelector(
    //       "h2.font-bold"
    //     ).textContent.trim(), // Extract the title
    //     gallery: Array.from(
    //       document.querySelectorAll(
    //         ".gallery-slider .slick-slide img" // Adjust the selector as per your gallery image structure
    //       )
    //     ).map((img) => ({
    //       url: img.src,
    //       alt: img.alt || "Image",
    //     })),
    //     features: [
    //       "FULLY_FURNISHED",
    //       "BALCONY",
    //       "UNDERGROUND_PARKING",
    //       "BASEMENT",
    //       "RENOVATED",
    //       // Add or adjust these features based on the page content
    //     ],
    //   };

            return pageData;
        })

        if (subPageData) {
            subPageData.url = link;

            console.log('Scraped data from sub-page', link);

            await collection.insertOne(subPageData)
        } else {
            console.log(`Failed to extract data from ${link}`);
            error = true;
        }
    }
}

const crawler = async (type) => {
    try {
        await middleware(scrapeData, type);
    } catch (error) {
        console.error("Wohnungsboerse Error:", error);
    }
}

export const wohnungsboerseCrawler = crawler;


