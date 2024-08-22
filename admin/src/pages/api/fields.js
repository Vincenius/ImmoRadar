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
      const collection = db.collection('estates');

      // Parse the from and to dates
      const fromDate = new Date(from);
      const toDate = new Date(to);

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        res.status(400).json({ error: 'Invalid "from" or "to" date' });
        return;
      }

      // Filter the records based on the provided date range
      const records = await collection.find({
        created_at: { $gte: fromDate, $lte: toDate }
      }).toArray();

      if (records.length === 0) {
        res.status(200).json([]);
        return;
      }

      // Initialize a structure to store the counts
      const fieldCounts = {};

      // Helper function to recursively process nested objects
      const processField = (provider, fieldPath, value) => {
        if (!fieldCounts[provider]) {
          fieldCounts[provider] = {};
        }

        if (!fieldCounts[provider][fieldPath]) {
          fieldCounts[provider][fieldPath] = { filled: 0, total: 0 };
        }

        fieldCounts[provider][fieldPath].total += 1;

        if (value !== null && value !== undefined && value !== '') {
          fieldCounts[provider][fieldPath].filled += 1;
        }
      };

      // Process each record
      records.forEach(record => {
        const provider = record.provider;

        const traverse = (obj, parentPath = '') => {
          Object.keys(obj).forEach(field => {
            const value = obj[field];
            const fieldPath = parentPath ? `${parentPath}.${field}` : field;

            if (field !== '_id' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
              traverse(value, fieldPath);
            } else {
              processField(provider, fieldPath, value);
            }
          });
        };

        traverse(record);
      });

      // Calculate the percentage for each field
      const result = Object.keys(fieldCounts).map(provider => {
        const fields = fieldCounts[provider];
        const fieldPercentages = {};

        Object.keys(fields).forEach(field => {
          const { filled, total } = fields[field];
          fieldPercentages[field] = (filled / total) * 100;
        });

        return { provider, fields: fieldPercentages };
      });

      res.status(200).json(result);
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
