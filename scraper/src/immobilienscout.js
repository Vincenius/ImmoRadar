import fs from 'fs';
import { middleware } from './utils/middleware.js'
import { delay } from './utils/utils.js'

const scrapeData = async (page) => {
    const BASE_URL = 'https://www.immobilienscout24.de/Suche/de/wohnung-mieten'
    await page.goto(BASE_URL);
    await delay(5000);

    const content = await page.content();
    const scriptRegex = /IS24\.resultList\s*=\s*(\{[\s\S]*?\});/;

    const match = scriptRegex.exec(content);
    if (match && match[1]) {
        try {
            const scriptContent = match[1];
            const resultList = eval('(' + scriptContent + ')');
            const result = resultList?.resultListModel?.searchResponseModel['resultlist.resultlist'];
            fs.writeFileSync('./immobilienscout.json', JSON.stringify(result))
        } catch (error) {
            console.error('Error parsing IS24.resultList:', error);
            return null;
        }
    } else {
        console.error('IS24.resultList object not found');
        return null;
    }
}

const crawler = async () => {
    await middleware(scrapeData);
}


export const immobilienscoutCrawler = crawler;

