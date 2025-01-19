require('dotenv/config')
const fs = require('fs');
let converter = require('json-2-csv');
const { chromium } = require('playwright');

const main = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  page.on('response', async (response) => {
    const url = response.url();
    if (
      response.status() === 200 &&
      url.includes('https://www.foerderradar.de/v1/datasource/airtable/fedb77ca-a21b-40bc-a292-c9ef997e8094/2b9ed05c-57c6-4a8c-97d9-bf56a1997e71')
      && url.includes('/data/')
    ) {
      const responseBody = await response.json();
      const result = {
        url,
        data: responseBody
      }
      const fileName = url.replace('https://www.foerderradar.de/v1/datasource/airtable/', '').replaceAll('/', '-')

      fs.writeFileSync(`./rawData/${fileName}.json`, JSON.stringify(result));
    }
  });

  await page.goto('https://www.foerderradar.de/login');
  await page.waitForTimeout(2000);

  await page.click('button:has-text("Alle ablehnen")');
  await page.waitForTimeout(2000);

  await page.fill('input[type="email"]', process.env.EMAIL);
  await page.fill('input[type="password"]', process.env.PASSWORD);
  await page.click('button:has-text("Einloggen")');

  await page.waitForTimeout(5000);

  let hasLoadMore = true;
  let loadMoreIndex = 0;
  while (hasLoadMore) {
    loadMoreIndex++;
    await page.click('button:has-text("Mehr anzeigen")');
    await page.waitForTimeout(2500);
    hasLoadMore = await page.$('button:has-text("Mehr anzeigen")');
    console.log('load more', loadMoreIndex)
  }

  const elementCount = await page.$$eval('.css-1palze9', elements => elements.length);

  console.log('Element count:', elementCount);

  const elements = await page.$$('.css-1palze9'); // Get all elements with the class
  let elementIndex = 1;
  for (const element of elements) {
    const h2Text = await element.$eval('h2', h2 => {
      const h2Text = h2.textContent.trim(); // Get the h2 text and trim whitespace
      return h2Text // Check if the text is in the array of possible titles
    }).catch(() => false); // Catch errors (if h2 is not found) and return false

    const incomplete = [
      'Klimafreundliches Wohnen und Arbeiten - Bestandsgebäude: Lüftungsanlagen mit Wärmerückgewinnung',
      'Darlehensprogramm zur Finanzierung von Photovoltaikanlagen für Wohngebäude im Eigentum von privaten Bauherren und Eigentümern',
      'Erneuerbare Wärme - Fördermodul Wärmeverteilnetze',
      'KfW Wohngebäude – Energetische Fachplanungs-/ Baubegleitungsleistungen; Nachhaltigkeitszertifizierung (261)',
      'Bundesförderung für effiziente Wärmenetze (BEW)',
      'Erneuerbare Wärme - Fördermodul Solarthermie und Heizungsmodernisierung',
      'Modernisierung von Gebäuden von Wohnungseigentümergemeinschaften (WEG-Modernisierungsprogramm – BayModWEG) ',
      'Sportbund Rheinland: Sonderförderungen für Vereine und Fachverbände',
      'Heimat-Digital-Regional-Förderrichtlinie',
      'Energiesparprogramm: Förderung für energetische Sanierungen ',
      'Förderung von Ladeinfrastruktur für Elektrofahrzeuge in Sachsen-Anhalt (Richtlinie Ladeinfrastruktur) ',
      'Modernisierung von Mietwohnungen 1. Förderweg',
      'NRW.BANK: Gebäudesanierung',
      'Förderprogramm Klimaneutrale Gebäude (FKG) - Einzelmaßnahmen: Gebäudenetz und Anschluss an ein Gebäude- oder Wärmenetz ',
      'Erneuerbare Wärme - Fördermodul Wärmepumpen',
      'Förderung energieeffizienter und altersgerechter Wohnraummodernisierung (Sachsen-Anhalt MODERN) ',
      'progres.nrw - Emissionsarme Mobilität: Ladeinfrastruktur für Elektrofahrzeuge & Netzanschlüsse',
      'Klimafreundliches Wohnen und Arbeiten - Bestandsgebäude: Energieeffiziente Wohngebäude ',
      'Bundesförderung für effiziente Gebäude (BEG) – Einzelmaßnahme - Heizungsoptimierung zur Emissionsminderung - Nichtwohngebäude',
      'Frankfurter Programm zur Modernisierung des Wohnungsbestandes',
      'Friedrichshafen Klimaschutz bei Wohngebäuden',
      'Bayerische Förderrichtlinie Holz (BayFHolz) ',
      'Förderung der energetischen und stofflichen Nutzung nachwachsender Rohstoffe: Umsetzungskonzepte',
      'Klimaschutz für Bürgerinnen und Bürger – Förderung von stationären und nicht öffentlich zugänglichen Ladestationen',
      'IBB WEG-Finanzierung – Finanzierung von Maßnahmen am Gemeinschaftseigentum',
      'Wärmeschutz im Wohngebäudebestand',
      'Klimaschutz für Bürgerinnen und Bürger – Förderung nicht-fossiler Heizsysteme ',
      'Bayerisches Sonderprogramm Landwirtschaft Digital - Teil D',
      'Klimafreundliches Wohnen und Arbeiten - Technische Anlagen zur Nutzung der Solarenergie: Thermische Solaranlagen (bei Bestandsbauten)',
      'Ersatz von Elektroheizungen ',
      'progres.nrw - Klimaschutztechnik: Kalte Nahwärmenetze',
      'LEADER Nordrhein-Westfalen (2023-2027)  ',
      'Bundesförderung für effiziente Gebäude (BEG) – Einzelmaßnahme - Anlagen zur Wärmeerzeugung: Wärmenetzanschluss - Nichtwohngebäude (458)',
      'Brandenburg-Kredit Energieeffizienter Wohnungsbau',
      'LEADER Rheinland-Pfalz (2023-2027)  ',
      'Energieeffizientes Zuhause - Erneuerbare Energien: Photovoltaik',
      'progres.nrw - Klimaschutztechnik: Biomasseanlagen in Verbindung mit der Nutzung von Solarenergie',
      'IBB Energetische Gebäudesanierung ',
      'Bundesförderung für effiziente Gebäude (BEG) – Einzelmaßnahme - Anlagen zur Wärmeerzeugung: Biomasseheizungen - Nichtwohngebäude (458)',
      'IB.SH Immo Effizienzhaus',
      'progres.nrw - Klimaschutztechnik: Stationäre wasserstoffbasierte Energiesysteme in Verbindung mit einer PV-Anlage',
      'Ersatz von Ölheizkesseln',
      'LEADER Hessen (2023-2027)  ',
      'Förderprogramm Klimaneutrale Gebäude (FKG) - Einzelmaßnahmen: RLT-Anlagen mit Wärme-/Kälterückgewinnung',
      'Schallschutz (passiv) an Bundesfern- und Landesstraßen nach BImSchG Gewährung',
      'progres.nrw - Klimaschutztechnik: Wärme- und Kältespeicher',
      'Erneuerbare-Energien-Gesetz (EEG) - § 48 Solare Strahlungsenergie ',
      'Förderprogramm Klimaneutrale Gebäude (FKG) - Einzelmaßnahmen: Heizungsoptimierung',
      'progres.nrw - Klimaschutztechnik: Wohngebäude im Drei-Liter-Haus-Standard einschließlich Lüftungsanlagen',
      'progres.nrw - Klimaschutztechnik: Wohngebäude im Passivhaus-Standard einschließlich Lüftungsanlagen',
      'Erneuerbare Wärme - Fördermodul Bioenergieanlagen',
      'Förderung der energetischen und stofflichen Nutzung nachwachsender Rohstoffe: Nahwärmenetz',
      'Energieeffizientes Zuhause - Sanierung der Gebäudehülle: Fenster/Türen',
      'Energieeffizientes Zuhause - Sanierung der Gebäudehülle: Dämmung',
      'Klimaschutz-Plus: CO2 Minderungsprogramm'
    ]

    if (incomplete.includes(h2Text)) {
      try {
        console.log('click element', elementIndex)
        await element.click();
        await page.waitForTimeout(5000);
        await page.click('.sw-modal-close')
      } catch (error) {
        console.error('Error clicking element:', error);
      }
    } else {
      console.log('skip element', elementIndex)
    }
    elementIndex++;
  }

  // await browser.close();
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