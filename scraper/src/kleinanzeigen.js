import { middleware } from './utils/middleware.js'
import { parseCurrencyString } from './utils/utils.js'

const scrapeData = async ({ page, collection, type, logEvent, searchUrl }) => {
    try {
        let currentPage = 1;
        let lastPage = 1;
        let data = [];
        let count = 0;
        let error;
    
        const prevEntries = await collection.find({ provider: "kleinanzeigen.de", searchUrl }, { projection: { url: 1 } }).toArray();
    
        while (lastPage && currentPage <= lastPage && !error) {
            console.log('Kleinanzeigen SCRAPING', currentPage, 'OF', lastPage, searchUrl);
            const BASE_URL = searchUrl.replace('{page}', currentPage)
            currentPage++;
    
            await page.goto(BASE_URL);
    
            const [links, newLastPage] = await page.evaluate(() => {
                const pages = document.querySelectorAll(".pagination-page")
                lastPage = parseInt(pages[pages.length - 1].textContent)
    
                const linkElements = document.querySelectorAll('article.aditem');
                const urls = [];
                linkElements.forEach(el => {
                    const url = el.getAttribute('data-href');
                    if (url) {
                        urls.push(`https://www.kleinanzeigen.de${url}`);
                    }
                });
                return [urls, lastPage];
            });
    
            data = [...data, ...links]
    
            lastPage = newLastPage;
    
            const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link));
            count += newLinks.length;
    
            // Loop through each link, navigate to the page, and scrape data
            for (const link of newLinks) {
                await page.goto(link);
    
                // Extract and parse the script content
                const subPageData = await page.evaluate(async () => {
                    const pageData = {
                        provider: "kleinanzeigen.de",
                        created_at: new Date(),
                    };
    
                    const rawDetails = {};
                    document.querySelectorAll('#viewad-details .addetailslist--detail').forEach(detailElement => {
                        const key = detailElement.childNodes[0].nodeValue.trim();
                        const value = detailElement.querySelector('.addetailslist--detail--value').textContent.trim();
                        rawDetails[key] = value;
                    });
    
                    const priceElement = document.querySelector('#viewad-price');
                    pageData.price = {
                        value: priceElement ? priceElement.textContent.trim() : '',
                        currency: 'EUR',
                    };
    
                    pageData.size = parseInt(rawDetails['Grundstücksfläche'].replace(' m²', ''));
    
                    const rawLocality = document.querySelector('meta[property="og:locality"]')?.content || '';
                    const district = rawLocality.split(" - ")[1] || rawLocality.split(" - ")[0]
                    const streetElement = document.querySelector('#street-address');
                    const street = streetElement ? streetElement.textContent.trim().replace(/,$/, '') : null;
                    const localityElement = document.querySelector('#viewad-locality');
                    const localityText = localityElement ? localityElement.textContent.trim() : '';
                    const localityParts = localityText.split(' ');
                    const zipCode = localityParts[0];
    
                    pageData.address = {
                        zipCode,
                        district,
                        street,
                    }
    
                    const titleElement = document.querySelector('#viewad-title');
                    pageData.title = titleElement ? titleElement.textContent.replace("Reserviert • Gelöscht • \n", "").trim() : '';
    
                    pageData.gallery = [];
                    document.querySelectorAll('.galleryimage-element img').forEach(imgElement => {
                        pageData.gallery.push({ url: imgElement.getAttribute('src'), alt: imgElement.getAttribute('alt') });
                    });
    
                    return pageData;
                });
    
                if (subPageData) {
                    subPageData.url = link;
                    subPageData.searchUrl = searchUrl;
                    subPageData.price.value = subPageData.price.value ? parseCurrencyString(subPageData.price.value) : '';
    
                    console.log('Scraped data from sub-page', link);
    
                    await collection.insertOne(subPageData)
                } else {
                    const message = 'Failed to extract data from ' + link;
                    console.error(message)
                    error = true;
                }
            }
    
            if (type === 'NEW_SCAN' && newLinks.length < (links.length - 10)) { // -5 tolerance because of possible ads on top
                console.log('Found old entries on page - quit scan');
                lastPage = currentPage - 1;
            }
        }
    
        if (type === 'FULL_SCAN' && !error) {
            const toRemove = prevEntries
                .filter(e => data.indexOf(e.url) === -1)
                .map(e => e.url);
    
            await collection.deleteMany({ url: { $in: toRemove } });
            const message = `Kleinanzeigen - Scraped ${count} new estates and removed ${toRemove.length} old estates.`;
            await logEvent({ scraper: 'kleinanzeigen.de', success: true, message });
            console.log(message);
        } else if (!error) {
            const message = `Kleinanzeigen - Scraped ${count} new estates`;
            await logEvent({ scraper: 'kleinanzeigen.de', success: true, message });
            console.log(message);
        } else if (error) {
            await logEvent({ scraper: 'kleinanzeigen.de', success: false, message: `Errors occured on scraping Kleinanzeigen, it still scraped ${count} new estates` });
        }
    } catch (error) {
        const message = 'Kleinanzeigen - Unexpected occured ' + error;
        console.error(message);
        await logEvent({ scraper: 'kleinanzeigen.de', success: false, message });
    }
}

const scrapeUrls = [
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:0:45999/seite:{page}/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:46000:75999/seite:{page}/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:76000:99999/seite:{page}/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:100000:139999/seite:2/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:140000:189999/seite:2/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:190000:249999/seite:2/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:250000:339999/seite:2/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:340000:499999/seite:2/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:500000:999999/seite:2/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck',
    'https://www.kleinanzeigen.de/s-grundstuecke-garten/baugrundstueck/anzeige:angebote/preis:1000000:/c207+grundstuecke_garten.art_s:kaufen+grundstuecke_garten.type_s:baugrundstueck'
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

export const kleinanzeigenCrawler = crawler;
