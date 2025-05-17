import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  'starter': 'price_1RPju3KQunG297XzcWcM9VJz',
  'premium': 'price_1RPjyAKQunG297XzPZzO1d6C',
  'premium_upgrade': 'price_1RPjyzKQunG297XzNkEXxG4r'
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, email, variant } = JSON.parse(req.body)
    try {
      let isUpgrade = false

      if (variant === 'premium') {
        const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
        const { list: [user] } = await fetch(url, {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
          },
        }).then(res => res.json())
        if (user.Variant === 'starter') {
          isUpgrade = true
        }
      }

      const price = isUpgrade ? 'price_1RPjyzKQunG297XzNkEXxG4r' : priceMap[variant]
      const optionalParams = email ? { customer_email: email } : {}
      const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        ...optionalParams,
        client_reference_id: id,
        line_items: [
          {
            price,
            quantity: 1,
          },
        ],
        mode: 'payment',
        return_url: `${process.env.BASE_URL}/return?session_id={CHECKOUT_SESSION_ID}`,
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