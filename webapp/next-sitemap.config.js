const { MongoClient } = require('mongodb');

const exclude = ['/deleted', '/profile', '/email-bestaetigt', '/unerwarteter-fehler']

const regionData = {
    'baden-württemberg': 'Baden-Württemberg',
    'bayern': 'Bayern',
    'brandenburg': 'Brandenburg',
    'bremen': 'Bremen',
    'berlin': 'Berlin',
    'hamburg': 'Hamburg',
    'hessen': 'Hessen',
    'mecklenburg-vorpommern': 'Mecklenburg-Vorpommern',
    'niedersachsen': 'Niedersachsen',
    'nordrhein-westfalen': 'Nordrhein-Westfalen',
    'rheinland-pfalz': 'Rheinland-Pfalz',
    'saarland': 'Saarland',
    'sachsen': 'Sachsen',
    'sachsen-anhalt': 'Sachsen-Anhalt',
    'schleswig-holstein': 'Schleswig-Holstein',
    'thüringen': 'Thüringen',
}

const immoGuesserCities = [
    'Deutschlandweit',
    'Berlin',
    'Hamburg',
    'München',
    'Köln',
    'Frankfurt am Main',
    'Stuttgart',
    'Düsseldorf',
    'Leipzig',
    'Dortmund',
    'Essen',
    'Dresden',
    'Hannover',
    'Bremen',
]

module.exports = {
    siteUrl: 'https://immoradar.xyz',
    generateRobotsTxt: true,
    exclude: exclude,
    sitemapSize: 20000,
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                disallow: exclude,
            },
        ],
    },
    // generateIndexSitemap: false,
    additionalPaths: async (config) => {
        const client = new MongoClient(process.env.MONGODB_URI);

        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection('locations');
        const estateCollection = db.collection('estates');

        const result = await collection.aggregate([
            {
                $project: {
                    name: 1,
                    zipCodes: 1,
                    zipCodeCount: { $size: "$zipCodes" }
                }
            },
            {
                $sort: { zipCodeCount: -1 }
            },
            {
                $project: {
                    name: 1,
                    zipCodes: 1,
                    _id: 0
                }
            }
        ]).toArray()

        const zipCodeEstateCount = await estateCollection.aggregate([
            {
                $group: {
                    _id: "$address.zipCode",
                    count: { $sum: 1 }
                }
            }
        ]).toArray()

        const existingZipCodes = zipCodeEstateCount.filter(item => item.count > 1).map(item => item._id)
        const filteredResult = result.filter(loc => loc.zipCodes.some(zip => existingZipCodes.includes(zip)))

        const regionSitemap = await Promise.all(Object.keys(regionData).map(async item => {
            const res = await config.transform(config, encodeURI(`/uebersicht/${item}`))
            return res
        }))
        const searchSitemap = await Promise.all(filteredResult.map(async item => {
            const res = await config.transform(config, encodeURI(`/search?q=${item.name}`))
            return res
        }))
        const immoGuesserSitemap = await Promise.all(immoGuesserCities.map(async item => {
            const res = await config.transform(config, encodeURI(`/immo-guesser/blog/${item}`))
            return res
        }))

        await client.close()

        return [
            ...regionSitemap,
            ...searchSitemap,
            ...immoGuesserSitemap,
        ]
    }
}