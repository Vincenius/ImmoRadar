import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { token } = req.query;
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db(process.env.MONGODB_DB);
        const collection = db.collection('subscriptions');

        await collection.findOneAndDelete({ token });

        return res.redirect(`/deleted`)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    } finally {
        // Close the connection
        client.close();
    }
}