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
        const collection = db.collection('users');

        const user = await collection.findOneAndUpdate(
            { token },
            { $set: { confirmed: true } }
        );

        if (!user._id) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.redirect(`/login?confirmed=true`)
    } catch (error) {
        console.error(error);
        return res.redirect(`/unerwarteter-fehler`)
    } finally {
        client.close();
    }
}