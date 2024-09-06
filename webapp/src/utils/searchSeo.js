export const getSearchTitle = ({ q, filterQuery, count }) => {
  let title
  let description = `Alle verfügbaren Wohnungen in ${q}. Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten.`

  if (
    count > 0 &&
    q && filterQuery.input !== 'manual'
  ) {
    if (Object.keys(filterQuery).length === 0) {
      title = `Wohnungen in ${q} - Angebote von 9 Immobilienportalen`
    }

    if (Object.keys(filterQuery).length === 1) {
      if (filterQuery.features === 'CERTIFICATE_OF_ELIGIBILITY') {
        title = `WBS Wohnungen in ${q} - Günstige Sozialwohnungen mieten`
        description = `Alle verfügbaren WBS Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Sozialwohnungen mit Wohnberechtigungsschein von 9 Immobilien-Webseiten.`
      }
      if (filterQuery.titleIncludes === 'auf Zeit') {
        title = `Wohnen auf Zeit in ${q} - Möblierte Wohnungen mieten`
        description = `Alle verfügbaren Wohnungen zur Miete auf Zeit in ${q}. ImmoRadar kombiniert die Ergebnisse für möblierte Wohnungen von 9 Immobilien-Webseiten.`
      }
      if (filterQuery.features === 'GARDEN') {
        title = `Wohnungen mit Garten in ${q} mieten`
        description = `Alle verfügbaren Wohnungen mit Garten in ${q}. ImmoRadar kombiniert die Ergebnisse für Mietwohnungen mit Garten von 9 Immobilien-Webseiten.`
      }
      if (filterQuery.features === 'NEW_BUILDING') {
        title = `Neubauwohnungen in ${q} - Angebote von 9 Immobilienportalen`
        description = `Alle verfügbaren Neubauwohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Neubauwohnungen zur Miete von 9 Immobilien-Webseiten.`
      }
      if (filterQuery.features === 'FLAT_SHARE_POSSIBLE') {
        title = `WG-geeignete Mietwohnungen in ${q}`
        description = `Alle WG-geeigneten Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Wohnungen von 9 Immobilien-Webseiten die für Wohnungsgemeinschaften geeignet sind.`
      }
      if (filterQuery.features === 'BALCONY') {
        title = `Wohnungen mit Balkon in ${q}`
        description = `Alle Wohnungen mit Balkon in ${q}. ImmoRadar kombiniert die Ergebnisse für Wohnungen mit Balkon von 9 Immobilien-Webseiten.`
      }
      if (filterQuery.features === 'WHEELCHAIR_ACCESSIBLE') {
        title = `Behindertengerechte / Barrierefreie Mietwohnungen in ${q}`
        description = `Alle Barrierefreien Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für rollstuhlgerechte Mietwohnungen von 9 Immobilien-Webseiten.`
      }
      if (filterQuery.minRooms === "6") {
        title = `6+ Zimmer Wohnungen in ${q}`
        description = `Alle Wohnungen mit Sechs oder mehr Räumen in ${q}. ImmoRadar kombiniert die Ergebnisse für kompakte und kostengünstige 6+ Raum Wohnungen von 9 Immobilien-Webseiten.`
      }
    }

    if (Object.keys(filterQuery).length === 2 && filterQuery.minRooms && filterQuery.maxRooms && filterQuery.minRooms === filterQuery.maxRooms && parseInt(filterQuery.minRooms) <= 5) {
      title = `${filterQuery.minRooms} Zimmer Wohnungen in ${q} mieten`
      if (filterQuery.minRooms === 1) {
        description = `Alle Einzimmer Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für kompakte und kostengünstige ${filterQuery.minRooms} Raum Wohnungen von 9 Immobilien-Webseiten.`
      } else if (filterQuery.minRooms > 1) {
        const rooms = {
          2: 'Zweizimmer',
          3: 'Dreizimmer',
          4: 'Vierzimmer',
          5: 'Fünfzimmer',
        }
        description = `Alle ${rooms[filterQuery.minRooms]} Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für ${filterQuery.minRooms} Raum Wohnungen von 9 Immobilien-Webseiten.`
      }
    }
  }

  return { title, description }
};

export const getDefaultTitle = (q) => {
  return `Wohnungen in ${q} - Angebote von 9 Immobilienportalen`
}

