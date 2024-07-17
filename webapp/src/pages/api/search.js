import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
            const { q, input, sort, minPrice, maxPrice, minSize, maxSize, minRooms, maxRooms, features = '' } = req.query;
            const featuresArray = features.split(',');

            if (!q) {
                res.status(200).json([])
            } else {
                const db = client.db(process.env.MONGODB_DB);
                const collection = db.collection('estates');
                const locationCollection = db.collection('locations');

                // SORT
                const mongoSortMap = {
                    date: { date: -1 },
                    priceAsc: { 'price.value': 1 },
                    priceDesc: { 'price.value': -1 },
                    sizeAsc: { 'livingSpace': 1 },
                    sizeDesc: { 'livingSpace': -1 }
                }
                const mongoSort = mongoSortMap[sort] || { date: -1 };

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

                const filter = { ...priceFilter, ...sizeFilter, ...roomsFilter, ...featuresFilter };

                // RUN QUERY
                let results = [];

                if (input === 'manual') {
                    results = await collection.find({
                        $and: [
                            { $or: [
                                { 'address.city': { $regex: q, $options: 'i' } },
                                { 'address.district': { $regex: q, $options: 'i' } }
                            ] },
                            filter
                        ]
                    })
                    .sort(mongoSort)
                    .limit(20).toArray();
                } else {
                    const location = await locationCollection.findOne({ name: q });

                    if (location) {
                        results = await collection
                            .find({
                                $and: [
                                    { 'address.zipCode': { $in: location.zipCodes } },
                                    filter
                                ]
                            })
                            .sort(mongoSort)
                            .limit(20).toArray();
                    }
                }

                res.status(200).json(results);
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