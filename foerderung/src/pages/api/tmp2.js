import { getTemplate } from '@/utils/brevo';

export default async function handler(req, res) {
  try {
    // handle general get vs get with ?id=
    if (req.method === 'GET' && process.env.STAGE === 'local') {
      const template = await getTemplate('10')
      res.json({ template })
    } else {
      res.json({})
    }
  } catch (error) {
    console.log(error)
    res.json({})
  }
}
