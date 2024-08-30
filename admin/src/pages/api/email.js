import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ error: 'Both "from" and "to" dates are required' });
      return;
    }

    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('emails');
      const subscriptionCollection = db.collection('subscriptions');

      // Parse the from and to dates
      const fromDate = new Date(from);
      const toDate = new Date(to);

      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        res.status(400).json({ error: 'Invalid "from" or "to" date' });
        return;
      }

      const [emails, subscribers] = await Promise.all([
        collection.find({
          created_at: { $gte: fromDate, $lte: toDate }
        }).toArray(),
        subscriptionCollection.find({
          confirmed: true,
          notifications: {
            $elemMatch: {
              active: true,
            }
          }
        }).toArray()
      ])

      res.status(200).json({ emails, subscribers });
    } catch (error) {
      console.error('Error on fetching data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Close the connection
      client.close();
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
}
