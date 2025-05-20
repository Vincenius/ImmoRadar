require('dotenv').config()
const fs = require('fs')
let converter = require('json-2-csv');

const run = async () => {
  const { list: allSubsidies } = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records?limit=1000`, {
    method: 'GET',
    headers: {
      'xc-token': process.env.NOCODB_KEY,
    },
  }).then(res => res.json())

  const filteredSubsidies = allSubsidies.filter(s => s.FirstFinished && s.Done && s.Type === 'Zuschuss')

  const data = filteredSubsidies
    .map(s => s._nc_m2m_Subsidies_SubsidyQuestions.filter(q => q.SubsidyQuestions).map(q => ({
      'ID': q.SubsidyQuestions.Id,
      'Foerderung': s.Name,
      'Frage': q.SubsidyQuestions.Question,
      'Hilfestellung': q.SubsidyQuestions.InfoText,
    })))
    .flat()

  const csv = await converter.json2csv(Object.entries(data), {});
  fs.writeFileSync('./new_questions.csv', csv)
}

run()