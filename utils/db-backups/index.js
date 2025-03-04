require('dotenv').config()
const fs = require('fs');

const getOptions = () => ({
  method: 'GET',
  headers: {
    'xc-token': process.env.NOCODB_KEY,
    'Content-Type': 'application/json'
  },
})

const main = async () => {
  const url = 'https://immoradar.xyz/api/v2/meta/bases/'
  const options = getOptions()
  const { list: bases } = await fetch(url, options).then(res => res.json())
  const tables = await Promise.all(bases.map(async base => {
    const url = `https://immoradar.xyz/api/v2/meta/bases/${base.id}/tables`
    const options = getOptions()
    const { list: tables } = await fetch(url, options).then(res => res.json())
    return tables.map(t => ({ ...t, base: base.title }))
  }))
  
  for (const table of tables.flat()) {
    const url = `https://immoradar.xyz/api/v2/tables/${table.id}/records?limit=1000`
    const options = getOptions()
    const { list } = await fetch(url, options).then(res => res.json())
    const data = JSON.stringify(list, null, 2)
    const date = new Date().toISOString().split('T')[0]
    const filename = `./backups/${date}_${table.base}_${table.title}.json`
    console.log('write', filename)
    fs.writeFileSync(filename, data)
  }

  const files = fs.readdirSync('./backups')
  for (const file of files) {
    const stats = fs.statSync(`./backups/${file}`)
    if (stats.mtime < new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      fs.unlinkSync(`./backups/${file}`)
      console.log('deleted', file)
    }
  }
}

module.exports = main