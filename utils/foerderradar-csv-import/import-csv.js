require('dotenv').config()
const csv = require('csvtojson')

const csvFilePath='./data/foerderradar.csv'

const allRegions = [
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen"
]

const districtToRegion = {
  'Kreisfreie Stadt Oldenburg (Oldb)': 'Niedersachsen',
  'Stadtkreis Stuttgart': 'Baden-Württemberg',
  'Kreisfreie Stadt Speyer': 'Rheinland-Pfalz',
  'Kreisfreie Stadt Düsseldorf': 'Nordrhein-Westfalen',
  'Kreisfreie Stadt Oberhausen': 'Nordrhein-Westfalen',
  'Kreisfreie Stadt Bonn': 'Nordrhein-Westfalen',
  'Kreisfreie Stadt Potsdam': 'Brandenburg',
  'Kreisfreie Stadt Frankfurt am Main': 'Hessen',
  'Kreisfreie Stadt Braunschweig': 'Niedersachsen',
  'Landkreis Altötting': 'Bayern',
  'Kreisfreie Stadt Dortmund': 'Nordrhein-Westfalen',
  'Kreisfreie Stadt Kiel': 'Schleswig-Holstein',
  'Ergolding': 'Bayern',
  'Kreisfreie Stadt München': 'Bayern',
  'Kreisfreie Stadt Bochum': 'Nordrhein-Westfalen',
  'Landkreis Region Hannover': 'Niedersachsen',
  'Stadtkreis Freiburg im Breisgau': 'Baden-Württemberg',
  'Kreisfreie Stadt Augsburg': 'Bayern',
  'Kreisfreie Stadt Leipzig': 'Sachsen',
  'Kreisfreie Stadt Mainz': 'Rheinland-Pfalz',
  'Stadtkreis Karlsruhe': 'Baden-Württemberg',
  'Kreisfreie Stadt Osnabrück': 'Niedersachsen',
  'Stadtkreis Ulm': 'Baden-Württemberg',
  'Landkreis Gießen': 'Hessen',
  'Kreis Herford': 'Nordrhein-Westfalen',
  'Mindelheim': 'Bayern',
  'Kreisfreie Stadt Münster': 'Nordrhein-Westfalen',
  'Unterhaching': 'Bayern',
  'Kreis Städteregion Aachen': 'Nordrhein-Westfalen'
};


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
    .then((jsonObj)=>{
      resolve(jsonObj)
    })
})

const formatString = (val) => (val === 'undefined') ? null : val

const main = async () => {
  const data = await parseCsv()
  const filteredData = data.filter(d =>
    d['Aktiv / Stop / Hold'] === 'a' &&
    d['Antragsberechtigt sind'].includes('Privatperson') &&
    d['Gebäudeart'].includes('Wohngebäude') &&
    d['Bestand / Neubau'] &&
    d['Typ']
  )

  const formattedData = filteredData.map(d => {
    const rawRegion = d['Gebiet'].trim()
    const region = rawRegion === 'Bund'
      ? 'Bundesweit'
      : (rawRegion === 'Bundesweit' || allRegions.includes(rawRegion))
        ? d['Gebiet'] : null
    const district = !region && rawRegion !== 'undefined'
      ? d['Gebiet'] : null

    return {
      // id: d['Interne ID'],
      fr_updated_at: new Date(d['last modified time']).toISOString(),
      Accumulation: formatString(d['Kumulierung'].replaceAll('\n', '')),
      Name: formatString(d['Förderprogramm'].replaceAll('\n', '')),
      ApplicationDeadline: formatString(d['Stichtag Antragstellung']),
      Website: formatString(d['Offizielle Seite']),
      Region: region || districtToRegion[district],
      District: district,
      MaxFundingRate: formatString(d['Maximale Förderrate und Förderhöhe']),
      BaseFundingRate: formatString(d['Basis Förderrate']),
      Type: d['Typ'].split(',').map(m => formatString(m.trim().replace('Vergütung', 'Zuschuss').replace('Steuer-erstattung', 'Zuschuss'))).join(','),
      Measures: d['Art der Maßnahme'].split(',').map(m => formatString(m.trim())).filter(Boolean).join(','),
      Requirements: formatString(d['Voraussetzungen']),
      HouseType: d['Bestand / Neubau'].split(',').map(m => formatString(m.trim())).join(','),
    }
  })

  // const url = `${process.env.NOCODB_URI}/api/v2/tables/mnc1qd2t096094t/records`
  // const options = getOptions(formattedData)
  // const newSubstidies = await fetch(url, options).then(res => res.json())

  // console.log(newSubstidies)
}

main()

// todo clean db