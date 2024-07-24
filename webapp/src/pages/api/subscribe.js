import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmTemplate from '@/utils/templates/confirmation';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('subscriptions');

      const { email, frequency, filter } = req.body;

      const existingSub = await collection.findOne({ email: req.body.email });
      let success = true;

      if (existingSub) {
        console.log('TODO')
        // TODO add or update
      } else {
        try {
          const notifications = [{
            frequency,
            filter,
          }]
          const token = uuidv4();
          await collection.insertOne({
            email,
            notifications,
            created_at: new Date(),
            confirmed: false,
            active: true,
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

      res.status(200).json({ success });
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
