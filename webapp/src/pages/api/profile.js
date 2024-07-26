import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
    const { token } = req.query;

    if (req.method === 'GET') {
        const client = new MongoClient(process.env.MONGODB_URI);
    
        try {
            await client.connect();
            const db = client.db(process.env.MONGODB_DB);
            const collection = db.collection('subscriptions');
    
            const user = await collection.findOne({ token });
    
            if (!user || !user._id) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            return res.status(200).json(user);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            // Close the connection
            client.close();
        }
    
    } else if (req.method === 'PUT') {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const db = client.db(process.env.MONGODB_DB);
            const collection = db.collection('subscriptions');
            const { id, frequency, filter, active } = req.body;
            // filter empty values from body
            const update = Object.fromEntries(Object.entries({
                    frequency,
                    filter,
                    active,
                }).filter(([key, value]) => value !== undefined && value !== null)
                .map(([key, value]) => [`notifications.$.${key}`, value])
            );

            const result = await collection.findOneAndUpdate({
                token,
                'notifications.id': id
            }, {
                $set: update,
            }, { returnDocument: 'after' });
    
            if (!result || !result._id) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            // Close the connection
            client.close();
        }
    } else if (req.method === 'DELETE') {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
            await client.connect();
            const db = client.db(process.env.MONGODB_DB);
            const collection = db.collection('subscriptions');
            const { id } = req.body;

            const result = await collection.findOneAndUpdate({
                token,
                'notifications.id': id
            }, { $pull: { notifications: { id: id } }},
            { returnDocument: 'after' });
    
            if (!result || !result._id) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            return res.status(200).json(result);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        } finally {
            // Close the connection
            client.close();
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }
}