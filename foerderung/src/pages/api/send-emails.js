import { getTemplate } from '@/utils/brevo';
import sendEmail from '@/utils/emails';

export default async function handler(req, res) {
  const headerValue = req.headers['x-api-key'];

  if (!headerValue || headerValue !== process.env.API_KEY) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    const emailIdMap = {
      'free': '16',
      'starter': '17',
      'premium': '18',
    }
    const lpMap = {
      'free': 'starter',
      'starter': 'premium',
      'premium': 'premium-plus',
    }

    try {
      if (req.method === 'GET') {
        const url = `${process.env.NOCODB_URI}/api/v2/tables/mfgjv8c6rwrarjl/records?limit=1000`
        const { list } = await fetch(url, {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
        }).then(res => res.json())

        const today = new Date()
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;

        list.forEach(async email => {
          if (email.Date !== formattedDate) {
            const userUrl = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(Id,eq,${email.UserId})`;
            const { list: [user] } = await fetch(userUrl, {
              method: 'GET',
              headers: {
                'xc-token': process.env.NOCODB_KEY,
                'Content-Type': 'application/json'
              },
            }).then(res => res.json())

            if (user.Variant === email.Variant && !user.IsUnsubscribed) {
              const template = await getTemplate(emailIdMap[user.Variant])

              await sendEmail({
                to: user.Email,
                subject: template.subject,
                html: template.htmlContent
                  .replace('[Name Anmeldung]', user.Name)
                  .replace('#top', `${process.env.BASE_URL}/landingpages/${lpMap[user.Variant]}?id=${user.uuid}`)
                  .replace('https://www.abmeldung-newsletter', `${process.env.BASE_URL}/api/unsubscribe?id=${user.uuid}`),
              })
            }

            await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mfgjv8c6rwrarjl/records`, {
              method: 'DELETE',
              headers: {
                'xc-token': process.env.NOCODB_KEY,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ Id: email.Id })
            }).then(res => res.json())
          }
        });

        res.json({})
      } else {
        res.json({})
      }
    } catch (error) {
      console.log(error)
      res.json({})
    }
  }
}
