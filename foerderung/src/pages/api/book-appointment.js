import sendEmail from "@/utils/emails";
import premiumPlusNotification from '@/utils/templates/premium-plus-notification';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { id, phone } = JSON.parse(req.body)
      console.log(id)
      const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
      const { list: [user] } = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
        },
      }).then(res => res.json())

      await sendEmail({
        to: process.env.PREMIUM_PLUS_NOTIFICATION_EMAIL,
        subject: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} Kunde hat Premium Plus angefragt`,
        html: premiumPlusNotification({ ...user, phone })
      })

      res.status(200).json({})
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error', error)
    res.status(500).json({})
  }
}
