import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmTemplate from '@/utils/templates/confirmation-property';

const allowedBody = {
  "Firstname": "string",
  "Lastname": "string",
  "Email": "string",
  "Phone": "string",
  "Postalcode": "number",
  "City": "string",
  "Radius": "number",
  "ExcludeCity": "string",
  "MinSize": "number",
  "Budget": "number",
  "Comment": "string",
  "MaxSize": "number"
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const token = uuidv4();
      const body = {
        Token: token,
        Confirmed: false,
      };

      for (const [key, value] of Object.entries(JSON.parse(req.body))) {
        if (allowedBody[key]) { // only use allowed keys
          body[key] = value;
        }
      }

      const url = 'https://admin.immoradar.xyz/api/v2/tables/ml7dpwwbdlxn92i/records';
      const options = {
        method: 'POST',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      };

      try {
        await fetch(url, options).then(res => res.json())

        const name = `${body.Firstname} ${body.Lastname}`
        await sendEmail({
          to: body.Email,
          subject: 'Willkommen bei ImmoRadar – Bestätigen Sie Ihre E-Mail-Adresse',
          html: confirmTemplate({ confirm_url: `${process.env.BASE_URL}/api/email/confirm-property?token=${token}`, name })
        })

        res.status(200).json();
      } catch (err) {
        console.log('unexpected error on property signup', err)
        res.status(200).json(result);
      }
    } catch (error) {
      res.status(500)
    }
  } else {
    res.status(400).json([])
  }
}
