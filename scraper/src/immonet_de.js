// For more information, see https://crawlee.dev/
import { CheerioCrawler, ProxyConfiguration } from 'crawlee';
import fs from 'fs';

const crawler = new CheerioCrawler({
    // proxyConfiguration: new ProxyConfiguration({ proxyUrls: ['...'] }),
    // Comment this option to scrape the full website.
    maxRequestsPerCrawl: 20,
    async requestHandler({ request, response, body, contentType, $ }) {
        const rawData = $('#__NEXT_DATA__').text()

        try {
            const data = JSON.parse(rawData)
            const { page, classifiedsData } = data?.props?.pageProps?.pageProps || {}

            fs.writeFileSync('./immonet_de.json', JSON.stringify(classifiedsData))
        } catch (e) {
            console.error(e)
        }
        // Do some data extraction from the page with Cheerio.
        // $('[data-testid="serp-card-testid"]').each((index, el) => {
        //     data.push({ title: $(el).find('a').title() });
        // });

        // // Save the data to dataset.
        // await Dataset.pushData({
        //     url: request.url,
        //     html: body,
        //     data,
        // })
    },
});


export const immonetCrawler = () => crawler.run([
    'https://www.immonet.de/wohnung-mieten.html',
]);

