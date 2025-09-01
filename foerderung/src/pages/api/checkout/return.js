import Stripe from 'stripe';
import { sendEmail } from "@/utils/brevo";
import { createAccount, getTemplate } from '@/utils/brevo';
import prices from '@/utils/stripePrices';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

const priceMap = {
  [prices.starter]: 'starter',
  [prices.premium]: 'premium',
  [prices.premium_upgrade]: 'premium', // upgrade from starter
  [prices.premium_plus]: 'premium_plus',
  [prices.premium_plus_upgrade_starter]: 'premium_plus', // upgrade from starter to plus
  [prices.premium_plus_upgrade_premium]: 'premium_plus' // upgrade from starter to plus
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

        // if user already had email, he was upgraded from another plan
        const emailUpdate = user.Email ? { IsUpgrade: true } : { Email: session.customer_details.email, IsUpgrade: false }
        const phoneUpdate = user.Phone ? {} : { Phone: phone }
        const nameUpdate = user.Name ? {} : { Name: name }

        await fetch(url, {
          method: 'PATCH',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Id: user.Id,
            Variant: priceMap[price],
            ...emailUpdate,
            ...phoneUpdate,
            ...nameUpdate
          })
        }).then(res => res.json())

        const followUpDate = new Date()
        followUpDate.setDate(followUpDate.getDate() + 5);
        const yyyy = followUpDate.getFullYear();
        const mm = String(followUpDate.getMonth() + 1).padStart(2, '0');
        const dd = String(followUpDate.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mfgjv8c6rwrarjl/records`, {
          method: 'POST',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ UserId: user.Id, Date: formattedDate, Variant: user.Variant })
        })

        let isConfirm = false
        if (!user.Email) {
          isConfirm = true
          const allSubsidies = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records?limit=1000`, {
            method: 'GET',
            headers: {
              'xc-token': process.env.NOCODB_KEY,
            },
          }).then(res => res.json())

          const userData = {
            ...user,
            Type: user.Type.split(','),
            Measures: user.Measures.split(','),
          }
          const filteredSubsidies = allSubsidies.list
            .filter(s => s.FirstFinished && s.Done && s.Status === 'Prüfung Abgeschossen' && !(s.Type.includes('Zuschuss') && s.Type.includes('Kredit')))
            .map((subsidy) => ({
              ...subsidy,
              HouseType: subsidy.HouseType.split(','),
              Type: subsidy.Type.split(','),
              Measures: subsidy.Measures.split(','),
              ConsultantNeeded: subsidy.ConsultantNeeded === 'YES',
              FundingDetails: subsidy.FundingDetails,
            }))
            .filter(d =>
              d.HouseType.includes(userData.HouseType) &&
              (d.Region === userData.Region || d.Region === 'Bundesweit') &&
              (d.District === userData.District || !userData.District || !d.District) &&
              (
                userData.Type.includes('Zuschuss') && d.Type.includes('Zuschuss') ||
                userData.Type.includes('Kredit') && d.Type.includes('Kredit')
              ) &&
              d.Measures?.some(element => userData.Measures?.includes(element))
            )

          const finalDataAmount = filteredSubsidies.reduce((acc, curr) => {
            const subAmount = userData.Measures.reduce((subAcc, subCurr) => {
              return subAcc + curr.FundingDetails[subCurr]
            }, 0)
            return acc + subAmount
          }, 0)

          const confirmTemplate = await getTemplate('4')
          await Promise.all([
            createAccount(session.customer_details.email),
            sendEmail({
              to: session.customer_details.email,
              subject: confirmTemplate.subject,
              html: confirmTemplate.htmlContent
                .replace('[Name Anmeldung]', (name || ''))
                .replace('#top', `${process.env.BASE_URL}/email-bestaetigen?id=${user.uuid}`)
                .replace('{{foerdersumme}}', finalDataAmount.toFixed(0).replace(/(.)(?=(\d{3})+$)/g, '$1.'))
                .replace('https://www.abmeldung-newsletter', `${process.env.BASE_URL}/api/unsubscribe?id=${user.uuid}`),
            })
          ])
        } else {

        }

        res.json({ success: true, id: session.client_reference_id, isConfirm, variant: priceMap[price] })
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