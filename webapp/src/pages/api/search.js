import { MongoClient } from 'mongodb';

const filterDuplicateAggregation = [{
    $group: {
        _id: {
            title: "$title",
            price: "$price"
        },
        docs: { $push: "$$ROOT" }
    }},
    {
        $unwind: "$docs"
    },
    {
    $group: {
        _id: {
            title: "$_id.title",
            price: "$_id.price",
            provider: "$docs.provider"
        },
        doc: { $first: "$docs" }
    }
    },
    {
        $group: {
        _id: {
            title: "$_id.title",
            price: "$_id.price"
        },
        doc: { $first: "$doc" }
        }
    },
    {
        $replaceRoot: { newRoot: "$doc" }
    },
]

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
            const {
                q, input, sort, minPrice, maxPrice, minSize, maxSize,
                minRooms, maxRooms, titleIncludes, titleExcludes, features = '', providers = '',
                page = 1, limit = 20
            } = req.query;
            const featuresArray = features && features.length && features.split(',');
            const providersArray = providers && providers.length && providers.split(',');

            if (!q) {
                res.status(200).json([])
            } else {
                const db = client.db(process.env.MONGODB_DB);
                const collection = db.collection('estates');
                const locationCollection = db.collection('locations');

                // SORT
                const mongoSortMap = {
                    created_at: { created_at: -1 },
                    priceAsc: { 'price.value': 1 },
                    priceDesc: { 'price.value': -1 },
                    sizeAsc: { 'livingSpace': 1 },
                    sizeDesc: { 'livingSpace': -1 }
                }
                const mongoSort = mongoSortMap[sort] || { created_at: -1 };

                // FILTER
                const priceFilter = {};
                if (minPrice && !isNaN(parseInt(minPrice))) {
                    priceFilter['price.value'] = { $gte: parseInt(minPrice) };
                }
                if (maxPrice && !isNaN(parseInt(maxPrice))) {
                    priceFilter['price.value'] = { ...priceFilter['price.value'], $lte: parseInt(maxPrice) };
                }

                const sizeFilter = {};
                if (minSize && !isNaN(parseInt(minSize))) {
                    sizeFilter['livingSpace'] = { $gte: parseInt(minSize) };
                }
                if (maxSize && !isNaN(parseInt(maxSize))) {
                    sizeFilter['livingSpace'] = { ...sizeFilter['livingSpace'], $lte: parseInt(maxSize) };
                }

                const roomsFilter = {};
                if (minRooms && !isNaN(parseInt(minRooms))) {
                    roomsFilter['rooms'] = { $gte: parseInt(minRooms) };
                }
                if (maxRooms && !isNaN(parseInt(maxRooms))) {
                    roomsFilter['rooms'] = { ...roomsFilter['rooms'], $lte: parseInt(maxRooms) };
                }

                // FEATURES FILTER
                const featuresFilter = {};
                if (featuresArray && Array.isArray(featuresArray)) {
                    featuresFilter['features'] = { $all: featuresArray };
                }

                // TITLE FILTER
                const titleFilter = {};
                if (titleIncludes) {
                    const includesArray = titleIncludes.split(',').map(str => str.trim());
                    titleFilter['$and'] = includesArray.map(includeStr => ({
                        title: { $regex: includeStr, $options: 'i' }
                    }));
                }
                
                if (titleExcludes) {
                    const excludesArray = titleExcludes.split(',').map(str => str.trim());
                    titleFilter['$nor'] = excludesArray.map(excludeStr => ({
                        title: { $regex: excludeStr, $options: 'i' }
                    }));
                }

                // PROVIDER FILTER
                const providerFilter = {};
                if (providersArray && Array.isArray(providersArray)) {
                    providerFilter['provider'] = { $nin: providersArray };
                }

                const filter = [priceFilter, sizeFilter, roomsFilter, featuresFilter, titleFilter, providerFilter]
                    .filter(obj => Object.keys(obj).length > 0);

                // RUN QUERY
                let results = [];
                let pages = 0;
                let query = {}

                if (input === 'manual') {
                    // if zip code format
                    if (/^\d{5}$/.test(q)) {
                        query = {
                            $and: [
                                { 'address.zipCode': { $in: [q] } },
                                ...filter
                            ]
                        }
                    } else {
                        query = {
                            $and: [
                                { $or: [
                                    { 'address.city': { $regex: q, $options: 'i' } },
                                    { 'address.district': { $regex: q, $options: 'i' } }
                                ] },
                                ...filter,
                            ]
                        }
                    }
                } else {
                    const location = await locationCollection.findOne({ name: q });

                    if (location) {
                        query = {
                            $and: [
                                { 'address.zipCode': { $in: location.zipCodes } },
                                ...filter
                            ]
                        }
                    }
                }

                const [result] = await collection.aggregate([
                    { $match: query },
                    ...filterDuplicateAggregation,
                    {
                        $facet: {
                            results: [
                                { $sort: mongoSort },
                                { $skip: (page - 1) * limit },
                                { $limit: limit }
                            ],
                            totalCount: [
                                { $count: "count" }
                            ]
                        }
                    },
                    {
                        $project: {
                            results: 1,
                            totalCount: { $arrayElemAt: ["$totalCount.count", 0] }
                        }
                    }
                ]).toArray()

                const estates = result.results
                pages = Math.ceil(result.totalCount / limit);

                res.status(200).json({ estates, pages });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            // Close the connection
            client.close();
        }
    } else {
        res.status(400).json([])
    }
}