import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    if (req.method === 'GET') {
      const client = new MongoClient(process.env.MONGODB_URI);

      try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection('contracts');

        const [result] = await collection.find({ _id: new ObjectId(req.query.id) }).toArray();

        res.status(200).json(result);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
