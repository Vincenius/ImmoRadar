import fs from "fs";
import sendEmail from "@/utils/emails";
import generatePdf from "@/utils/generateSubsidyPdf"
import subsidyTemplate from "@/utils/templates/subsidy-paid";

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

      if (user.Variant !== 'free') {
        const { filename } = await generatePdf(id, user)
        await sendEmail({
          to: user.Email,
          subject: `${subjectTextMap[user.Variant]} Förderreport`,
          html: subsidyTemplate(),
          pdfFilePath: filename,
          pdfFileName: `${subjectTextMap[user.Variant]} Förderreport.pdf`
        })
        fs.unlinkSync(filename)
      }
      res.status(200).json({})
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error', error)
    res.status(500).json({})
  }
}
