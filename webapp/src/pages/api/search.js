import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
            const db = client.db(process.env.MONGODB_DB);
            const collection = db.collection('estates');
            const locationCollection = db.collection('locations');

            const { q, input } = req.query;
            
            let results = [];

            if (input === 'manual') {
                results = await collection.find({ $or: [
                    {'address.city': { $regex: q, $options: 'i' } },
                    { 'address.district': { $regex: q, $options: 'i' } }
                ] }).limit(20).toArray();
            } else {
                const location = await locationCollection.findOne({ name: q });

                if (location) {
                    results = await collection.find({ 'address.zipCode': { $in: location.zipCodes } }).limit(20).toArray(); 
                }
            }

            res.status(200).json(results);
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