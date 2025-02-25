import generatePdf from '@/utils/generateSubsidyPdf';

export default async function handler(req, res) {
  try {
    // handle general get vs get with ?id=
    if (req.method === 'GET') {
      await generatePdf('38e42559-591e-400f-be42-ffbb1db9d383')
      res.json({})
    }
  } catch (error) {
    console.log(error)
  }
}