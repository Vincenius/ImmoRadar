import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmTemplate from '@/utils/templates/confirmation';

function deepEqual(x, y) {
  const ok = Object.keys, tx = typeof x, ty = typeof y;
  return x && y && tx === 'object' && tx === ty ? (
    ok(x).length === ok(y).length &&
      ok(x).every(key => deepEqual(x[key], y[key]))
  ) : (x === y);
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('subscriptions');

      const { email, frequency, filter, query, manualInput } = req.body;

      const existingSub = await collection.findOne({ email });
      let success = true;
      let duplicate = false;

      if (existingSub) {
        if (!existingSub.notifications.find(n => n.frequency === frequency && deepEqual(n.filter, filter) && n.query === query)) {
          existingSub.notifications.push({
            id: uuidv4(),
            frequency,
            filter,
            query,
            manualInput,
            last_sent: new Date(),
            active: true,
          });

          await collection.updateOne({ email }, { $set: { notifications: existingSub.notifications } });
        } else {
          duplicate = true;
          success = false;
        }
      } else {
        try {
          const notifications = [{
            id: uuidv4(),
            frequency,
            filter,
            query,
            manualInput,
            last_sent: new Date(),
            active: true,
          }]
          const token = uuidv4();
          await collection.insertOne({
            email,
            notifications,
            created_at: new Date(),
            confirmed: false,
            token,
          });

          await sendEmail({
            to: email,
            subject: 'Bitte bestätige deine Anmeldung bei ImmoRadar',
            html: confirmTemplate({ confirm_url: `${process.env.BASE_URL}/api/email/confirm?token=${token}` })
          })
        } catch(error) {
          console.error('Error on sending email:', error);
          success = false;
        }
      }

      res.status(200).json({ success, newAccount: !existingSub, duplicate });
    } catch (error) {
      console.error('Error on creating user:', error);
      res.status(500)
    } finally {
      // Close the connection
      client.close();
    }
  } else {
    res.status(400).json([])
  }
}
