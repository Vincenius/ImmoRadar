import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('subscriptions');

      const { email, frequency, filter } = req.body;

      const existingSub = await collection.findOne({ email: req.body.email });
      console.log('existingSub', existingSub);

      // if (existingSub) {
      //   // TODO add or update
      // } else {
      //   // new user
      //   const notifications = [{
      //     frequency,
      //     filter,
      //   }]
      //   const token = uuidv4();
      //   await collection.insertOne({
      //     email,
      //     notifications,
      //     created_at: new Date(),
      //     confirmed: false,
      //     token,
      //   });
        
      //   // todo send email
      // }

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
