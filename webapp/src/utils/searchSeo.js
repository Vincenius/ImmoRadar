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