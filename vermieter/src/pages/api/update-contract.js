import { MongoClient, ObjectId } from 'mongodb';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const serverSession = await getServerSession(req, res, authOptions);
    const client = new MongoClient(process.env.MONGODB_URI);
    let isAuthenticated = false;
    let userId

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('contracts');
      const { _id } = req.body.userData
      console.log(_id)

      if (serverSession && serverSession.user && serverSession.user.email) {
        const userCollection = db.collection('users');
        const [user] = await userCollection.find({ email: serverSession.user.email }).toArray();
        const [contract] = await collection.find({ _id: new ObjectId(_id) }).toArray()

        if (user && user.plan === 'year' && user._id.toString() === contract.user_id.toString()) {
          isAuthenticated = true
          userId = user._id
        }
      }

      if (isAuthenticated) {
        const {
          visited,
          rooms,
          rentals,
          contract,
          landlordName,
          landlordStreet,
          landlordCity,
          landlordZip,
          landlordRepresentedBy,
          tenantName,
          tenantStreet,
          tenantCity,
          tenantZip,
          street,
          city,
          zip,
          level,
          location,
          flatType,
          sharedAssets,
          rent,
          deposit,
          bankAccount,
          utilitiesType,
          heating,
          utilities,
          rentStart,
          visitedDate,
          enclosures,
          additionalRooms,
          additionalEnclosures,
          additionalRentals,
          rentSteps,
        } = req.body.userData
  
        const result = await collection.findOneAndUpdate({ _id: new ObjectId(_id) }, { $set: {
          visited,
          rooms,
          rentals,
          contract,
          landlordName,
          landlordStreet,
          landlordCity,
          landlordZip,
          landlordRepresentedBy,
          tenantName,
          tenantStreet,
          tenantCity,
          tenantZip,
          street,
          city,
          zip,
          level,
          location,
          flatType,
          sharedAssets,
          rent,
          deposit,
          bankAccount,
          utilitiesType,
          heating,
          utilities,
          rentStart,
          visitedDate,
          enclosures,
          additionalRooms,
          additionalEnclosures,
          additionalRentals,
          rentSteps,
          paid: isAuthenticated,
          user_id: isAuthenticated ? userId : null
        }});
  
        return res.status(200).json(result);
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
