import fs from "fs";
import generatePdf from "@/utils/generateSubsidyPdf"

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
      const { list: [user] } = await fetch(url, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
        },
      }).then(res => res.json())

      const { filename } = await generatePdf(id, user);

      const fileStream = fs.createReadStream(filename);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="report-${id}.pdf"`);

      fileStream.pipe(res);

      fileStream.on('close', () => {
        fs.unlinkSync(filename); // lösche Datei nach dem Download
      });

      return;
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error', error)
    res.status(500).json({})
  }
}
