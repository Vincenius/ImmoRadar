import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    const serverSession = await getServerSession(req, res, authOptions);
    const client = new MongoClient(process.env.MONGODB_URI);
    let isAuthenticated = false;

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('contracts');
      const { id } = req.query

      if (serverSession && serverSession.user && serverSession.user.email) {
        const userCollection = db.collection('users');
        const [user] = await userCollection.find({ email: serverSession.user.email }).toArray();
        const [contract] = await collection.find({ _id: new ObjectId(id) }).toArray()

        if (user && user._id.toString() === contract.user_id.toString()) {
          isAuthenticated = true
        }
      }

      if (isAuthenticated) {
        await collection.deleteOne({ _id: new ObjectId(id) })

        return res.status(200).json({ success: true });
      } else {
        return res.status(401).json({ message: 'Unauthorized' });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
