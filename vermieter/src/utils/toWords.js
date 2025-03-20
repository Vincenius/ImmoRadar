export const toWords = (nummer) => {
  const zahlWorte = [
    'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn',
    'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn'
  ];

  const zehnerWorte = ['zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig'];
  const hunderterWorte = ['hundert', 'tausend'];

  function unterZwanzig(num) {
    return zahlWorte[num];
  }

  function unterHundert(num) {
    if (num < 20) return unterZwanzig(num);
    const einheit = num % 10;
    const zehner = Math.floor(num / 10);
    return (einheit ? zahlWorte[einheit] + 'und' : '') + zehnerWorte[zehner - 2];
  }

  function unterTausend(num) {
    const hunderter = Math.floor(num / 100);
    const rest = num % 100;
    const hunderterWort = hunderter ? zahlWorte[hunderter] + hunderterWorte[0] : '';
    return hunderterWort + (rest ? unterHundert(rest) : '');
  }

  function inWorten(num) {
    if (num < 1000) return unterTausend(num);
    const tausender = Math.floor(num / 1000);
    const rest = num % 1000;
    const tausenderWort = tausender ? unterTausend(tausender) + hunderterWorte[1] : '';
    return tausenderWort + (rest ? unterTausend(rest) : '');
  }

  function currencyToWords(zahl) {
    const [ganz, dezimal] = zahl.toFixed(2).split('.');  // Rundet auf 2 Dezimalstellen und trennt sie
    const ganzeZahlInWorten = inWorten(parseInt(ganz, 10));
    const dezimalInWorten = unterHundert(parseInt(dezimal, 10)); // Hier werden auch zweistellige Dezimalzahlen umgewandelt
    if (dezimal === '00') return ganzeZahlInWorten;
    return ganzeZahlInWorten + ' Komma ' + dezimalInWorten;
  }

  return currencyToWords(nummer);
}