import Stripe from 'stripe';
import fs from 'fs'
import generatePdf from '@/utils/generateSubsidyPdf'
import { sendEmail } from '@/utils/emails';
import subsidyPaidTemplate from '@/utils/templates/subsidy-paid';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  'price_1QutGsKQunG297XzrH9slJ2f': 'premium',
  'price_1RCwx1KQunG297XzES3V5w8n': 'professional',
  'price_1RDRqvKQunG297Xzkk2ciXQ0': 'professional' // upgrade from premium
}


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { session_id } = JSON.parse(req.body)

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id, { expand: ['line_items'] });
      
      if (session.status === 'complete') {
        const price = session.line_items.data[0].price.id
        const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${session.client_reference_id})`;
        const { list: [user] } = await fetch(url, {
          method: 'GET',
          headers: {
              'xc-token': process.env.NOCODB_KEY,
              'Content-Type': 'application/json'
          },
        }).then(res => res.json())

        const emailUpdate = user.Email ? {} : { Email: session.customer_details.email }

        await fetch(url, {
          method: 'PATCH',
          headers: {
              'xc-token': process.env.NOCODB_KEY,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Id: user.Id, Variant: priceMap[price], ...emailUpdate })
        }).then(res => res.json())

        const { filename } = await generatePdf(session.client_reference_id)
        await sendEmail({
          to: user.Email || session.customer_details.email,
          subject: 'Dein Förderungen Report',
          html: subsidyPaidTemplate(session.client_reference_id),
          pdfFilePath: filename,
          pdfFileName: 'Förderung Report.pdf'
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