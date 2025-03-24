import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import resetPasswordTemplate from '@/lib/templates/reset-password';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = JSON.parse(req.body);
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('users');
    const user = await collection.findOne({ email });

    const hasValidToken = user?.resetTokenExpires && (new Date(user?.resetTokenExpires) > new Date());

    if (user && !hasValidToken) {
      const token = uuidv4()
      await collection.updateOne({ email }, { $set: { resetToken: token, resetTokenExpires: new Date(Date.now() + 3600000 * 24) } });
      await sendEmail({
        to: email,
        subject: `Passwort zurücksetzten | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        html: resetPasswordTemplate({ reset_url: `${process.env.BASE_URL}/passwort-zuruecksetzten?token=${token}` })
      })
    }

    return res.json({ success: true })
  } catch (error) {
    console.error(error);
    return res.redirect(`/unerwarteter-fehler`)
  } finally {
    client.close();
  }
}