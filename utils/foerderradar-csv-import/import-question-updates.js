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
  // const data = await parseCsv()

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
  //       Question: d.Frage,
  //     })).then(res => res.json())
  //     if (result.error) {
  //       console.log(result.error, d.Id)
  //     }
  //   }
  // }
}

main()
