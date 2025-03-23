import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, variant, defaultEmail } = JSON.parse(req.body)

    const price = variant === 'yearly' ? 'price_1R4m6VKQunG297Xz9FYWpwEM' : 'price_1R4m52KQunG297Xz4ljRKhy6'
    const mode = variant === 'yearly' ? 'subscription' : 'payment'

    try {
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        client_reference_id: id,
        customer_email: defaultEmail,
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode,
        return_url: `${process.env.BASE_URL}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
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
}