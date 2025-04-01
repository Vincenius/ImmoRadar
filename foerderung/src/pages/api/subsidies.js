import generatePdf from '@/utils/generateSubsidyPdf'
import { sendEmail } from '@/utils/emails';
import subsidyTemplate from '@/utils/templates/subsidy';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const allSubsidies = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records?limit=1000`, {
        method: 'GET',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
        },
      }).then(res => res.json())

      let allQuestions = []
      let isLastPage = false
      let page = 0
      let maxTries = 0

      while (!isLastPage || maxTries > 10) {
        maxTries++ // prevent endless loop
        const res = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mhj8dvb0cf3wu6v/records?limit=1000&offset=${page * 1000}`, {
          method: 'GET',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
        }).then(res => res.json())

        const { pageInfo, list } = res

        allQuestions = [...allQuestions, ...list]
        isLastPage = pageInfo.isLastPage
        page = page + 1
      }

      const subsidiesWithQuestions = allSubsidies.list
        .filter(s => s.FirstFinished && s.Done)
        .map((subsidy) => ({
          ...subsidy,
          HouseType: subsidy.HouseType.split(','),
          Type: subsidy.Type.split(','),
          Measures: subsidy.Measures.split(','),
          Questions: allQuestions.filter(q => subsidy.Id === q.Subsidies_id).map(q => ({
            Id: q.Id,
            Question: q.Question,
            RequiredAnswer: q.RequiredAnswer
          }))
        }))

      if (req.query.id) {
        if (req.headers['x-api-key'] === process.env.API_KEY) {
          const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${req.query.id})`;
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

          // todo limit fields if user.isPaid === false
          const filteredSubsidies = subsidiesWithQuestions.filter(d =>
            d.HouseType.includes(userData.HouseType) &&
            (d.Region === userData.Region || d.Region === 'Bundesweit') &&
            (d.District === userData.District || !d.District) &&
            (
              userData.Type.includes('Zuschuss') && d.Type.includes('Zuschuss') ||
              userData.Type.includes('Kredit') && d.Type.includes('Kredit')
            ) &&
            d.Measures?.some(element => userData.Measures?.includes(element)) &&
            d?.Questions?.every(element => {
              const userAnswer = userData.Answers[element.Id]
              return (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
            })
          )

          const result = filteredSubsidies

          return res.status(200).json({ subsidies: result, user: userData, fullReportLength: filteredSubsidies.length })
        } else {
          return res.status(401).json({ message: 'Unauthorized' });
        }
      } else {
        const mappedResult = subsidiesWithQuestions.map((subsidy) => ({
          Id: subsidy.Id,
          Name: subsidy.Name,
          Region: subsidy.Region,
          District: subsidy.District,
          HouseType: subsidy.HouseType,
          Type: subsidy.Type,
          Measures: subsidy.Measures,
          Questions: subsidy.Questions,
        }))

        res.status(200).json(mappedResult);
      }
    } else if (req.method === 'POST') {
      const { email, data, answers } = JSON.parse(req.body)

      const id = uuidv4()
      await fetch(`${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records`, {
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
          Answers: answers,
          IsDev: process.env.STAGE !== 'prod',
          isPaid: false,
        })
      }).then(res => res.json())

      const { filename } = await generatePdf(id)
      await sendEmail({
        to: email,
        subject: 'Fertighaus Radar Förderungen Report',
        html: subsidyTemplate(),
        pdfFilePath: filename,
        pdfFileName: 'Fertighaus Radar Förderung Report.pdf'
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
