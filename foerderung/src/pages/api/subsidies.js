import { sendEmail } from '@/utils/emails';
import confirmTemplate from '@/utils/templates/confirmation';
import { v4 as uuidv4 } from 'uuid';

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

      const flatQuestions = allQuestions.map(q => q['_nc_m2m_Subsidies_SubsidyQuestions']).flat()

      let usedQuestions = []
      const subsidiesWithQuestions = allSubsidies.list
        .filter(s => s.FirstFinished && s.Done && !(s.Type.includes('Zuschuss') && s.Type.includes('Kredit')))
        .map((subsidy) => ({
          ...subsidy,
          HouseType: subsidy.HouseType.split(','),
          Type: subsidy.Type.split(','),
          Measures: subsidy.Measures.split(','),
          Questions: flatQuestions.filter(q => subsidy.Id === q.Subsidies_id).map(q => {
            if (usedQuestions.includes(q.SubsidyQuestions.Id)) { // prevent duplicate questions
              return null
            } else {
              usedQuestions.push(q.SubsidyQuestions.Id)
              return {
                Id: q.SubsidyQuestions.Id,
                Question: q.SubsidyQuestions.Question,
                RequiredAnswer: q.SubsidyQuestions.RequiredAnswer
              }
            }
          }).filter(Boolean),
          ConsultantNeeded: subsidy.ConsultantNeeded === 'YES',
          FundingDetails: subsidy.FundingDetails,
        }))

      if (req.query.id) {
        if (req.headers['x-api-key'] === process.env.API_KEY) {
          if (req.query.id === 'all' && process.env.STAGE !== 'prod') {
            const allMeasures = [...new Set(subsidiesWithQuestions.map(s => s.Measures).flat())].filter(m => m !== '')
            return res.status(200).json({ subsidies: subsidiesWithQuestions, user: { name: 'Test', Variant: 'premium', Type: ['Zuschuss', 'Kredit'], Measures: allMeasures } })
          } else {
            const { id, ignoreQuestions } = req.query
            const url = `${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records?where=(uuid,eq,${id})`;
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

            let count = 0
            let consultantCount = 0
            const filteredSubsidies = subsidiesWithQuestions.filter(d =>
              d.HouseType.includes(userData.HouseType) &&
              (d.Region === userData.Region || d.Region === 'Bundesweit') &&
              (d.District === userData.District || !d.District) &&
              (
                userData.Type.includes('Zuschuss') && d.Type.includes('Zuschuss') ||
                userData.Type.includes('Kredit') && d.Type.includes('Kredit')
              ) &&
              d.Measures?.some(element => userData.Measures?.includes(element)) &&
              (ignoreQuestions === 'true' || !userData.Answers || d.Type.includes('Kredit') || d?.Questions?.every(element => {
                const userAnswer = userData.Answers[element.Id]
                return (userAnswer === 'Unklar' || (userAnswer === 'Ja' && element.RequiredAnswer) || (userAnswer === 'Nein' && !element.RequiredAnswer))
              }))
            )

            const result = user.Variant !== 'free'
              ? filteredSubsidies
              : filteredSubsidies.map((subsidy) => ({
                Id: subsidy.Id,
                Name: subsidy.Name,
                Type: subsidy.Type,
                ConsultantNeeded: subsidy.ConsultantNeeded,
                ApplicationDeadline: subsidy.ApplicationDeadline,
                Website: subsidy.Website
              }))

            return res.status(200).json({ subsidies: result, user: userData, noConsultantCount: count, consultantCount });
          }
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
          Website: subsidy.Website,
          FundingDetails: subsidy.FundingDetails,
        }))

        res.status(200).json(mappedResult);
      }
    } else if (req.method === 'POST') {
      const { email, name, data, answers } = JSON.parse(req.body)
      const id = uuidv4()
      const user = {
        uuid: id,
        Email: email,
        Name: name,
        HouseType: data.HouseType,
        Region: data.Region,
        District: data.District,
        Type: data.TypZuschuss && data.TypKredit ? 'Zuschuss,Kredit' : data.TypZuschuss ? 'Zuschuss' : 'Kredit',
        Measures: data.Measures.join(','),
        Answers: answers,
        IsConfirmed: false,
        IsDev: process.env.STAGE !== 'prod',
        Variant: 'free',
      }

      await fetch(`${process.env.NOCODB_URI}/api/v2/tables/magkf3njbkwa8yw/records`, {
        method: 'POST',
        headers: {
          'xc-token': process.env.NOCODB_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      }).then(res => res.json())

      if (email) {
        await sendEmail({
          to: email,
          subject: `Bestätige deine E-Mail, um deinen Förderreport zu erhalten`,
          html: confirmTemplate(id),
        })
      }

      res.status(200).json({ id });
    } else {
      res.status(400).json({})
    }
  } catch (error) {
    console.log('unexpected error on subsidy fetch', error)
    res.status(500).json({})
  }
}
