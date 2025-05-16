import { MongoClient } from 'mongodb';
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmTemplate from '@/lib/templates/confirmation';
import Stripe from 'stripe';
import { updateContractAfterSubscription } from '@/lib/update-contract-subscription';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      const { email, password, token: stripe_id } = JSON.parse(req.body);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('users');

      const [user, stripeUser] = await Promise.all([
        collection.findOne({ email }),
        collection.findOne({ stripe_id })
      ])

      if (user) {
        return res.status(400).json({ success: false, message: 'UserExists' });
      } else if (stripe_id && stripeUser) {
        return res.status(400).json({ success: false, message: 'StripeUserExists' });
      } else {
        const passHash = CryptoJS.SHA256(password, process.env.PASSWORD_HASH_SECRET).toString(
          CryptoJS.enc.Hex
        )
        const token = uuidv4()
        let stripe_error = false
        if (stripe_id) {
          const session = await stripe.checkout.sessions.retrieve(stripe_id, { expand: ['line_items'] });
          if (session.status === 'complete' && session.line_items.data[0].price.product === 'prod_RyjZPnfnRrWm2N') {
            const newUser = await collection.insertOne({ email, password: passHash, confirmed: false, token, plan: 'year', subscription_id: session.subscription, stripe_id });

            if (session.client_reference_id) {
              await updateContractAfterSubscription({
                userId: newUser.insertedId,
                contractId: session.client_reference_id,
                db
              })
            }
          } else {
            stripe_error = true
          }
        } else {
          const plan = process.env.NEXT_PUBLIC_DISABLE_STRIPE === 'true' ? 'year' : 'free'
          await collection.insertOne({ email, password: passHash, confirmed: false, token, plan });
        }

        if (!stripe_error) {
          await sendEmail({
            to: email,
            subject: `Bitte bestätige deine E-Mail Addresse | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            html: confirmTemplate({ confirm_url: `${process.env.BASE_URL}/api/confirm?token=${token}` })
          })

          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ success: false, message: 'Stripe Error' });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      client.close();
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
