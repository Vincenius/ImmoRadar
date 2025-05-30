import Stripe from 'stripe';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  'starter': 'price_1RPju3KQunG297XzcWcM9VJz',
  'premium': 'price_1RPjyAKQunG297XzPZzO1d6C',
  'premium_upgrade': 'price_1RPjyzKQunG297XzNkEXxG4r',
  'premium_plus': 'price_1RT1EtKQunG297XzxXn4Lrma',
  'premium_plus_upgrade_starter': 'price_1RT2NrKQunG297XzwJWOe8Cm',
  'premium_plus_upgrade_premium': 'price_1RT2QYKQunG297Xz4p8QI6Cv'
}

const premiumPlusVariants = ['premium_plus', 'premium_plus_upgrade_starter', 'premium_plus_upgrade_premium']

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, email, name, variant } = JSON.parse(req.body)
    try {
      let isUpgrade = false

      // TODO check this??
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
        custom_fields: [!name && {
          key: 'name',
          label: {
            type: 'custom',
            custom: 'Name',
          },
          type: 'text',
        }, {
          key: 'phone_number',
          label: {
            type: 'custom',
            custom: 'Telefonnummer',
          },
          type: 'text',
          optional: !premiumPlusVariants.includes(variant),
        }].filter(Boolean),
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