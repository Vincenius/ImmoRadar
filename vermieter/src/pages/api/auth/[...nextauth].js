import NextAuth from "next-auth"
import CryptoJS from 'crypto-js'
import { MongoClient } from 'mongodb';
import CredentialsProvider from "next-auth/providers/credentials"
import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

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
          const { email, password, token } = credentials
          const passHash = CryptoJS.SHA256(password, process.env.PASSWORD_HASH_SECRET).toString()

          await client.connect();
          const db = client.db(process.env.MONGODB_DB);
          const collection = db.collection('users');
          const user = await collection.findOne({ email });

          if (user && user.password === passHash) {
            if (token && token !== "undefined") {
              const [stripeUser, stripeSession] = await Promise.all([
                collection.findOne({ stripe_id: token }),
                stripe.checkout.sessions.retrieve(token, { expand: ['line_items'] })
              ])

              if (!stripeUser && stripeSession.status === 'complete' && stripeSession.line_items.data[0].price.product === 'prod_RyjZPnfnRrWm2N') {
                await collection.updateOne({ email }, { $set: { stripe_id: token, plan: 'year', expires_at: stripeSession.expires_at } })
              }
            }
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
  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.plan = user.plan;
    //     token.expires_at = user.expires_at;
    //   }
    //   return token;
    // },
    async session({ session, token }) {
      if (session.user.email) {
        const client = new MongoClient(process.env.MONGODB_URI);
        try {
          await client.connect();
          const db = client.db(process.env.MONGODB_DB);
          const collection = db.collection('users');
          const user = await collection.findOne({ email: session.user.email });
          if (user) {
            session.user.plan = user.plan;
            session.user.expires_at = user.expires_at;
            session.user.confirmed = user.confirmed;
          }
        } catch (error) {
          console.error(error);
        } finally {
          client.close();
        }
      }
      return session;
    },
  },
}

export default NextAuth(authOptions)