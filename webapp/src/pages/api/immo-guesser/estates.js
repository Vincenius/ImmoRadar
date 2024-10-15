import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('estates');
      const locationCollection = db.collection('locations');

      const { q } = req.query;

      let result = []
      let query = []

      if (q) {
        const location = await locationCollection.findOne({ name: q });
        if (location) {
          query.push({ 'address.zipCode': { $in: location.zipCodes } })
        }
      }

      result = await collection.aggregate([
        {
          $match: { $and: [
            ...query,
            { "price.value": { $gte: 300 } },
            { "price.additionalInfo": "COLD_RENT" },
            { $expr: { $gt: [{ $size: "$gallery" }, 3] } }
          ] }
        },
        { $sample: { size: 5 } },
      ]).toArray()

      res.status(200).json(result);
    } catch (error) {
      console.error('Error on fetching autocomplete:', error);
      res.status(500)
    } finally {
      // Close the connection
      client.close();
    }
  } else {
    res.status(400).json([])
  }
}
