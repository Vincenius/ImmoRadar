import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async ({ page, collection, type }) => {
    const BASE_URL = 'https://www.wohnungsboerse.net/searches/index?isSearch=1&country=DE&page=1&estate_marketing_types=miete%2C1&marketing_type=miete&estate_types%5B%5D=1&cities%5B%5D=Berlin&zipcodes%5B%5D=&umkreiskm=&minprice=&maxprice=&minsize=&maxsize=&minrooms=&maxrooms=';
    await page.goto(BASE_URL);

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

    console.log(links, newLastPage)

    // const parsedData = {
    //     id: "35442515", // Assuming this ID is the "Objekt-ID" mentioned in the HTML
    //     url: window.location.href, // The current page URL
    //     provider: "wohnungsboerse.net", // Assuming the provider is the current domain
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

    // const scriptContent = await page.evaluate(() => {
    //     // Find all script tags
    //     const scripts = document.querySelectorAll('script');

    //     // Iterate over scripts to find the one containing `window["__UFRN_FETCHER__"]`
    //     for (let script of scripts) {
    //         if (script.innerHTML.includes('window["__UFRN_FETCHER__"]')) {
    //             return script.innerHTML;
    //         }
    //     }

    //     // Return null if no matching script is found
    //     return null;
    // });

}

const crawler = async (type) => {
    try {
        await middleware(scrapeData, type);
    } catch (error) {
        console.error("Wohnungsboerse Error:", error);
    }
}

export const wohnungsboerseCrawler = crawler;


