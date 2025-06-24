export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const id = req.query.id

      const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
      const { list: [user] } = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
      }).then(res => res.json())

      await fetch(url, {
        method: 'PATCH',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ Id: user.Id, IsUnsubscribed: true })
      }).then(res => res.json())

      res.status(200).send("Du hast dich erfolgreich von unserem Newsletter abgemeldet. Es werden keine weiteren E-Mails mehr an dich versendet.")
    } else {
      res.json({})
    }
  } catch (error) {
    console.log(error)
    res.json({})
  }
}