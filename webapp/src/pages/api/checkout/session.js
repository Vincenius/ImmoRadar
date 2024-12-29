import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
          {
            price: 'price_1QbI5rKQunG297Xz4eqXGiXr',
            quantity: 1,
          },
        ],
        mode: 'payment',
        return_url: `${process.env.BASE_URL}/foerderung/ergebnis?session_id={CHECKOUT_SESSION_ID}`,
      });

      res.status(200).json({ clientSecret: session.client_secret, id: session.id });
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json([])
  }

  // todo get endpoint

  // todo webhook
}