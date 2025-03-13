import generatePdf from '@/utils/generateSubsidyPdf';

export default async function handler(req, res) {
  try {
    // handle general get vs get with ?id=
    if (req.method === 'GET') {
      await generatePdf('a4980082-f609-4697-b319-c2b38a4ce810')
      res.json({})
    }
  } catch (error) {
    console.log(error)
    res.json({})
  }
}