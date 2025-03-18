import NextAuth from "next-auth"
import CryptoJS from 'crypto-js'
import { MongoClient } from 'mongodb';
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  secret: process.env.AUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const client = new MongoClient(process.env.MONGODB_URI);

        try {
          const { email, password } = credentials
          const passHash = CryptoJS.SHA256(password, process.env.PASSWORD_HASH_SECRET).toString()

          await client.connect();
          const db = client.db(process.env.MONGODB_DB);
          const collection = db.collection('users');

          const user = await collection.findOne({ email });

          if (user && user.password === passHash) {
            return user
          }

          return null
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        } finally {
          client.close();
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
    // TODO Google Auth
  ],
}

export default NextAuth(authOptions)