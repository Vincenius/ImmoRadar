require('dotenv').config()
const fs = require('fs')
let converter = require('json-2-csv');

const getOptions = (method, body) => ({
  method,
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(body)
})


const run = async () => {
  const { list: allSubsidies } = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records?limit=1000`, {
    method: 'GET',
    headers: {
      'xc-token': process.env.NOCODB_KEY,
    },
  }).then(res => res.json())

  const filteredSubsidies = allSubsidies.filter(s => s.FirstFinished && s.Done)

  let textResult = ''

  for (const subsidy of filteredSubsidies) {
    const { Id, Name, Guidance } = subsidy

    if (!Guidance) {
      continue
    }


    // const updatedText = Guidance.replace(/^###\s+Anleitung[^\n]*\n(?:\s*\n)*/i, '')

    // const url = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records`
    // const result = await fetch(url, getOptions('PATCH', {
    //   Id: Id,
    //   Guidance: updatedText
    // })).then(res => res.json())

    // console.log(result)

    textResult += `# ${Id} ${Name}\n\n${Guidance}\n\n`
  }

  fs.writeFileSync('./guidance.txt', textResult)
}

run()