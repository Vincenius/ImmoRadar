import { createAccount } from '@/utils/brevo';

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { id } = JSON.parse(req.body)

      const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
      const { list: [user] } = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())

      const followUpDate = new Date()
      followUpDate.setDate(followUpDate.getDate() + 5);
      const yyyy = followUpDate.getFullYear();
      const mm = String(followUpDate.getMonth() + 1).padStart(2, '0');
      const dd = String(followUpDate.getDate()).padStart(2, '0');
      const formattedDate = `${yyyy}-${mm}-${dd}`;

      await Promise.all([
        fetch(url, {
          method: 'PATCH',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Id: user.Id, IsConfirmed: true })
        }).then(res => res.json()),
        createAccount(user.Email),
        fetch(`${process.env.NOCODB_URI}/api/v2/tables/mfgjv8c6rwrarjl/records`, {
          method: 'POST',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ UserId: user.Id, Date: formattedDate, Variant: user.Variant })
        })
      ])

      res.json({ success: true })
    } else {
      res.json({})
    }
  } catch (error) {
    console.log(error)
    res.json({})
  }
}