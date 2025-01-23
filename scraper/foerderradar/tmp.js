const fs = require('fs');
let converter = require('json-2-csv');
const { chromium } = require('playwright');

const cities = [
  'München',
  'Köln',
  'Berlin',
]

const main = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (const city of cities) {
    await page.goto(`https://www.bundes-telefonbuch.de/suche?what=it&where=${encodeURI(city)}&whereLat=&whereLng=`);
    page.waitForTimeout(1000) // wait for page to load

    for (let i = 0; i < 300; i++) { // scroll to bottom
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(10);
    }

    const data = await page.evaluate(() => {
      const results = [];
      const contentSections = document.querySelectorAll('.companyBox');
      
      contentSections.forEach(section => {
        const result = {};
        
        const nameElement = section.querySelector('.panel-title');
        result.Name = nameElement ? nameElement.textContent.trim() : 'N/A';

        const phoneElement = section.querySelector('.detail-phone a');
        result.Telefonnummer = phoneElement ? phoneElement.textContent.trim() : 'N/A';

        const emailElement = section.querySelector('.detail-email');
        result.Email = emailElement ? emailElement.textContent.trim() : 'N/A';

        const homepageElement = section.querySelector('.detail-homepage');
        result.Homepage = homepageElement ? homepageElement.href.trim() : 'N/A';

        results.push(result);
      });

      return results;
    });

    console.log(city, 'scraped', data.length)

    const csv = await converter.json2csv(Object.entries(data), {});
    fs.writeFileSync(`./${city}-data.csv`, csv)

    await page.close();
  }
}

main()