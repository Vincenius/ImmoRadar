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
    const playwright = useFirefox ? firefox : chromium;

    const USER_AGENT = getRandomUseragent();
    const viewportSize = getRandomResolution();
    const geolocation = getRandomGeolocation(); // maybe based on ip??

    if (!useFirefox) {
        playwright.use(StealthPlugin())
    }
    // playwright.use(RecaptchaPlugin({
    //     provider: {
    //       id: '2captcha',
    //       token: process.env.CAPTCHA_KEY
    //     },
    //     visualFeedback: true
    // }))

    const proxy = options.useProxy ? {
        server: proxies[1].server,
        username: proxies[1].username,
        password: proxies[1].password,
    } : undefined

    const browser = await playwright.launch({ headless: false, proxy });
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
    await page.setDefaultTimeout(60000);
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

export const middleware = async (callback, type, options = {}) => {
    console.log('Booting Playwright...')
    let browser;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        const estateCollection = db.collection('estates');

        const { browser: newBrowser, page } = await startBrowser({ options });    
        browser = newBrowser    

        console.log('Playwright ready...')

        // todo return function that handles creating a new browser with proxy
        const restartBrowser = async ({ options: newOptions }) => {
            console.log('Restarting browser...')
            browser.close();
            const { browser: newBrowser, page: newPage } = await startBrowser({ options: newOptions || options });    
            browser = newBrowser

            return newPage
        }

        await callback({
            page,
            collection: estateCollection,
            type,
            restartBrowser,
        })
    } catch (error) {
        console.error("Playwright Error:", error);
    } finally {
        if (browser) {
            console.log('Closing Playwright...')
            // await browser.close();
        }
        client.close();
    }
}
