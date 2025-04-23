import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  'premium': 'price_1QutGsKQunG297XzrH9slJ2f',
  'professional': 'price_1RCwx1KQunG297XzES3V5w8n',
  'professional_upgrade': 'price_1RDRqvKQunG297Xzkk2ciXQ0'
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, email, variant } = JSON.parse(req.body)
    try {
      let isUpgrade = false

      if (variant === 'professional') {
        const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
        const { list: [user] } = await fetch(url, {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
          },
        }).then(res => res.json())
        if (user.Variant === 'premium') {
          isUpgrade = true
        }
      }

      const price = isUpgrade ? 'price_1RDRqvKQunG297Xzkk2ciXQ0' : priceMap[variant]
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