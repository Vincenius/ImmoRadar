import { MongoClient } from 'mongodb';
import CryptoJS from 'crypto-js'
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmTemplate from '@/utils/templates/confirmation';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      const { email, password } = JSON.parse(req.body);
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('users');

      const user = await collection.findOne({ email });

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      } else {
        const passHash = CryptoJS.SHA256(password, process.env.PASSWORD_HASH_SECRET).toString(
          CryptoJS.enc.Hex
        )
        const token = uuidv4()
        await collection.insertOne({ email, password: passHash, confirmed: false, token, plan: 'free' });

        await sendEmail({
          to: email,
          subject: `Bitte bestätige deine Anmeldung bei ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          html: confirmTemplate({ confirm_url: `${process.env.BASE_URL}/api/confirm?token=${token}` })
        })

        res.status(200).json({ success: true });
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
