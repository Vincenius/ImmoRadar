import { MongoClient } from 'mongodb';
import CryptoJS from 'crypto-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { token, password } = JSON.parse(req.body);
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection('users');
    const user = await collection.findOne({ resetToken: token });

    if (user) {
      const hasValidToken = user?.resetTokenExpires && (new Date(user?.resetTokenExpires) > new Date());
      if (!hasValidToken) {
        return res.status(400).json({ error: true })
      } else {
        const passHash = CryptoJS.SHA256(password, process.env.PASSWORD_HASH_SECRET).toString(
          CryptoJS.enc.Hex
        )
        await collection.updateOne({ email: user.email }, { $set: { password: passHash, resetToken: null, resetTokenExpires: null } });

        return res.json({ success: true })
      }
    } else {
      return res.status(400).json({ error: true })
    }

    // const hasValidToken = !!user?.resetTokenExpires && (new Date(user?.resetTokenExpires) > new Date());

    // if (user && !hasValidToken) {
    //   const token = uuidv4()
    //   await collection.updateOne({ email }, { $set: { resetToken: token, resetTokenExpires: new Date(Date.now() + 3600000 * 24) } });
    // }

    return res.json({ success: true })
  } catch (error) {
    console.error(error);
    return res.redirect(`/unerwarteter-fehler`)
  } finally {
    client.close();
  }
}