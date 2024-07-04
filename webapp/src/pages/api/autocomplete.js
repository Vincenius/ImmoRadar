import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    // zipCode "10234"
    // city "Berlin-Siemensstadt" <- todo fix
    // district "Siemensstadt"

    if (req.method === 'GET') {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const estateCollection = db.collection('estates');

      let result = []

      result = await estateCollection.aggregate([
        {
          $group: {
            _id: {
              zipCode: "$address.zipCode",
              city: "$address.city",
              district: "$address.district"
            }
          }
        },
        {
          $project: {
            _id: 0,
            zipCode: "$_id.zipCode",
            city: "$_id.city",
            district: "$_id.district"
          }
        }
      ]).toArray()

      res.status(200).json(result);
    } else {
      res.status(400).json([])
    }
  } catch (error) {
    console.error('Error on fetching user:', error);
    res.status(500)
  } finally {
    // Close the connection
    client.close();
  }
}
