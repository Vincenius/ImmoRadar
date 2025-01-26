const { MongoClient } = require('mongodb');

const exclude = [
    '/deleted', '/profile', '/email-bestaetigt', '/unerwarteter-fehler', '/blog/immo-guesser',
    '/foerderung', 'foerderung/ergebnis', '/grundstueckboerse', '/index-tmp'  // temp
]

module.exports = {
    siteUrl: process.env.BASE_URL,
    generateRobotsTxt: true,
    exclude: exclude,
    sitemapSize: 20000,
    robotsTxtOptions: {
        policies: process.env.NEXT_PUBLIC_NOINDEX
            ? [{ userAgent: '*', disallow: '/' }]
            : [
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
        const estateCollection = db.collection('properties');

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

        // TODO update to suche
        const searchSitemap = await Promise.all(filteredResult.map(async item => {
            const res = await config.transform(config, encodeURI(`/suche?q=${item.name}`))
            return res
        }))

        await client.close()

        return [
            ...searchSitemap,
        ]
    }
}