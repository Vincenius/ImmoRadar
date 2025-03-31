import { MongoClient } from 'mongodb';
import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  const serverSession = await getServerSession(req, res, authOptions);
  if (!serverSession || !serverSession.user || !serverSession.user.email) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const userCollection = db.collection('users');
      const [user] = await userCollection.find({ email: serverSession.user.email }).toArray();

      if (req.method === 'GET') {
        const { _id, confirmed, password, stripe_id, subscription_id, token, ...result } = user // filter some fields
        const subscription = process.env.NEXT_PUBLIC_DISABLE_STRIPE === 'true' ? {} : await stripe.subscriptions.retrieve(subscription_id);
        const userResult = {
          ...result,
          susbcription_start_date: subscription.start_date,
          subscription_end_date: subscription.cancel_at_period_end ? subscription.cancel_at : null
        }

        res.status(200).json(userResult);
      } else if (req.method === 'PUT') {
        const update = JSON.parse(req.body)

        await userCollection.findOneAndUpdate(
          { _id: user._id },
          { $set: update }
        )

        res.status(200).json({});
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
