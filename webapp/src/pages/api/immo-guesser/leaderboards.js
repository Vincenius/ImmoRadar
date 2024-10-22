import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('immo-guesser-leaderboards');

      let result = []

      result = await  collection.find({})
        .sort({ score: -1 }).toArray()

      res.status(200).json(result);
    } catch (error) {
      console.error('Error on fetching autocomplete:', error);
      res.status(500)
    } finally {
      // Close the connection
      client.close();
    }
  } else if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('immo-guesser-leaderboards');

      const { score, username } = req.body

      await collection.insertOne({ score, username })

      res.status(200).json({ message: 'OK' });
    } catch (error) {
      console.error('Error on fetching autocomplete:', error);
      res.status(500)
    } finally {
      // Close the connection
      client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
