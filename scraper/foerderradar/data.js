const fs = require('fs');
let converter = require('json-2-csv');

function fixEncoding(input) {
  const fixes = {
    "â": "ß",
    "Ã": 'ß',
    'â¬': '€',
    '¬': '€',
    'Ã¤': 'ä',
    'Ã¼': 'ü',
    'Ã¶': 'ö',
    'â': '✅',
  }
  const fixText = (text) => {
    for (const [key, value] of Object.entries(fixes)) {
      text = text.replaceAll(key, value)
    }
    return text
  }

  const fixedEntry = {}
  for (const [key, value] of Object.entries(input)) {
    fixedEntry[fixText(key)] = fixText(value)
  }

  return fixedEntry;
}

const main = async () => {
  const files = fs.readdirSync('./rawData');
  const generalData = JSON.parse(fs.readFileSync('./data.json', 'utf-8'))

  const mappedRecords = generalData.map(d => d.records).flat()
  const mappedData = mappedRecords.map(d => ({ ...d.fields, id: d.id }))

  const allData = {}
  
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(`./rawData/${file}`, 'utf-8'));
    const record = data.data.records[0];
  
    if (allData[record.id]) {
      allData[record.id] = {
        ...allData[record.id],
        ...record.fields,
        
      }
    } else {
      allData[record.id] = record.fields
    }
  }

  for (const d of mappedData) {
    const allDataEntry = allData[d.id]
    for (let [key, value] of Object.entries(d)) {
      if (!allDataEntry[key]) {
        allDataEntry[key] = value
      }
    }
  }

  for (const [key, value] of Object.entries(allData)) {
    allData[key] = fixEncoding(value)
  }

  const csv = await converter.json2csv(Object.entries(allData), {});
  fs.writeFileSync('./data_full.csv', csv)
}

main()
