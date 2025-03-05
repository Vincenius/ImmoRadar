import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/utils/emails';
import confirmSearchTemplate from '@/utils/templates/confirmation-property-search';
import confirmOfferTemplate from '@/utils/templates/confirmation-property-offer';
import budgetCalculatorTemplate from '@/utils/templates/confirmation-budget-calculator';

export const config = {
  api: {
      bodyParser: {
          sizeLimit: '20mb'
      }
  }
}

const getOptions = body => ({
  method: 'POST',
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})

const tableIds = {
  search: 'm4nb6l1rim33px1',
  property: 'moztle2smhvqtpb',
  'budget-calculator': 'me9qgrdqqqqgmg8'
}

const linkIds = {
  search: 'cg9srtd10w3bp3g',
  property: 'ceuwectxvauw1jc',
  'budget-calculator': 'cl7bcpswx7wexfj'
}

const fileLinkIds = {
  search: 'ch1wwt3i5wtb24a',
  property: 'cm5utesjdvpqyg8',
}

const templates = {
  search: confirmSearchTemplate,
  property: confirmOfferTemplate,
  'budget-calculator': budgetCalculatorTemplate
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const {
        type,
        Firstname,
        Lastname,
        Email,
        Phone,
        files,
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

      const newLead = await fetch(`${NOCODB_URI}/api/v2/tables/ml7dpwwbdlxn92i/records`, options)
        .then(res => res.json())

      const url = `${NOCODB_URI}/api/v2/tables/${tableIds[type]}/records`

      const propertyOptions = getOptions(rest)
      const newSignup = await fetch(url, propertyOptions).then(res => res.json())

      const linkOptions = getOptions([{ Id: newSignup.Id }])
      const linkId = linkIds[type]
      await fetch(`${NOCODB_URI}/api/v2/tables/ml7dpwwbdlxn92i/links/${linkId}/records/${newLead.Id}`, linkOptions)

      if (['property', 'search'].includes(type) && files && files.length > 0) {
        // async upload in the background
        fetch(process.env.BASE_URL + '/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            files: files,
            recordId: newSignup.Id,
            linkId: fileLinkIds[type],
            tableId: tableIds[type],
            api_key: process.env.API_KEY,
          })
        })
      }

      const name = `${Firstname} ${Lastname}`
      await sendEmail({
        to: Email,
        subject: 'Willkommen bei Fertighaus Radar!',
        html: templates[type]({ confirm_url: `${process.env.BASE_URL}/api/email/confirm-signup?token=${token}`, name })
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
