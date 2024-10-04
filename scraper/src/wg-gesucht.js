import { middleware } from './utils/middleware.js'
import { parseFeatures } from './utils/parseFeatures.js';
import { delay, withRetries } from './utils/utils.js'

const checkCaptcha = async ({ page: defaultPage, url, restartBrowser }) => {
    let page = defaultPage
    let tries = 0;
    let hasCaptcha = await page.evaluate(async () => {
        return !(
            document.querySelector('a[href="#mapContainer"] .section_panel_detail') || // detail page
            document.querySelector("#assets_list_pagination") // list page
        )
    })

    while (tries < 5 && hasCaptcha) {
        tries++;
        console.log('captcha found... retrying...', tries)
        await delay(2000);
        page = await restartBrowser({ options: { useProxy: true, randomBrowser: true, preventScripts: true }}) // retry with proxy
        await withRetries(async () => {
            await page.goto(url);
        });
        hasCaptcha = await page.evaluate(async () => {
            return !document.querySelector('a[href="#mapContainer"] .section_panel_detail')
        })
    }

    return {
        page,
        hasCaptcha
    }
}

const scrapeData = async ({ page: defaultPage, collection, type, restartBrowser, logEvent }) => {
    try {
        let currentPage = 1;
        let lastPage = 1;
        let data = [];
        let count = 0;
        let error;
        let page = defaultPage
        const result = []
    
        const prevEntries = await collection.find({ provider: "wg-gesucht.de" }, { projection: { url: 1 } }).toArray();
    
        while (lastPage && currentPage <= lastPage && !error) {
            console.log('WG Gesucht SCRAPING', currentPage, 'OF', lastPage);
            const BASE_URL = `https://www.wg-gesucht.de/1-zimmer-wohnungen-und-wohnungen-in-Berlin.8.1+2.1.${currentPage - 1}.html?offer_filter=1&city_id=8&sort_column=0&sort_order=0&noDeact=1&categories[]=1&categories[]=2&rent_types[]=2&pagination=1&pu=`
    
            await withRetries(async () => {
                await page.goto(BASE_URL);
            }, () => { error = true });
            await delay(2000);
    
            const { page: newPage, hasCaptcha } = await checkCaptcha({ page, url: BASE_URL, restartBrowser })
            page = newPage;
    
            if (hasCaptcha) {
                error = true
                console.log('couldnt bypass captcha - exiting')
                break;
            }
    
            let pageTries = 0;
            let pageError = false;
            let newLastPage
            let links
            while (pageTries === 0 || (pageError && pageTries < 5)) {
                pageTries++;
                const [l, lp, pe] = await page.evaluate(() => {
                    const pages = document.querySelectorAll(".page-link")
                    let lastPage
    
                    if (pages && pages.length) {
                        lastPage = parseInt(pages[pages.length - 2].textContent)
                    }
    
                    const linkElements = document.querySelectorAll('h3.truncate_title a');
                    const urls = [];
                    if (linkElements && linkElements.length) {
                        linkElements.forEach(el => {
                            const url = el.getAttribute('href');
                            if (url && url.startsWith('/') && url.endsWith('.html')) {
                                urls.push(`https://www.wg-gesucht.de${url}`);
                            }
                        });
                        return [urls, lastPage];
                    } else {
                        return [null, null, true]
                    }
                });
                pageError = pe;
                links = l;
                if (lp) {
                    newLastPage = lp;
                }
    
                if (pe) {
                    console.log('page error - trying again...')
                    await page.goto(BASE_URL);
                    await delay(2000);
                }
            }
    
            // accept cookies
            if (currentPage === 1) {
                await page.click('#cmpbntyestxt');
            }
    
            data = [...data, ...links]
    
            currentPage++;
            lastPage = newLastPage;
    
            const newLinks = links.filter(link => !prevEntries.some(entry => entry.url === link));
            count += newLinks.length;
    
            for (const link of newLinks) {
                console.log('scraping', link)
    
                await withRetries(async () => {
                    await page.goto(link);
                }, () => { error = true });
    
                let isLoaded = false
                let tries = 0
                while (!isLoaded && tries < 5) {
                    tries++;
                    const hasError = await page.evaluate(async () => {
                        const headline = document.querySelector('h1')
                        return headline && headline.textContent === '504 Gateway Time-out'
                    })
                    isLoaded = !hasError
                    if (hasError) {
                        console.log('504 error - trying again...')
                        await withRetries(async () => {
                            await page.goto(link);
                        }, () => { error = true });
                    }
                }
    
                const { page: newPage, hasCaptcha: hasPageCaptcha } = await checkCaptcha({ page, url: link, restartBrowser })
                page = newPage;
    
                if (hasPageCaptcha) {
                    error = true;
                    console.log('couldnt bypass captcha - exiting')
                    break;
                }
    
                const subPageData = await page.evaluate(async () => {
                    const randomScroll = Math.floor(Math.random() * window.innerHeight);
                    window.scrollBy(0, randomScroll);
                    const pageData = {
                        provider: "wg-gesucht.de",
                    };
                    const titleElement = document.querySelector('h1.headline');
                    pageData.title = titleElement ? titleElement.textContent.trim() : '';
    
                    const dateAvailableElement = document.querySelector('#main_content .row:nth-child(6) .col-xs-12:nth-child(2) .row:nth-child(2) .col-xs-6:nth-child(2) .section_panel_value') 
                    pageData.date = dateAvailableElement ? dateAvailableElement.textContent.trim() : '';
    
                    const keyFactElemets = document.querySelectorAll('.key_fact_value');
                    pageData.livingSpace = keyFactElemets[0] ? parseInt(keyFactElemets[0].textContent.replace('m²', '').trim()) : '';
                    pageData.price = {
                        value: keyFactElemets[1] ? parseInt(keyFactElemets[1].textContent.replace('€', '').trim()) : '',
                        currency: '€',
                        additionalInfo: ""
                    }
                    pageData.rooms = keyFactElemets[2] ? parseInt(keyFactElemets[2].textContent.trim()) : null;
    
                    const addressElement = document.querySelector('a[href="#mapContainer"] .section_panel_detail')
                        .innerHTML.trim().split("<br>").map(el => el.replace(/\n/g, ' ').trim()) // [ "Mierendorffstrasse 31", "10589 Berlin" ]
                    const [zipCode, ...cityElems] = addressElement[1].split(" ") // [ "10589", "Berlin" ]
                    pageData.address = {
                        street: addressElement[0] || '',
                        zipCode,
                        city: cityElems.join(" ") || '',
                        district: '', // todo get district based on zipCode
                        geolocation: null,
                    }
    
                    const gallery = []
                    document.querySelectorAll('.sp-image').forEach(imgElement => {
                        const src = imgElement.getAttribute('src')
                        if (src.startsWith('https://') && !gallery.find(g => g.url === src)) {
                            gallery.push({ url: imgElement.getAttribute('src'), alt: imgElement.getAttribute('alt') })
                        };
                    });
    
                    pageData.gallery = gallery;
                    pageData.company = null;
    
                    const featureMap = {
                        "teilmöbliert": "PARTLY_FURNISHED",
                        "Eigenes Bad": "BATH_WITH_TUB",
                        "Balkon": "BALCONY",
                        "Barrierefrei": "WHEELCHAIR_ACCESSIBLE",
                        "möbliert": "FULLY_FURNISHED",
                        "Badewanne": "BATH_WITH_TUB",
                        "Aufzug": "PASSENGER_LIFT",
                        "WG geeignet": "FLAT_SHARE_POSSIBLE",
                        "sanierter Altbau": "FULLY_RENOVATED",
                        "EG": "GROUND_FLOOR",
                        "Eigene Küche": "FITTED_KITCHEN",
                        "Fahrradkeller": "BASEMENT",
                        "Altbau": "OLD_BUILDING",
                        "Keller": "FULLY_CELLARED",
                        "Neubau": "NEW_BUILDING",
                        "Gartenmitbenutzung": "GARDEN_SHARED",
                        "Terrasse": "TERRACE",
                        "Garten": "GARDEN",
                        "Haustiere erlaubt": "PETS_ALLOWED",
                        "Tiefgaragenstellplatz": "CAR_PARK",
                        "Gäste WC": "GUEST_TOILET",
                    };
    
                    const features = []
                    document.querySelectorAll('.utility_icons .text-center').forEach(el => {
                        const content = el.textContent
                            .replace(/\n/g, ' ') // remove new lines
                            .replace(/\s+/g, ' ').trim() // remove multiple spaces
                        content.split(',').forEach(e => {
                            const feat = e.trim()
                            if (featureMap[feat]) {
                                features.push(featureMap[feat])
                            }
                        })
                    })
    
                    pageData.features = features;
    
                    return pageData
                })
    
                if (subPageData) {
                    subPageData.id = link;
                    subPageData.url = link;
                    subPageData.created_at = new Date();
                    subPageData.features = parseFeatures(subPageData)
    
                    result.push(subPageData)
    
                    await collection.insertOne(subPageData)
                } else {
                    console.log(`Failed to extract data from ${link}`);
                    error = true;
                }
            }
    
            if (type === 'NEW_SCAN' && newLinks.length < (links.length - 2)) { // -2 tolerance
                console.log('Found old entries on page - quit scan');
                lastPage = currentPage - 1;
            }
        }
    
        if (type === 'FULL_SCAN' && !error) {
            const toRemove = prevEntries
                .filter(e => data.indexOf(e.url) === -1)
                .map(e => e.url);
    
            // Remove multiple entries by _id
            const result = await collection.deleteMany({ url: { $in: toRemove } });
            const message = `WG Gesucht - Scraped ${count} new estates and removed ${result.deletedCount} old estates.`;
            await logEvent({ scraper: 'wg-gesucht.de', success: true, message });
            console.log(message);
        } else if (!error) {
            const message = `WG Gesucht - Scraped ${count} new estates`
            await logEvent({ scraper: 'wg-gesucht.de', success: true, message });
            console.log(message);
        } else if (error) {
            await logEvent({ scraper: 'wg-gesucht.de', success: false, message: `Errors occured on scraping WG Gesucht, it still scraped ${count} new estates` });
        }
    } catch (err) {
        const message = 'WG Gesucht - Unexpected occured ' + err;
        await logEvent({ scraper: 'wg-gesucht.de', success: false, message });
        console.error(message)
    }
}

const crawler = (type) => {
    return () => new Promise(async (resolve, reject) => {
        try {
            await middleware(scrapeData, { type, randomBrowser: true })
            resolve()
        } catch (e) {
            console.log('error on immobilienscout crawler', e)
            reject(e)
        }
    })
}

export const wgGesuchtCrawler = crawler;
