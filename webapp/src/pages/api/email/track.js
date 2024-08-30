import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  if (req.body.api_key !== process.env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    const { token } = req.body;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('emails');

      const email = await collection.findOneAndUpdate(
        { token },
        { $set: { opened: true } }
      );

      if (!email || !email._id) {
        return res.status(404).json({ message: 'Email not found' });
      }

      return res.status(200).json({ message: 'Email tracked' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      // Close the connection
      client.close();
    }
  }
}