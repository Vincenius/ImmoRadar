import generatePdf from '@/utils/generateSubsidyPdf'
import { sendEmail } from '@/utils/emails';
import subsidyTemplate from '@/utils/templates/subsidy';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    // handle general get vs get with ?id=
    if (req.method === 'GET') {
      const allSubsidies = await fetch('https://admin.immoradar.xyz/api/v2/tables/mnc1qd2t096094t/records?limit=1000', {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
        },
      }).then(res => res.json())

      if (req.query.id) {
        if (req.headers['x-api-key'] === process.env.API_KEY) {
          const url = `https://admin.immoradar.xyz/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${req.query.id})`;
          const { list: [user] } = await fetch(url, {
            method: 'GET',
            headers: {
              'xc-token': process.env.NOCODB_KEY,
            },
          }).then(res => res.json())

          const userData = {
            ...user,
            Type: user.Type.split(','),
            Measures: user.Measures.split(','),
          }

          const filteredSubsidies = allSubsidies.list.map(d => ({
            ...d,
            HouseType: d.HouseType.split(','),
            Type: d.Type.split(','),
            Measures: d.Measures.split(','),
          })).filter(d =>
            d.HouseType.includes(userData.HouseType) &&
            (d.Region === userData.Region || d.Region === 'Bundesweit') &&
            (d.District === userData.District || !d.District) &&
            (
              userData.Type.includes('Zuschuss') && d.Type.includes('Zuschuss') ||
              userData.Type.includes('Kredit') && d.Type.includes('Kredit')
            ) &&
            d.Measures?.some(element => userData.Measures?.includes(element)),
          )

          const result = user.isPaid ? filteredSubsidies : filteredSubsidies.slice(0, 3)

          return res.status(200).json({ subsidies: result, user: userData, fullReportLength: filteredSubsidies.length })
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      } else {
        const mappedResult = allSubsidies.list.map((subsidy) => ({
          Id: subsidy.Id,
          Region: subsidy.Region,
          District: subsidy.District,
          HouseType: subsidy.HouseType.split(','),
          Type: subsidy.Type.split(','),
          Measures: subsidy.Measures.split(','),
        }))
      
        res.status(200).json(mappedResult);
      }
    } else if (req.method === 'POST') {
      const { email, data } = JSON.parse(req.body)

      const id = uuidv4()
      await fetch('https://admin.immoradar.xyz/api/v2/tables/magkf3njbkwa8yw/records', {
        method: 'POST',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uuid: id,
          Email: email,
          HouseType: data.HouseType,
          Region: data.Region,
          District: data.District,
          Type: data.TypZuschuss && data.TypKredit ? 'Zuschuss,Kredit' : data.TypZuschuss ? 'Zuschuss' : 'Kredit',
          Measures: data.Measures.join(','),
          IsDev: process.env.STAGE !== 'prod',
          isPaid: false,
        })
      }).then(res => res.json())

      const { filename } = await generatePdf(id)

      await sendEmail({
        to: email,
        subject: 'ImmoRadar Förderungen Report',
        html: subsidyTemplate(),
        pdfFilePath: filename,
        pdfFileName: 'ImmoRadar Förderung Report.pdf'
      })
      
      fs.unlinkSync(filename)
      
      res.status(200).json({ id });
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error on subsidy fetch', error)
    res.status(500).json({})
  }
}
