import fs from 'fs';
import { middleware } from './utils/middleware.js'

const scrapeData = async (page) => {
    const BASE_URL = 'https://www.kleinanzeigen.de/s-wohnung-mieten/anzeige:angebote/c203+wohnung_mieten.swap_s:nein'
    await page.goto(BASE_URL);

    // const content = await page.content();
    const links = await page.evaluate(() => {
        const linkElements = document.querySelectorAll('article.aditem');
        const urls = [];
        linkElements.forEach(el => {
            const url = el.getAttribute('data-href');
            if (url) {
                urls.push(`https://www.kleinanzeigen.de${url}`);
            }
        });
        return urls;
    });

    const data = [];

    // Loop through each link, navigate to the page, and scrape data
    for (const link of links) {
        await page.goto(link);
        // const content = await page.content();

        // Extract and parse the script content
        const subPageData = await page.evaluate(() => {
            const pageData = {};

            // Extract title
            const titleElement = document.querySelector('#viewad-title');
            pageData.title = titleElement ? titleElement.textContent.trim() : '';

            // Extract price
            const priceElement = document.querySelector('#viewad-price');
            pageData.price = priceElement ? priceElement.textContent.trim() : '';

            // Extract location
            const locationElement = document.querySelector('#viewad-locality');
            pageData.location = locationElement ? locationElement.textContent.trim() : '';

            // Extract publication date
            const dateElement = document.querySelector('#viewad-extra-info .icon-calendar-gray-simple + span');
            pageData.publicationDate = dateElement ? dateElement.textContent.trim() : '';

            // Extract number of views
            const viewsElement = document.querySelector('#viewad-cntr-num');
            pageData.views = viewsElement ? viewsElement.textContent.trim() : '';

            // Extract property details
            pageData.details = {};
            document.querySelectorAll('#viewad-details .addetailslist--detail').forEach(detailElement => {
                const key = detailElement.childNodes[0].nodeValue.trim();
                const value = detailElement.querySelector('.addetailslist--detail--value').textContent.trim();
                pageData.details[key] = value;
            });

            // Extract property features
            pageData.features = [];
            document.querySelectorAll('#viewad-configuration .checktag').forEach(featureElement => {
                pageData.features.push(featureElement.textContent.trim());
            });

            // Extract images
            pageData.images = [];
            document.querySelectorAll('.galleryimage-element img').forEach(imgElement => {
                pageData.images.push(imgElement.getAttribute('src'));
            });

            return pageData;
        });

        if (subPageData) {
            console.log('Scraped data from sub-page:', subPageData);
            // Store the data
            data.push(subPageData);
        } else {
            console.log(`Failed to extract data from ${link}`);
        }
    }

    fs.writeFileSync('./kleinanzeigen.json', JSON.stringify(data))
}

const crawler = async () => {
    await middleware(scrapeData);
}

export const kleinanzeigenCrawler = crawler;
