require('dotenv').config()
const fs = require('fs');
let converter = require('json-2-csv');

const getOptions = () => ({
  method: 'GET',
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
})

const main = async () => {
  const url = `${process.env.NOCODB_URI}/api/v2/meta/bases/`
  const options = getOptions()
  const { list: bases } = await fetch(url, options).then(res => res.json())
  const tables = await Promise.all(bases.map(async base => {
    const url = `${process.env.NOCODB_URI}/api/v2/meta/bases/${base.id}/tables`
    const { list: tables } = await fetch(url, options).then(res => res.json())
    return tables.map(t => ({ ...t, base: base.title }))
  }))

  const allData = {}
  for (const table of tables.flat()) {
    if (table.title === 'Subsidies' || table.title === 'SubsidyQuestions') {
      let isLastPage = false
      let page = 0
      let maxTries = 0
      let data = []

      while (!isLastPage || maxTries > 10) {
        maxTries++ // prevent endless loop
        const res = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/${table.id}/records?limit=1000&offset=${page * 1000}`, options)
          .then(res => res.json())

        const { pageInfo, list } = res

        data = [...data, ...list]
        isLastPage = pageInfo.isLastPage
        page = page + 1
      }

      allData[table.title] = data
    }
  }

  let prevSubsidy = null
  const questions = allData.SubsidyQuestions.map(q => {
    const subsidy = allData.Subsidies.find(s => s.Id === q.Subsidies_id)

    if (subsidy.Type === 'Kredit') return null

    const addSubsidyInfo = subsidy.Id !== prevSubsidy
    if (addSubsidyInfo) {
      prevSubsidy = subsidy.Id
    }

    return {
      Id: q.Id,
      Foerderung: addSubsidyInfo ? subsidy.Name : '',
      Website: addSubsidyInfo ? subsidy.Website : '',
      Question: q.Question,
    }
  }).filter(Boolean)

  const csv = await converter.json2csv(Object.entries(questions), {});
  fs.writeFileSync('./export.csv', csv)

}

main()