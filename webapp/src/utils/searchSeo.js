import { Text, Title } from '@mantine/core';

export const getSearchTitle = ({ q, filterQuery, count }) => {
  let title
  let details
  let description = `Alle verfügbaren Wohnungen in ${q}. Kein mühsames Durchsuchen mehrerer Webseiten. Eine gut sortierte Liste ohne Duplikate und sofortige Updates bei neuen Angeboten.`

  if (
    count > 1 &&
    q && filterQuery.input !== 'manual'
  ) {
    if (Object.keys(filterQuery).length === 0) {
      title = `Wohnungen in ${q} - Angebote von 10 Immobilienportalen`
      details = <>
        <Title order={2} size="h4" mb="md">Mietwohnung in {q} finden – Schnelle & einfache Wohnungssuche mit ImmoRadar</Title>
        <Text mb="md">Du bist auf der Suche nach einer Mietwohnung in {q}? Mit ImmoRadar findest du schnell und unkompliziert aktuelle Wohnungsangebote in {q}. Bei uns entdeckst du täglich neue Inserate für verschiedenste Wohnungsarten.</Text>
        <Text mb="md">Unsere Plattform durchsucht für dich die besten Immobilienseiten und präsentiert dir eine große Auswahl an Wohnungen zur Miete in {q}. Finde günstige Wohnungen, Altbauwohnungen oder moderne Neubauwohnungen in den verschiedenen Teilen von {q}.</Text>
        <Text mb="md">Mit unserer benutzerfreundlichen Wohnungssuche in {q} sparst du Zeit und findest garantiert die passende Wohnung. Jetzt mit ImmoRadar keine Mietwohnung mehr verpassen und schon bald in {q} wohnen!</Text>
      </>
    }

    if (Object.keys(filterQuery).length === 1) {
      if (filterQuery.features === 'CERTIFICATE_OF_ELIGIBILITY') {
        title = `WBS Wohnungen in ${q} - Günstige Sozialwohnungen mieten`
        description = `Alle verfügbaren WBS Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Sozialwohnungen mit Wohnberechtigungsschein von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">WBS Wohnungen in {q} finden – Günstige Sozialwohnungen mit ImmoRadar finden</Title>
          <Text mb="md">Du suchst eine Wohnung mit Wohnberechtigungsschein (WBS) in {q}? Mit ImmoRadar findest du schnell und unkompliziert aktuelle WBS-Wohnungsangebote in {q}. Unsere Plattform durchsucht die besten Immobilienseiten und präsentiert dir eine große Auswahl an günstigen Sozialwohnungen, die mit einem WBS angemietet werden können.</Text>
          <Text mb="md">Entdecke günstige WBS-Wohnungen in verschiedenen Teilen von {q} und spare dir Zeit bei der Suche. Mit unserer benutzerfreundlichen Suche findest du garantiert die passende Wohnung. Jetzt mit ImmoRadar Keine WBS-Wohnung mehr verpassen und schon bald in {q} wohnen!</Text>
        </>
      }
      if (filterQuery.titleIncludes === 'auf Zeit') {
        title = `Wohnen auf Zeit in ${q} - Wohnungen zur Zwischenmiete finden`
        description = `Alle verfügbaren Wohnungen zur Miete auf Zeit in ${q}. ImmoRadar kombiniert die Ergebnisse für Wohnungen zur Zwischenmiete von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">Wohnungen auf Zeit in {q} finden – Flexible Wohnlösungen mit ImmoRadar</Title>
          <Text mb="md">Du suchst eine Wohnung auf Zeit in {q}? Mit ImmoRadar findest du schnell und einfach aktuelle Angebote für temporäres Wohnen in {q}. Ob für einen kurzen beruflichen Aufenthalt oder einen Übergangszeitraum – wir haben die passenden Wohnungsangebote für dich.</Text>
          <Text mb="md">Unsere Plattform durchsucht für dich die besten Immobilienseiten und bietet dir eine große Auswahl an möblierten Wohnungen und Wohnungen auf Zeit in verschiedenen Teilen von {q}. Finde flexible Wohnlösungen mit ImmoRadar und spare dir Zeit bei der Suche!</Text>
        </>
      }
      if (filterQuery.features === 'GARDEN') {
        title = `Wohnungen mit Garten in ${q} mieten`
        description = `Alle verfügbaren Wohnungen mit Garten in ${q}. ImmoRadar kombiniert die Ergebnisse für Mietwohnungen mit Garten von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">Wohnungen mit Garten in {q} finden – Grün wohnen mit ImmoRadar</Title>
          <Text mb="md">Du träumst von einer Wohnung mit eigenem Garten in {q}? Mit ImmoRadar findest du schnell und unkompliziert aktuelle Wohnungsangebote mit Garten in {q}. Unsere Plattform durchsucht die besten Immobilienseiten und präsentiert dir eine Auswahl an Wohnungen mit grünem Außenbereich.</Text>
          <Text mb="md">Mit ImmoRadar findest du dein neues Zuhause im Grünen. Spare Zeit bei der Suche und entdecke jetzt die schönsten Wohnungen mit Garten in {q}!</Text>
        </>
      }
      if (filterQuery.features === 'NEW_BUILDING') {
        title = `Neubauwohnungen in ${q} - Angebote von 10 Immobilienportalen`
        description = `Alle verfügbaren Neubauwohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Neubauwohnungen zur Miete von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">Neubauwohnungen in {q} finden – Moderne Wohnräume auf ImmoRadar</Title>
          <Text mb="md">Du suchst eine moderne Neubauwohnung in {q}? Mit ImmoRadar findest du schnell und einfach aktuelle Angebote für Neubauwohnungen in {q}. Unsere Plattform durchsucht die besten Immobilienseiten und präsentiert dir eine Auswahl an top-modernen und energieeffizienten Neubauprojekten.</Text>
          <Text mb="md">Entdecke stilvolle und moderne Neubauwohnungen in verschiedenen Teilen von {q} und spare Zeit bei der Wohnungssuche. Finde deine Traumwohnung im Neubau mit ImmoRadar und verpasse kein Angebot mehr!</Text>
        </>
      }
      if (filterQuery.features === 'FLAT_SHARE_POSSIBLE') {
        title = `WG-geeignete Mietwohnungen in ${q}`
        description = `Alle WG-geeigneten Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Wohnungen zur Miete von 10 Immobilien-Webseiten die für Wohnungsgemeinschaften geeignet sind.`
        details = <>
          <Title order={2} size="h4" mb="md">WG-geeignete Wohnungen in {q} finden – Perfekte Lösungen für Wohnungsgemeinschaften mit ImmoRadar</Title>
          <Text mb="md">Du suchst eine WG-geeignete Wohnung in {q}? Mit ImmoRadar findest du schnell und einfach passende Wohnungen, die sich ideal für eine Wohngemeinschaft eignen. Unsere Plattform durchsucht die besten Immobilienseiten und zeigt dir eine große Auswahl an Mietwohnungen, die genug Platz für mehrere Mitbewohner bieten.</Text>
          <Text mb="md">Finde geräumige Wohnungen in {q}, die sich für eine WG eignen, mit gut geschnittenen Zimmern und einer zentralen Lage. Spare Zeit bei der Suche und entdecke jetzt die besten WG-geeigneten Wohnungen in {q} mit ImmoRadar!</Text>
        </>
      }
      if (filterQuery.features === 'BALCONY') {
        title = `Wohnungen mit Balkon in ${q}`
        description = `Alle Wohnungen mit Balkon in ${q}. ImmoRadar kombiniert die Ergebnisse für Wohnungen zur Miete mit Balkon von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">Wohnungen mit Balkon in {q} finden – Frische Luft und viel Platz mit ImmoRadar</Title>
          <Text mb="md">Du suchst eine Wohnung mit Balkon in {q}? Mit ImmoRadar findest du schnell und unkompliziert aktuelle Angebote für Wohnungen mit Balkon in {q}. Unsere Plattform durchsucht für dich die besten Immobilienseiten und zeigt dir eine große Auswahl an Mietwohnungen mit großzügigen Balkonen.</Text>
          <Text mb="md">Egal ob ein sonniger Balkon für deine Morgenkaffee oder ein geräumiger Balkon für gemütliche Abende – bei ImmoRadar findest du garantiert die passende Wohnung mit Balkon. Finde dein neues Zuhause mit Balkon und genieße frische Luft in {q}!</Text>
        </>
      }
      if (filterQuery.features === 'WHEELCHAIR_ACCESSIBLE') {
        title = `Behindertengerechte / Barrierefreie Mietwohnungen in ${q}`
        description = `Alle Barrierefreien Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für rollstuhlgerechte Mietwohnungen von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">Barrierefreie Wohnungen in {q} finden – Komfortables Wohnen mit ImmoRadar</Title>
          <Text mb="md">Du suchst eine barrierefreie Wohnung in {q}? Mit ImmoRadar findest du schnell und einfach Wohnungen, die speziell für barrierefreies Wohnen geeignet sind. Unsere Plattform durchsucht die besten Immobilienseiten und zeigt dir eine Auswahl an Wohnungen, die allen Anforderungen an Barrierefreiheit entsprechen.</Text>
          <Text mb="md">Finde barrierefreie Mietwohnungen in verschiedenen Teilen von {q} und profitiere von hohem Wohnkomfort und praktischen Einrichtungen. Verpasse mit ImmoRadar keine barrierefreie Wohnung mehr!</Text>
        </>
      }
      if (filterQuery.features === 'FULLY_FURNISHED') {
        title = `Möblierte Mietwohnungen in ${q}`
        description = `Alle möblierten Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für Mietwohnungen mit Möbeln von 10 Immobilien-Webseiten.`
        details = <>
          <Title order={2} size="h4" mb="md">Möblierte Wohnungen in {q} finden – Sofort einziehen mit ImmoRadar</Title>
          <Text mb="md">Du suchst eine möblierte Wohnung in {q}? Mit ImmoRadar findest du schnell und unkompliziert aktuelle Angebote für möblierte Wohnungen in {q}. Unsere Plattform durchsucht für dich die besten Immobilienseiten und präsentiert dir eine große Auswahl an voll möblierten Wohnungen zur Miete.</Text>
          <Text mb="md">Ob für einen kurzen Aufenthalt oder langfristig findest du bei ImmoRadar komfortable, möblierte Wohnungen in verschiedenen Teilen von {q}. Spare Zeit bei der Wohnungssuche und ziehe sofort in deine neue möblierte Wohnung in {q} ein!</Text>
        </>
      }
      if (filterQuery.minRooms === "6") {
        title = `6+ Zimmer Wohnungen in ${q}`
        description = `Alle Wohnungen mit Sechs oder mehr Räumen in ${q}. ImmoRadar kombiniert die Ergebnisse für günstige 6+ Raum Wohnungen zur Miete von 10 Immobilien-Webseiten.`
      }
    }

    if (Object.keys(filterQuery).length === 2 && filterQuery.minRooms && filterQuery.maxRooms && filterQuery.minRooms === filterQuery.maxRooms && parseInt(filterQuery.minRooms) <= 5) {
      title = `${filterQuery.minRooms} Zimmer Wohnungen in ${q} mieten`
      if (filterQuery.minRooms === 1) {
        description = `Alle Einzimmer Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für kompakte und günstige ${filterQuery.minRooms} Raum Wohnungen von 10 Immobilien-Webseiten.`
      } else if (filterQuery.minRooms > 1) {
        const rooms = {
          2: 'Zweizimmer',
          3: 'Dreizimmer',
          4: 'Vierzimmer',
          5: 'Fünfzimmer',
        }
        description = `Alle ${rooms[filterQuery.minRooms]} Wohnungen in ${q}. ImmoRadar kombiniert die Ergebnisse für ${filterQuery.minRooms} Raum Wohnungen von 10 Immobilien-Webseiten.`
      }
    }
  }

  return { title, description, details }
};

export const getDefaultTitle = (q) => {
  return `Wohnungen in ${q} - Angebote von 10 Immobilienportalen`
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
  label: `Möblierte Wohnungen in ${q}`,
  url: `/search?q=${q}&features=FULLY_FURNISHED`,
} ,{
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
  primary: {
    label: primary,
    url: ['Berlin', 'Hamburg', 'Bremen'].includes(primary) ? `/search?q=${encodeURI(primary)}` : null
  },
  secondary: secondary.map(s => ({ label: s, url: `/search?q=${encodeURI(s)}` })),
  showMoreLink: true,
}));