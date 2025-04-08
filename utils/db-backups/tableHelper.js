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

  for (const table of tables.flat()) {
    if (table.title === 'Subsidies') {
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

      let i = 0
      for (const d of data) {
        i++;
        // if (i === 1) {
        console.log('update', i, 'of', data.length)
        const res = await fetch(`${process.env.NOCODB_URI}/api/v2/tables/${table.id}/records`, {
          method: 'PATCH',
          headers: {
            'xc-token': process.env.NOCODB_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            Id: d.Id, FundingDetails: {
              "Altersgerechter Umbau": 0,
              "Batteriespeicher": 0,
              "Baubegleitung": 0,
              "Biomasse": 0,
              "Dämmung": 0,
              "Effizienzhaus": 0,
              "Einbruchschutz": 0,
              "Energieberatung": 0,
              "Erneuerbare Energien": 0,
              "Fenster / Haustür": 0,
              "Fernwärme": 0,
              "Heizungsoptimierung": 0,
              "Holzbau": 0,
              "Ladestation": 0,
              "Lüftung": 0,
              "Passivhaus": 0,
              "Photovoltaik": 0,
              "Smart Home": 0,
              "Solarthermie": 0,
              "Sonstige Heizungen": 0,
              "Sonstiges": 0,
              "Wärmepumpe": 0,
              "Wärmespeicher": 0
            }
          })
        }).then(res => res.json())
        // }
      }
    }
  }
}

main()