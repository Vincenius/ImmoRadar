import { MongoClient } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.headers['x-api-key'] === process.env.API_KEY) {
    if (req.method === 'GET') {
      const serverSession = await getServerSession(req, res, authOptions);

      if (!serverSession || !serverSession.user || !serverSession.user.email) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
          await client.connect();
          const db = client.db(process.env.MONGODB_DB);
          const collection = db.collection('contracts');
          const userCollection = db.collection('users');

          const user = await userCollection.find({ email: serverSession.user.email }).toArray();
          const contracts = await collection.find({ user_id: user[0]._id }).toArray();

          res.status(200).json(contracts);
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        } finally {
          client.close();
        }
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
