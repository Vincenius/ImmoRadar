const featureMap = [{
  feature: 'CERTIFICATE_OF_ELIGIBILITY',
  includes: ['wbs', 'wohnungsberechtigungsschein'],
  excludes: ['ohne wbs', 'ohne wohnungsberechtigungsschein', 'nicht wbs', 'nicht für wbs', 'kein wbs', 'keinen wbs']
}, {
  feature: 'FULLY_FURNISHED',
  includes: ['möbliert'],
  excludes: ['teilweise möbliert', 'teilmöbliert', 'unmöbliert']
}, {
  feature: 'BALCONY',
  includes: ['balkon'],
  excludes: ['kein balkon', 'ohne balkon']
}, {
  feature: 'FITTED_KITCHEN',
  includes: ['einbauküche'],
  excludes: ['keine einbauküche', 'ohne einbauküche']
}, {
  feature: 'BATH_WITH_TUB',
  includes: ['badewanne'],
  excludes: ['keine badewanne', 'ohne badewanne', 'statt badewanne']
}, {
  feature: 'WHEELCHAIR_ACCESSIBLE',
  includes: ['stufenloser zugang', 'behindertengerecht', 'rollstuhl', 'barrierefrei'],
  excludes: ['ohne stufenloser zugang', 'kein stufenloser zugang', 'keinen stufenloser zugang']
}, {
  feature: 'UNDERFLOOR_HEATING',
  includes: ['fußbodenheizung'],
  excludes: []
}, {
  feature: 'NEW_BUILDING',
  includes: ['neubau'],
  excludes: ['kein neubau']
}, {
  feature: 'PASSENGER_LIFT',
  includes: ['aufzug', 'fahrstuhl'],
  excludes: ['kein aufzug', 'ohne aufzug', 'keinen aufzug', 'aufzug nicht', 'kein fahrstuhl', 'ohne fahrstuhl', 'keinen fahrstuhl', 'fahrstuhl nicht']
}, {
  feature: 'CAR_PARK',
  includes: ['garage', 'stellplatz', 'parkplatz'],
  excludes: ['kein garage', 'ohne garage', 'keine garage', 'kein stellplatz', 'ohne stellplatz', 'kein stellplatz', 'keinen stellplatz']
}, {
  feature: 'GARDEN_SHARED',
  includes: ['garten mitnutzung', 'gartenanteil', 'gartenmitnutzung'],
  excludes: []
}, {
  feature: 'PETS_ALLOWED',
  includes: ['haustiere'],
  excludes: ['keine haustiere', 'ohne haustiere', 'haustiere nicht']
}, {
  feature: 'GUEST_TOILET',
  includes: ['gäste wc'],
  excludes: ['kein gäste wc', 'ohne gäste wc']
}, {
  feature: 'BASEMENT',
  includes: ['keller'],
  excludes: ['kein keller', 'ohne keller']
}, {
  feature: 'FLAT_SHARE_POSSIBLE',
  includes: ['wg'],
  excludes: ['keine wg', 'ohne wg']
}, {
  feature: 'OLD_BUILDING',
  includes: ['altbau'],
  excludes: []
}, {
  feature: 'TERRACE',
  includes: ['terrasse'],
  excludes: ['ohne terrasse', 'keine terrasse']
}, {
  feature: 'ATTIC',
  includes: ['dachboden'],
  excludes: ['ohne dachboden', 'kein dachboden']
}, {
  feature: 'GROUND_FLOOR',
  includes: ['erdgeschoss'],
  excludes: ['kein erdgeschoss']
}, {
  feature: 'BATH_WITH_WINDOW',
  includes: ['bad mit fenster', 'badezimmer mit fenster'],
  excludes: []
}, {
  feature: 'GARDEN',
  includes: [' garten'],
  excludes: ['ohne garten', 'kein garten', 'garten mitnutzung', 'gartenanteil', 'wintergarten', 'gartenmitnutzung', 'gartenstraße', 'botanisch', 'britzer', 'gartenhaus', 'gartenblick', 'gartenfeld']
}, {
  feature: 'FULLY_RENOVATED',
  includes: ['renoviert'],
  excludes: ['unrenoviert', 'nicht renoviert']
}, {
  feature: 'PARTLY_FURNISHED',
  includes: ['teilweise möbliert', 'teilmöbliert'],
  excludes: []
}, {
  feature: 'LOGGIA',
  includes: ['loggia'],
  excludes: []
}, {
  feature: 'FREIGHT_ELEVATOR',
  includes: ['lastenaufzug'],
  excludes: []
}, {
  feature: 'FIRST_TIME_USE',
  includes: ['erstbezug'],
  excludes: []
}, {
  feature: 'SENIOR_FRIENDLY',
  includes: ['senioren'],
  excludes: []
}, {
  feature: 'PARTLY_AIR_CONDITIONED',
  includes: ['klimatisiert', 'klimaanlage'],
  excludes: []
}]

export const parseFeatures = estate => {
  const features = [...estate.features]
  featureMap.forEach(({ feature, includes, excludes }) => {
    if (
      !estate.features.includes(feature) &&
      includes.some(i => estate.title.toLowerCase().includes(i)) &&
      !excludes.some(e => estate.title.toLowerCase().includes(e))
    ) {
      features.push(feature)
    }
  });

  return features
}