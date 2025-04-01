require('dotenv').config()
const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = './data/foerderradar2.csv'

const getOptions = body => ({
  method: 'POST',
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})

const parseCsv = () => new Promise((resolve, reject) => {
  csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
      resolve(jsonObj)
    })
})

const formatString = (val) => (val === 'undefined') ? null : val

const main = async () => {
  // const data = await parseCsv()

  // function extractQuestionsAndAnswers(text) {
  //   return text
  //     .split(/\d+\.\s+/) // get start of question
  //     .slice(1) // remove first part
  //     .map(qa => ({
  //       question: (qa.split('?')[0] + '?').replaceAll('**', '').trim(),
  //       answers: qa.split('✅')
  //         .slice(1) // remove everything before answers
  //         .map(a => a.replaceAll('\r','').replaceAll('\n', '').replace(/\d+/g, '').trim()).filter(Boolean)
  //         .map(a => {
  //           if (a !== 'Ja' && a !== 'Nein') {
  //             if (a.includes('Ja')) {
  //               return 'Ja'
  //             } else if (a.includes('Nein')) {
  //               return 'Nein'
  //             } else {
  //               console.log('fallback Ja ->', a)
  //               return 'Ja'
  //             }
  //           }
  //           return a
  //         })
  //     }))
  // }

  // const formattedData = data
  //   .filter(d => d.field22.trim())
  //   .map(d => {
  //     return {
  //       name: formatString(d['Förderprogramm'].replaceAll('\n', '')),
  //       questionsRaw: d.field22,
  //       questions: extractQuestionsAndAnswers(d.field22)
  //     }
  //   })

  const formattedData = JSON.parse(fs.readFileSync('./tmp.json', 'utf8')).map(q => ({ ...q, questions: q.questions.map(q => ({ ...q, answer: q.answers[0] })) }))

  const allSubsidies = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records?limit=1000`, {
    method: 'GET',
    headers: {
      'xc-token': process.env.NOCODB_KEY,
    },
  }).then(res => res.json())

  const merged = allSubsidies.list.map(sub => ({
    ...sub,
    Questions: formattedData.find(fd => fd.name === sub.Name)?.questions
  })).filter(a => a.Questions && a.Questions.length)

  let i = 0;
  // for (let sub of merged) {
  //   i++;
  //   // if (i === 1) {
  //   console.log(`[${i}] Subsidy: ${sub.Name}`)

  //   const qIds = []
  //   for (const question of sub.Questions) {
  //     const url = `${process.env.NOCODB_URI}/api/v2/tables/mhj8dvb0cf3wu6v/records`
  //     const options = getOptions({
  //       Question: question.question,
  //       RequiredAnswer: question.answer === 'Ja'
  //     })
  //     const result = await fetch(url, options).then(res => res.json())
  //     qIds.push(result)
  //   }

  //   const url = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/links/ck9eh3qfu1mgmgo/records/${sub.Id}`
  //   const options = getOptions(qIds)
  //   const test = await fetch(url, options).then(res => res.json())
  //   console.log(test)
  //   // }
  // }
}

main()
