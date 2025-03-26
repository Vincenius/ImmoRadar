import { MongoClient, ObjectId } from 'mongodb';
import Stripe from 'stripe';
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { createEstateFromContract } from '@/lib/create-estate';
import { updateContractAfterSubscription } from '@/lib/update-contract-subscription';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token } = JSON.parse(req.body);
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('users');
    const contractCollection = db.collection('contracts');
    const stripeUser = await collection.findOne({ stripe_id: token });

    if (stripeUser) {
      return res.status(409).json({ error: true })
    } else {
      const session = await stripe.checkout.sessions.retrieve(token, { expand: ['line_items'] });
      if (session.status === 'complete' && session.line_items.data[0].price.product === 'prod_RyjZPnfnRrWm2N') {
        const serverSession = await getServerSession(req, res, authOptions);
        const user = await collection.findOne({ email: serverSession.user.email });

        if (session.client_reference_id) {
          await updateContractAfterSubscription({
            userId: user._id,
            contractId: session.client_reference_id,
            db,
          })
        }
        await collection.updateOne({ email: user.email }, { $set: { stripe_id: token, plan: 'year', subscription_id: session.subscription } })

        return res.status(200).json({ error: false })
      } else {
        res.status(400).json({ error: true })
      }

    }
  } catch (error) {
    console.error(error);
    return res.redirect(`/unerwarteter-fehler`)
  } finally {
    client.close();
  }
}