import { chromium } from 'playwright-extra'
import StealthPlugin from "puppeteer-extra-plugin-stealth"
// import RecaptchaPlugin from 'puppeteer-extra-plugin-recaptcha'
import { MongoClient } from 'mongodb';
import { getRandomResolution, getRandomGeolocation, getRandomUseragent } from './utils.js'

export const middleware = async (callback, type) => {
    console.log('Booting Playwright...')
    let browser;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        const estateCollection = db.collection('estates');

        const USER_AGENT = getRandomUseragent();
        const viewportSize = getRandomResolution();
        const geolocation = getRandomGeolocation();

        chromium.use(StealthPlugin())
        // chromium.use(RecaptchaPlugin({
        //     provider: {
        //       id: '2captcha',
        //       token: process.env.CAPTCHA_KEY
        //     },
        //     visualFeedback: true
        // }))

        browser = await chromium.launch({ headless: true });
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
            if (['image', 'stylesheet', 'font'].includes(resourceType)) {
                route.abort();
            } else {
                route.continue();
            }
        });

        console.log('Playwright ready...')

        await callback({
            page,
            collection: estateCollection,
            type,
        })
    } catch (error) {
        console.error("Playwright Error:", error);
    } finally {
        if (browser) {
            console.log('Closing Playwright...')
            await browser.close();
        }
        client.close();
    }
}
