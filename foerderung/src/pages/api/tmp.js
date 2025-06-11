import generatePdf from '@/utils/generateSubsidyPdf';

export default async function handler(req, res) {
  try {
    // handle general get vs get with ?id=
    if (req.method === 'GET') {
      await generatePdf('9affb385-f3bf-44b0-9c11-7f215c789f1e', { Name: 'Vincent' })
      res.json({})
    }
  } catch (error) {
    console.log(error)
    res.json({})
  }
}