import playwright from 'playwright'
import { MongoClient } from 'mongodb';
import { getRandomResolution, getRandomGeolocation, getRandomUseragent } from './utils.js'

export const middleware = async (callback, type) => {
    console.log('Booting Playwright...')
    let browser;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        const estateCollection = db.collection('locations');

        const USER_AGENT = getRandomUseragent();
        const viewportSize = getRandomResolution();
        const geolocation = getRandomGeolocation()

        browser = await playwright.chromium.launch({ headless: false });
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
                get: () => false
            });
        });
        const page = await context.newPage({ bypassCSP: true });
        await page.setDefaultTimeout(30000);
        await page.setViewportSize(viewportSize);

        console.log('Playwright ready...')

        await callback(page, estateCollection, type)
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
