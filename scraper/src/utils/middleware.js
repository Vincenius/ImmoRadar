import { firefox, chromium } from 'playwright-extra'
import StealthPlugin from "puppeteer-extra-plugin-stealth"
// import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import { MongoClient } from 'mongodb';
import { getRandomResolution, getRandomGeolocation, getRandomUseragent } from './utils.js'

const proxies = [{
    server: '87.106.235.175:3128',
    username: process.env.PROXY_USERNAME_1,
    password: process.env.PROXY_PASSWORD_1
}, {
    server: 'geo.iproyal.com:12321',
    username: process.env.PROXY_USERNAME_2,
    password: process.env.PROXY_PASSWORD_2
}]

const startBrowser = async ({ options = {} }) => {
    const useFirefox = options.useFirefox || (options.randomBrowser && Math.random() < 0.5)
    console.log('Booting Playwright', useFirefox ? 'Firefox' : 'Chromium', '...')
    const playwright = useFirefox ? firefox : chromium;

    const USER_AGENT = getRandomUseragent();
    const viewportSize = getRandomResolution();
    const geolocation = getRandomGeolocation();

    if (!useFirefox) {
        playwright.use(StealthPlugin())
    }

    const proxy = options.useProxy ? {
        server: proxies[1].server,
        username: proxies[1].username,
        password: proxies[1].password,
    } : undefined

    const browser = await playwright.launch({ headless: true, proxy });
    const context = await browser.newContext({
        userAgent: USER_AGENT,
        locale: 'de-DE',
        viewport: viewportSize,
        permissions: [], // Add any required permissions here
        geolocation,
        timezoneId: 'Europe/Berlin',
    });
    await context.addInitScript(() => {
        Object.defineProperty(navigator, 'languages', {
            get: () => ['de-DE', 'de', 'en-US', 'en']
        });
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
        Object.defineProperty(navigator, 'platform', {
            get: () => 'Win32'
        });
    });
    const page = await context.newPage({ bypassCSP: true });
    await page.setDefaultTimeout(30000);
    await page.setViewportSize(viewportSize);

    // don't load images and stuff
    await page.route('**/*', (route) => {
        const resourceType = route.request().resourceType();
        if (options.preventScripts && resourceType === 'script') { // save some more data volume
            route.abort();
        } else if (['image', 'stylesheet', 'font'].includes(resourceType)) {
            route.abort();
        } else {
            route.continue();
        }
    });

    return { browser, page }
}

export const middleware = async (callback, options = {}) => {
    const { type, searchUrl } = options
    let browser;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        const estateCollection = db.collection('estates');
        const logCollection = db.collection('logs');

        const { browser: newBrowser, page } = await startBrowser({ options });
        browser = newBrowser

        const restartBrowser = async ({ options: newOptions }) => {
            console.log('Restarting browser...')
            browser.close();
            const { browser: newBrowser, page: newPage } = await startBrowser({ options: newOptions || options });
            browser = newBrowser

            return newPage
        }

        const logEvent = async ({ scraper, success, message }) => {
            if (!process.env.DISABLE_LOGS) {
                await logCollection.insertOne({
                    created_at: new Date(),
                    scraper,
                    type,
                    searchUrl,
                    success,
                    message,
                })
            } else {
                console.log({ scraper, success, message, searchUrl })
            }
        }

        await callback({
            page,
            collection: estateCollection,
            type,
            searchUrl,
            logEvent,
            restartBrowser,
        })
    } catch (error) {
        console.error("Playwright Error:", error);
    } finally {
        if (browser) {
            await browser.close();
        }
        client.close();
    }
}