export const getSearchPages = q => [{
  label: `WBS Wohnungen in ${q}`,
  url: `/search?q=${q}&features=CERTIFICATE_OF_ELIGIBILITY`,
}, {
  label: `Wohnungen auf Zeit in ${q}`,
  url: `/search?q=${q}&titleIncludes=auf+Zeit`,
}, {
  label: `Wohnungen mit Garten in ${q}`,
  url: `/search?q=${q}&features=GARDEN`,
}, {
  label: `Neubauwohnungen in ${q}`,
  url: `/search?q=${q}&features=NEW_BUILDING`,
}, {
  label: `WG-geeignete Wohnungen in ${q}`,
  url: `/search?q=${q}&features=FLAT_SHARE_POSSIBLE`,
}, {
  label: `Wohnungen mit Balkon in ${q}`,
  url: `/search?q=${q}&features=BALCONY`,
}, {
  label: `Barrierefreie Wohnungen in ${q}`,
  url: `/search?q=${q}&features=WHEELCHAIR_ACCESSIBLE`,
}, {
  label: `1 Zimmer Wohnungen in ${q}`,
  url: `/search?q=${q}&minRooms=1&maxRooms=1`,
}, {
  label: `2 Zimmer Wohnungen in ${q}`,
  url: `/search?q=${q}&minRooms=2&maxRooms=2`,
}, {
  label: `3 Zimmer Wohnungen in ${q}`,
  url: `/search?q=${q}&minRooms=3&maxRooms=3`,
}, {
  label: `4 Zimmer Wohnungen in ${q}`,
  url: `/search?q=${q}&minRooms=4&maxRooms=4`,
}, {
  label: `5 Zimmer Wohnungen in ${q}`,
  url: `/search?q=${q}&minRooms=5&maxRooms=5`,
}, {
  label: `6+ Zimmer Wohnungen in ${q}`,
  url: `/search?q=${q}&minRooms=6`,
}].map(el => ({ primary: el }))

export const mainSearches = [
  {
    primary: "Baden-Württemberg",
    secondary: ["Stuttgart", "Mannheim", "Karlsruhe", "Freiburg im Breisgau", "Heidelberg"]
  },
  {
    primary: "Bayern",
    secondary: ["München", "Nürnberg", "Augsburg", "Regensburg", "Ingolstadt"]
  },
  {
    primary: "Berlin",
    secondary: ["Berlin-Pankow", "Berlin-Spandau", "Berlin-Mitte", "Berlin-Neukölln", "Berlin-Charlottenburg"]
  },
  {
    primary: "Brandenburg",
    secondary: ["Potsdam", "Cottbus", "Brandenburg an der Havel", "Frankfurt (Oder)", "Oranienburg"]
  },
  {
    primary: "Bremen",
    secondary: ["Bremen-Mitte", "Bremen-Neustadt", "Bremen-Walle", "Bremen-Hemelingen", "Bremen-Burglesum"]
  },
  {
    primary: "Hamburg",
    secondary: ["Hamburg-Wandsbek", "Hamburg-Mitte", "Hamburg-Altona", "Hamburg Eimsbüttel", "Hamburg-Nord"]
  },
  {
    primary: "Hessen",
    secondary: ["Frankfurt am Main", "Wiesbaden", "Kassel", "Darmstadt", "Offenbach am Main"]
  },
  {
    primary: "Mecklenburg-Vorpommern",
    secondary: ["Rostock", "Schwerin", "Neubrandenburg", "Stralsund", "Greifswald"]
  },
  {
    primary: "Niedersachsen",
    secondary: ["Hannover", "Braunschweig", "Oldenburg", "Osnabrück", "Wolfsburg"]
  },
  {
    primary: "Nordrhein-Westfalen",
    secondary: ["Köln", "Düsseldorf", "Dortmund", "Essen", "Duisburg"]
  },
  {
    primary: "Rheinland-Pfalz",
    secondary: ["Mainz", "Ludwigshafen am Rhein", "Koblenz", "Trier", "Kaiserslautern"]
  },
  {
    primary: "Saarland",
    secondary: ["Saarbrücken", "Neunkirchen", "Homburg", "Völklingen", "Sankt Ingbert"]
  },
  {
    primary: "Sachsen",
    secondary: ["Leipzig", "Dresden", "Chemnitz", "Zwickau", "Plauen"]
  },
  {
    primary: "Sachsen-Anhalt",
    secondary: ["Halle (Saale)", "Magdeburg", "Dessau-Roßlau", "Lutherstadt Wittenberg", "Stendal"]
  },
  {
    primary: "Schleswig-Holstein",
    secondary: ["Kiel", "Lübeck", "Flensburg", "Neumünster", "Norderstedt"]
  },
  {
    primary: "Thüringen",
    secondary: ["Erfurt", "Jena", "Gera", "Weimar", "Gotha"]
  }
].map(({ primary, secondary }) => ({
  primary: { label: primary },
  secondary: secondary.map(s => ({ label: s, url: `/search?q=${encodeURI(s)}` }))
}));