import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('subscriptions');

      
      // todo create a new subscription

      // todo send opt in email

      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error on creating user:', error);
      res.status(500)
    } finally {
      // Close the connection
      client.close();
    }
  } else {
    res.status(400).json([])
  }
}
