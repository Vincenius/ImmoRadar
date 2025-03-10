export const toWords = (zahl) => {
  let sonderzahlen = {
    11: 'elf',
    12: 'zwölf',
    16: 'sechzehn',
    17: 'siebzehn',
  };

  let zahlen = {
    1: 'eins',
    2: 'zwei',
    3: 'drei',
    4: 'vier',
    5: 'fünf',
    6: 'sechs',
    7: 'sieben',
    8: 'acht',
    9: 'neun',
    10: 'zehn',
    20: 'zwanzig',
    30: 'dreißig',
    40: 'vierzig',
    50: 'fünfzig',
    60: 'sechzig',
    70: 'siebzig',
    80: 'achtzig',
    90: 'neunzig',
  };

  let einheiten = ['', 'tausend', 'Million', 'Milliarde', 'Billion'];
  let trennschritte = 1000;
  let zahlinworten = '';

  if (zahl === 0) return 'null';

  // Split into integer and decimal parts
  let [integerPart, decimalPart] = zahl.toString().split('.');

  // Handle the integer part
  let blockCount = Math.ceil(integerPart.length / 3);

  for (let i = 0; i < blockCount; i++) {
    if (i > einheiten.length - 1) return 'Zahl nicht unterstützt';

    let zahlenblock;
    if (i === 0) {
      zahlenblock = integerPart % trennschritte;
    } else {
      zahlenblock = Math.floor((integerPart % trennschritte) / (trennschritte / 1000));
    }

    let einer = zahlenblock % 10;
    let zehn = zahlenblock % 100;
    let hunderter = Math.floor(zahlenblock / 100);

    let einheitenendung = einheiten[i].substr(-1);

    if (zahlenblock > 0) {
      if (zahlenblock > 1 && einheitenendung === 'n') {
        zahlinworten = ' ' + einheiten[i] + 'en ' + zahlinworten;
      } else if (zahlenblock > 1 && einheitenendung === 'e') {
        zahlinworten = ' ' + einheiten[i] + 'n ' + zahlinworten;
      } else if (zahlenblock > 0 && i === 1) {
        zahlinworten = einheiten[i] + zahlinworten;
      } else {
        zahlinworten = ' ' + einheiten[i] + ' ' + zahlinworten;
      }
    }

    if (zehn > 0) {
      if (sonderzahlen[zehn]) {
        zahlinworten = sonderzahlen[zehn] + zahlinworten;
      } else {
        if (zehn > 20) {
          if (einer > 0) zahlinworten = 'und' + zahlinworten;
          zahlinworten = zahlen[zehn - einer] + zahlinworten;
        }
        if (einer > 0) zahlinworten = zahlen[einer] + zahlinworten;
      }
    }

    if (hunderter > 0) {
      zahlinworten = zahlen[hunderter] + 'hundert' + zahlinworten;
    }

    trennschritte *= 1000;
  }

  if (decimalPart) {
    zahlinworten += ' Komma';
    for (let i = 0; i < decimalPart.length; i++) {
      zahlinworten += ' ' + zahlen[decimalPart[i]];
    }
  }

  return zahlinworten;
};
