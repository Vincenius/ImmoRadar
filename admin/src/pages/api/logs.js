import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('logs');

      // Get 'from', 'to', and pagination parameters from query
      const { from, to, page = 1, type } = req.query;
      const limit = 50; // Items per page

      if (!from || !to) {
        return res.status(400).json({ error: "'from' and 'to' query parameters are required" });
      }

      const fromDate = new Date(from);
      const toDate = new Date(to);
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);

      if (isNaN(fromDate) || isNaN(toDate)) {
        return res.status(400).json({ error: 'Invalid date format for "from" or "to"' });
      }

      const typeFilter = type ? { type } : {};

      // MongoDB query to filter by created_at within the given timeframe
      const query = {
        created_at: {
          $gte: fromDate,
          $lte: toDate,
        },
        ...typeFilter
      };
      console.log(query)

      // Fetch total count for pagination
      const totalCount = await collection.countDocuments(query);

      // Fetch paginated results
      const logs = await collection
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ created_at: -1 })
        .toArray();

      // Summary aggregation
      const summary = await collection.aggregate([
        { $match: query },
        {
          $group: {
            _id: "$scraper",
            success_true: { $sum: { $cond: [{ $eq: ["$success", true] }, 1, 0] } },
            success_false: { $sum: { $cond: [{ $eq: ["$success", false] }, 1, 0] } },
          },
        },
      ]).toArray();

      res.status(200).json({
        logs,
        summary,
        pagination: {
          currentPage: parseInt(page, 10),
          pageSize: limit,
          totalCount, // Total number of documents matching the query
          totalPages: Math.ceil(totalCount / limit), // Total number of pages
        },
      });
    } catch (error) {
      console.error('Error on fetching logs:', error);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      // Close the connection
      client.close();
    }
  } else {
    res.status(400).json({ error: 'Invalid request method' });
  }
}
