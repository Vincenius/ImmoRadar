import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    if (req.method === 'GET') {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('locations');

      let result = []

      result = await collection.aggregate([
        {
          $project: {
            name: 1,
            zipCodeCount: { $size: "$zipCodes" }
          }
        },
        {
          $sort: { zipCodeCount: -1 }
        },
        {
          $project: {
            name: 1,
            _id: 0
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
