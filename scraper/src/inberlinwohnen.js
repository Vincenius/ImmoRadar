import { middleware } from './utils/middleware.js'
import { getZipByAddress } from './utils/utils.js'

const scrapeData = async ({ page, collection }) => {
    let data = [];

    const providers = ["howoge.de", "gewobag.de", "stadtundland.de", "degewo.de", "wbm.de", "gesobau.de"];
    const prevEntries = await collection.find(
        { provider: { $in: providers } },
        { projection: { id: 1 } }
    ).toArray();

    console.log('inberlinwohnen SCRAPING');
    const BASE_URL = 'https://inberlinwohnen.de/wohnungsfinder/'

    await page.goto(BASE_URL);

    const pageData = await page.evaluate(async () => {
        const pageData = [];
        const providerMap = {
            'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/howoge-small-grey.jpg': 'howoge.de',
            'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/gewobag-small-grey.jpg': 'gewobag.de',
            'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/stadtundland-small-grey.jpg': 'stadtundland.de',
            'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/degewo-small-grey.jpg': 'degewo.de',
            'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/wbm-small-grey.jpg': 'wbm.de',
            'https://inberlinwohnen.de/wp-content/themes/ibw/images/logos/gesobau-small-grey.jpg': 'gesobau.de',
        }

        document.querySelectorAll('.tb-merkflat').forEach(el => {
            const logo = el.querySelector('.alg_c img')
            const id = el.getAttribute('id')
            const date = el.querySelector('.my_tp_dt').textContent.trim()

            const livingSpaceRow = Array.from(el.querySelectorAll('.tb-small-data tr')).find(row => {
                return row.textContent.includes('Wohnfläche');
            });
            
            const livingSpace = livingSpaceRow ? parseFloat(
                livingSpaceRow.querySelector('.alg_r').textContent.replace(' m²', '').replace(',', '.').trim()
            ) : null;

            const rawFeatures = Array.from(el.querySelectorAll('.tb-flatdet-smaller .hackerl')).map(feat => feat.textContent.trim())
            const featureMap = {
                'Balkon/Loggia/Terrasse': 'BALCONY',
                'Aufzug': 'PASSENGER_LIFT',
                'Keller': 'BASEMENT',
                'Badewanne': 'BATH_WITH_TUB',
                'Barrierefrei': 'WHEELCHAIR_ACCESSIBLE',
                'Seniorenwohnung': 'SENIOR_FRIENDLY',
                'Gäste-WC': 'GUEST_TOILET'
            }

            pageData.push({
                id,
                created_at: new Date(),
                provider: providerMap[logo.src],
                title: el.querySelector('h2').textContent,
                url: 'https://inberlinwohnen.de' + el.querySelector('.org-but').getAttribute('href'),
                // availabiltiy: date === 'ab sofort' ? new Date() : new Date(date),
                price: {
                    value: parseFloat(
                        el.querySelector('._tb_left strong:nth-child(3)').textContent.replace(',', '.')
                    ),
                    currency: 'EUR',
                    additionalInfo: 'Kaltmiete'
                },
                livingSpace,
                rooms: parseInt(el.querySelector('._tb_left strong:nth-child(1)').textContent),
                address: {
                    city: "Berlin",
                    district: (el.querySelector('.map-but').textContent.trim().split(',')[1] || '').trim(),
                    street: el.querySelector('.map-but').textContent.trim().split(',')[0].trim(),
                },
                gallery: [{
                    url: el.querySelector('.flat-image').getAttribute('style')
                        .replace('background-image:url(', '').replace(');', ''),
                    alt: el.querySelector('h2').textContent
                }],
                features: rawFeatures.map(feat => featureMap[feat]).filter(Boolean),
            })
        })

        return pageData;
    });

    const filteredData = pageData.filter(d => !prevEntries.find(e => e.id === d.id));

    for (let i = 0; i < filteredData.length; i++) {
        const newElem = {
            ...filteredData[i],
            address: {
                ...filteredData[i].address,
                zipCode: await getZipByAddress(filteredData[i].address)
            }
        }

        data.push(newElem)
    }

    if (data && data.length > 0) {
        await collection.insertMany(data);
    }

    console.log('inberlinwohnen scraped', data.length, 'new estates');

    const toRemove = prevEntries
        .filter(e => data.indexOf(e.id) === -1)
        .map(e => e.id);

    // Remove multiple entries by _id
    const result = await collection.deleteMany({ url: { $in: toRemove } });
    console.log(`inberlinwohnen ${result.deletedCount} old estates were deleted.`);
}

const crawler = async (type) => {
    await middleware(scrapeData, type);
}

export const inberlinwohnenCrawler = crawler;
