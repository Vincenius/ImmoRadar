import Stripe from 'stripe';
import fs from 'fs'
// import generatePdf from '@/utils/generateSubsidyPdf'
import { sendEmail } from '@/utils/emails';
// import subsidyPaidTemplate from '@/utils/templates/subsidy-paid';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { session_id } = JSON.parse(req.body)
    console.log(session_id)
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      
      if (session.status === 'complete') {
        const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${session.client_reference_id})`;
        const { list: [user] } = await fetch(url, {
          method: 'GET',
          headers: {
              'xc-token': process.env.NOCODB_KEY,
              'Content-Type': 'application/json'
          },
        }).then(res => res.json())

        await fetch(url, {
          method: 'PATCH',
          headers: {
              'xc-token': process.env.NOCODB_KEY,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Id: user.Id, isPaid: true })
        }).then(res => res.json())

        // const { filename } = await generatePdf(session.client_reference_id)
        // await sendEmail({
        //   to: user.Email,
        //   subject: 'Fertighaus Radar Förderungen Report',
        //   html: subsidyPaidTemplate(),
        //   pdfFilePath: filename,
        //   pdfFileName: 'Fertighaus Radar Förderung Report.pdf'
        // })
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