export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const { ids } = JSON.parse(req.body)

      const questions = await Promise.all(ids.map(async id => {
        const data = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/links/ck9eh3qfu1mgmgo/records/${id}`, {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
        }).then(res => res.json())

        return {
          Id: id,
          questions: data.list
        }
      }))

      // todo fetch answers as well
      // /api/v2/tables/mhj8dvb0cf3wu6v/records

      res.status(200).json(questions)
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error on subsidy fetch', error)
    res.status(500).json({})
  }
}
