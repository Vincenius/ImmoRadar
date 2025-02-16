import generatePdf from '@/utils/generateSubsidyPdf'
import { sendEmail } from '@/utils/emails';
import subsidyTemplate from '@/utils/templates/subsidy';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    const allSubsidies = await fetch('https://admin.immoradar.xyz/api/v2/tables/mnc1qd2t096094t/records?limit=1000', {
      method: 'GET',
      headers: {
        'xc-token': process.env.NOCODB_KEY,
      },
    }).then(res => res.json())

    if (req.method === 'GET') {
      const mappedResult = allSubsidies.list.map((subsidy) => ({
        Id: subsidy.Id,
        Region: subsidy.Region,
        District: subsidy.District,
        HouseType: subsidy.HouseType.split(','),
        Type: subsidy.Type.split(','),
        Measures: subsidy.Measures.split(','),
      }))
    
      res.status(200).json(mappedResult);
    } else if (req.method === 'POST') {
      const { email, data } = JSON.parse(req.body)

      const filteredSubsidies = allSubsidies.list.map(d => ({
        ...d,
        HouseType: d.HouseType.split(','),
        Type: d.Type.split(','),
        Measures: d.Measures.split(','),
      })).filter(d =>
        d.HouseType.includes(data.HouseType) &&
        (d.Region === data.Region || d.Region === 'Bundesweit') &&
        (d.District === data.District || !d.District) &&
        (
          data.TypZuschuss && d.Type.includes('Zuschuss') ||
          data.TypKredit && d.Type.includes('Kredit')
        ) &&
        d.Measures?.some(element => data.Measures?.includes(element))
      )

      const { filename } = await generatePdf(filteredSubsidies)

      await sendEmail({
        to: email,
        subject: 'ImmoRadar Förderungen Report',
        html: subsidyTemplate(),
        pdfFilePath: filename,
        pdfFileName: 'ImmoRadar Förderung Report.pdf'
      })
      
      fs.unlinkSync(filename)
      
      res.status(200).json({});
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error on subsidy fetch', error)
    res.status(500).json({})
  }
}
