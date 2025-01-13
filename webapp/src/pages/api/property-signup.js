import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmSearchTemplate from '@/utils/templates/confirmation-property-search';
import confirmOfferTemplate from '@/utils/templates/confirmation-property-offer'; // todo template

const getOptions = body => ({
  method: 'POST',
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        type,
        Firstname,
        Lastname,
        Email,
        Phone,
        ...rest
      } = JSON.parse(req.body);
      const token = uuidv4();

      const options = getOptions({
        Token: token,
        Confirmed: false,
        Firstname,
        Lastname,
        Email,
        Phone,
      })

      const newLead = await fetch('https://admin.immoradar.xyz/api/v2/tables/ml7dpwwbdlxn92i/records', options)
        .then(res => res.json())

      const url = type === 'search'
        ? 'https://admin.immoradar.xyz/api/v2/tables/m4nb6l1rim33px1/records'
        : 'https://admin.immoradar.xyz/api/v2/tables/moztle2smhvqtpb/records';

      const propertyOptions = getOptions(rest)
      const newProperty = await fetch(url, propertyOptions).then(res => res.json())

      const linkOptions = getOptions([{ Id: newProperty.Id }])
      const linkId = type === 'search' ? 'cg9srtd10w3bp3g' : 'ceuwectxvauw1jc'
      await fetch(`https://admin.immoradar.xyz/api/v2/tables/ml7dpwwbdlxn92i/links/${linkId}/records/${newLead.Id}`, linkOptions)

      const name = `${Firstname} ${Lastname}`
      await sendEmail({
        to: Email,
        subject: 'Willkommen bei ImmoRadar!',
        html: type === 'search'
          ? confirmSearchTemplate({ confirm_url: `${process.env.BASE_URL}/api/email/confirm-signup?token=${token}`, name })
          : confirmOfferTemplate({ confirm_url: `${process.env.BASE_URL}/api/email/confirm-signup?token=${token}`, name })
      })

      res.status(200).json();
    } catch (error) {
      console.log('unexpected error on property signup', error)
      res.status(500).json({})
    }
  } else {
    res.status(400).json([])
  }
}
