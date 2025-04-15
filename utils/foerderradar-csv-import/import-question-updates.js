require('dotenv').config()
const csv = require('csvtojson')
const fs = require('fs')

const csvFilePath = './data/foerderradar3.csv'

const getOptions = (method, body) => ({
  method,
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

  // ----- update questions ----- //
  // for (let i = 0; i < data.length; i++) {
  //   console.log(`update ${i + 1}/${data.length}`)
  //   const d = data[i]

  //   if (d.Frage.trim() === '') {
  //     const url = `${process.env.NOCODB_URI}/api/v2/tables/mhj8dvb0cf3wu6v/records`
  //     const result = await fetch(url, getOptions('DELETE', { Id: d.ID })).then(res => res.json())
  //     if (result.error) {
  //       console.log(result.error, d.Id)
  //     }
  //   } else {
  //     const url = `${process.env.NOCODB_URI}/api/v2/tables/mhj8dvb0cf3wu6v/records`
  //     const result = await fetch(url, getOptions('PATCH', {
  //       Id: d.ID,
  //       InfoText: formatString(d.Hilfestellung),
  //       QuestionTmp: d.Frage,
  //     })).then(res => res.json())
  //     if (result.error) {
  //       console.log(result.error, d.Id)
  //     }
  //   }
  // }

  // ----- Copy Questions to QuestionsTmp ----- //
  // const allSubsidies = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records?limit=1000`, {
  //   method: 'GET',
  //   headers: {
  //     'xc-token': process.env.NOCODB_KEY,
  //   },
  // }).then(res => res.json())

  // let i = 0;
  // allSubsidies.list.forEach(async element => {
  //   i++;
  //   console.log(`update ${i + 1}/${allSubsidies.list.length}`, element.Id)
  //   const url = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/links/ck9eh3qfu1mgmgo/records/${element.Id}`
  //   const { list: result } = await fetch(url, getOptions('GET')).then(res => res.json())
  //   const url2 = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/links/c22h2roi2cpbwi6/records/${element.Id}`
  //   const result2 = await fetch(url2, getOptions('POST', result.map(r => ({ Id: r.Id })))).then(res => res.json())

  //   if (result2.error) {
  //     console.log(result.error, d.Id)
  //   }
  // });

  // ----- Handle duplicate questions ----- //
  // const questionMap = {}
  // for (let i = 0; i < data.length; i++) {
  //   const d = data[i]
  //   const question = d.Frage.trim()
  //   if (questionMap[question]) {
  //     questionMap[question].push(data[i])
  //   } else {
  //     questionMap[question] = [data[i]]
  //   }
  // }

  // let y = 0
  // for (const question in questionMap) {
  //   const records = questionMap[question]
  //   if (records.length > 1) {
  //     y++
  //     for (let i = 1; i < records.length; i++) {
  //       const d = records[i]
  //       console.log(d.ID, '->', records[0].ID)
  //       const url = `${process.env.NOCODB_URI}/api/v2/tables/mhj8dvb0cf3wu6v/links/crxwxudfzyrzzrc/records/${d.ID}`
  //       const result = await fetch(url, getOptions('GET')).then(res => res.json())

  //       const url2 = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/links/c22h2roi2cpbwi6/records/${result.Id}`
  //       const result2 = await fetch(url2, getOptions('POST', { Id: records[0].ID })).then(res => res.json())

  //       const url3 = `${process.env.NOCODB_URI}/api/v2/tables/mhj8dvb0cf3wu6v/records`
  //       const result3 = await fetch(url3, getOptions('DELETE', { Id: d.ID })).then(res => res.json())
  //       if (result3.error) {
  //         console.log(result.error, d.Id)
  //       }
  //     }
  //   }
  // }
}

main()
