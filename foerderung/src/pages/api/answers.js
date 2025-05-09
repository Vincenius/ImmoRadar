export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { id, answers } = JSON.parse(req.body)

      const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
      const { list: [user] } = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
        },
      }).then(res => res.json())

      if (user.Variant !== 'free') {
        await fetch(url, {
          method: 'PATCH',
          headers: {
              'xc-token': process.env.NOCODB_KEY,
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ Id: user.Id, Answers: { ...(user.Answers || {}), ...answers } })
        }).then(res => res.json())
      }

      res.status(200).json({ success: true });
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error on subsidy fetch', error)
    res.status(500).json({})
  }
}
