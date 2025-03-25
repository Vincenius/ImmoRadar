import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const serverSession = await getServerSession(req, res, authOptions);

  if (!serverSession || !serverSession.user || !serverSession.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('estates');
      const userCollection = db.collection('users');
      const [user] = await userCollection.find({ email: serverSession.user.email }).toArray();

      if (req.method === 'POST') {
        const newEstate = JSON.parse(req.body)
        await collection.insertOne({ user_id: user._id, ...newEstate });

        res.status(200).json(newEstate);
      } else if (req.method === 'DELETE') {
        const { id } = req.query
        const [estate] = await collection.find({ _id: new ObjectId(id) }).toArray()

        if (user && user._id.toString() === estate.user_id.toString()) {
          await collection.deleteOne({ _id: new ObjectId(id) })

          return res.status(200).json({ success: true });
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      } else if (req.method === 'PUT') {
        const { _id, user_id, ...update} = JSON.parse(req.body)
        const [prevEstate] = await collection.find({ _id: new ObjectId(_id) }).toArray()

        if (user && user._id.toString() === prevEstate.user_id.toString()) {
          await collection.findOneAndUpdate(
            { _id: new ObjectId(_id) },
            { $set: update }
          ) 

          return res.status(200).json({ success: true });
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      } else {
        res.status(405).json({ message: 'Method Not Allowed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  }
}
