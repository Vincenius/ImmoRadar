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

      await Promise.all([
        fetch(url, {
          method: 'PATCH',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Id: user.Id, IsConfirmed: true })
        }).then(res => res.json()),
        createAccount(user.Email)
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