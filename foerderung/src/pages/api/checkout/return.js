import Stripe from 'stripe';
import fs from 'fs'
import generatePdf from '@/utils/generateSubsidyPdf'
import { sendEmail } from '@/utils/emails';
import subsidyPaidTemplate from '@/utils/templates/subsidy-paid';
import premiumPlusNotification from '@/utils/templates/premium-plus-notification';
import { createAccount } from '@/utils/brevo';

const variantTextMap = {
  'free': 'Kostenfreie',
  'starter': 'Starter',
  'premium': 'Premium',
  'premium_plus': 'Premium',
}

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  'price_1RPju3KQunG297XzcWcM9VJz': 'starter',
  'price_1RPjyAKQunG297XzPZzO1d6C': 'premium',
  'price_1RPjyzKQunG297XzNkEXxG4r': 'premium', // upgrade from starter
  'price_1RT1EtKQunG297XzxXn4Lrma': 'premium_plus',
  'price_1RT2NrKQunG297XzwJWOe8Cm': 'premium_plus', // upgrade from starter to plus
  'price_1RT2QYKQunG297Xz4p8QI6Cv': 'premium_plus' // upgrade from starter to plus
}


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { session_id } = JSON.parse(req.body)

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] });

      if (session.status === 'complete') {
        const price = session.line_items.data[0].price.id
        const phone = session?.custom_fields ? session.custom_fields.find(f => f.key === 'phone_number')?.text?.value : null
        const name = session?.custom_fields ? session.custom_fields.find(f => f.key === 'name')?.text?.value : null

        const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${session.client_reference_id})`;
        const { list: [user] } = await fetch(url, {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
        }).then(res => res.json())

        const emailUpdate = user.Email ? {} : { Email: session.customer_details.email }
        const phoneUpdate = user.Phone ? {} : { Phone: phone }
        const nameUpdate = user.Name ? {} : { Name: name }

        await fetch(url, {
          method: 'PATCH',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Id: user.Id, Variant: priceMap[price], ...emailUpdate, ...phoneUpdate, ...nameUpdate })
        }).then(res => res.json())

        if (!user.Email) {
          await createAccount(session.customer_details.email)
        }

        if (['price_1RT1EtKQunG297XzxXn4Lrma', 'price_1RT2NrKQunG297XzwJWOe8Cm', 'price_1RT2QYKQunG297Xz4p8QI6Cv'].includes(price)) {
          await sendEmail({
            to: process.env.PREMIUM_PLUS_NOTIFICATION_EMAIL,
            subject: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} Kunde hat Premium Plus gekauft`,
            html: premiumPlusNotification({ ...user, ...phoneUpdate, ...emailUpdate, ...nameUpdate })
          })
        }

        const { filename } = await generatePdf(session.client_reference_id, { ...user, ...phoneUpdate, ...emailUpdate, ...nameUpdate })
        await sendEmail({
          to: user.Email || session.customer_details.email,
          subject: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} Förderungen Report`,
          html: subsidyPaidTemplate(session.client_reference_id),
          pdfFilePath: filename,
          pdfFileName: `Dein Förderreport - ${variantTextMap[priceMap[price]]} Variante.pdf`
        })
        fs.unlinkSync(filename)

        res.json({ success: true, id: session.client_reference_id })
      } else {
        console.log('STATUS ERROR', session.status)
        res.json({ success: false, id: session.client_reference_id })
      }
    }
    catch (error) {
      console.log(error)
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json([])
  }
}