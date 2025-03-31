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
  const data = await parseCsv()

  function extractQuestionsAndAnswers(text) {
    return text
      .split('. **') // get start of question
      .slice(1) // remove first part
      .map(qa => ({
        question: qa.split('?')[0] + '?',
        answers: qa.split('✅')
          .slice(1) // remove everything before answers
          .map(a => a.replaceAll('\r','').replaceAll('\n', '').replace(/\d+/g, '').trim()).filter(Boolean)
      }))
  }

  const formattedData = data
    .filter(d => d.field22.trim())
    .map(d => {
      return {
        name: formatString(d['Förderprogramm'].replaceAll('\n', '')),
        questionsRaw: d.field22,
        questions: extractQuestionsAndAnswers(d.field22)
      }
    })

  console.log(formattedData.filter(d => d.questions.some(q => q.answers.length > 1)).map(d => d.name))
  // fs.writeFileSync('./tmp.json', JSON.stringify(formattedData))
  // const url = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records`
  // const options = getOptions(formattedData)
  // const newSubstidies = await fetch(url, options).then(res => res.json())

  // console.log(newSubstidies)
}

main()

// todo clean db