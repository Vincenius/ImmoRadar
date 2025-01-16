const fs = require('fs');
let converter = require('json-2-csv');

const main = async () => {
  const data = JSON.parse(fs.readFileSync('./tmp.json', 'utf-8'));

  const mappedRecords = data.map(d => d.records).flat()
  const mappedData = mappedRecords.map(d => d.fields)
  const filteredData = mappedData.map(d => ({
    'Name': d['SEO:Title'],
    'Status': d['Status'].trim() === '✅ Aktiv',
    'Maximale Förderrate und Förderhöhe': d['Maximale Förderrate und Förderhöhe'],
    'Antragsberechtigt sind': d['Antragsberechtigt sind'],
    'Beschreibung': d['SEO:Description'],
    'Typ': d['Typ'],
    'Bestand / Neubau': d['Bestand / Neubau'],
    'Förderprogramm': d['Förderprogramm'],
    'Fördergeber': d['Fördergeber (Geographisch)'],
    'Basis Förderrate': d['Basis Förderrate'],
    'Art der Maßnahme': d['Art der Maßnahme'],
    'Gebäudeart': d['Gebäudeart'],

  }))

  const csv = await converter.json2csv(filteredData, {});
  fs.writeFileSync('./tmp.csv', csv)
}

main()




// const keys = []
// mappedData.forEach(element => {
//   keys.push(Object.keys(element))
// });

// console.log([...new Set(keys.flat())])

// [
//   'Maximale Förderrate und Förderhöhe',
//   'Status',
//   'Antragsberechtigt sind',
//   'SEO:Description',
//   'Typ',
//   'Bestand / Neubau',
//   'SEO:Title',
//   'Bild-Doc (from Fördergeber_Link)',
//   'Fördergeber (Geographisch)',
//   'Basis Förderrate',
//   'SEO:index',
//   'Art der Maßnahme',
//   'Gebäudeart',
//   'Sektor',
//   'Förderprogramm',
//   'SEO:Slug',
//   'Bild-Doc (from FÃ¶rdergeber_Link)',
//   'FÃ¶rdergeber (Geographisch)',
//   'Basis FÃ¶rderrate',
//   'Art der MaÃ\x9Fnahme',
//   'GebÃ¤udeart',
//   'FÃ¶rderprogramm',
//   'Maximale FÃ¶rderrate und FÃ¶rderhÃ¶he'
// ]