import fs from "fs";
import sendEmail from "@/utils/emails";
import generatePdf from "@/utils/generateSubsidyPdf"
import subsidyTemplate from "@/utils/templates/subsidy-paid";
import { getTemplate } from "@/utils/brevo";

const subjectTextMap = {
  'free': 'Kostenloser',
  'starter': 'Starter',
  'premium': 'Premium',
  'premium_plus': 'Premium',
}


export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { id } = JSON.parse(req.body)
      const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
      const { list: [user] } = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
        },
      }).then(res => res.json())

      const templateMap = user.IsUpgrade ? {
        'starter': '20',
        'premium': '21',
      } : {
        'free': '9',
        'starter': '10',
        'premium': '11',
      }

      const lpMap = {
        'free': 'starter',
        'starter': 'premium',
        'premium': 'premium-plus',
      }

      const template = await getTemplate(templateMap[user.Variant])
      const { filename } = await generatePdf(id, user)

      await sendEmail({
        to: user.Email,
        subject: template.subject,
        html: template.htmlContent
          .replace('[Name Anmeldung]', user.Name)
          .replace('#top', `${process.env.BASE_URL}/landingpages/${lpMap[user.Variant]}?id=${id}`)
          .replace('https://www.abmeldung-newsletter', `${process.env.BASE_URL}/api/unsubscribe?id=${id}`),
        pdfFilePath: filename,
        pdfFileName: `${subjectTextMap[user.Variant]} Förderreport.pdf`
      })
      fs.unlinkSync(filename)

      res.status(200).json({})
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error', error)
    res.status(500).json({})
  }
}
