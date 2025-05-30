import generatePdf from '@/utils/generateSubsidyPdf';

export default async function handler(req, res) {
  try {
    // handle general get vs get with ?id=
    if (req.method === 'GET') {
      await generatePdf('81a84c54-3503-4ec0-9e45-675ec6e9a22d')
      res.json({})
    }
  } catch (error) {
    console.log(error)
    res.json({})
  }
}