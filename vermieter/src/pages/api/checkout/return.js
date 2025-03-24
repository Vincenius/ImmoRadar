import Stripe from 'stripe';
import { MongoClient, ObjectId } from 'mongodb';
import { sendEmail } from '@/utils/emails';
import downloadTemplate from '@/lib/templates/download';
import subscriptionTemplate from '@/lib/templates/subscription';
import CryptoJS from 'crypto-js'

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      const { session_id } = JSON.parse(req.body)
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['line_items'],
      });

      if (session.status === 'complete') {
        const isSubscription = session.line_items.data[0].price.product === 'prod_RyjZPnfnRrWm2N' // year = prod_RyjZPnfnRrWm2N // onetime = prod_RyjYRPcvVU9wfV

        const collection = db.collection('contracts');
        await collection.findOneAndUpdate(
          { _id: new ObjectId(session.client_reference_id) },
          { $set: { paid: true } },
        );

        let encryptedId = CryptoJS.AES.encrypt(session.client_reference_id, process.env.PASSWORD_HASH_SECRET).toString();
        encryptedId = encryptedId.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

        if (isSubscription) {
          await sendEmail({
            to: session.customer_details.email,
            subject: `Dein Zugang ist bereit | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            html: subscriptionTemplate({ register_url: `${process.env.BASE_URL}/registrieren?token=${session_id}` })
          })
        } else {
          await sendEmail({
            to: session.customer_details.email,
            subject: `Mietvertrag Download | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            html: downloadTemplate({ download_url: `${process.env.BASE_URL}/download?token=${encryptedId}` })
          })
        }

        res.json({ success: true, id: encryptedId, stripe_id: session_id, isSubscription })
      } else {
        console.log('STATUS ERROR', session.status)
        res.json({ success: false, id: session.client_reference_id })
      }
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    } finally {
      client.close();
    }
  } else {
    res.status(400).json([])
  }
}