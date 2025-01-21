const fs = require('fs');
let converter = require('json-2-csv');
const { chromium } = require('playwright');

const main = async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://www.bundes-telefonbuch.de/suche?what=it&where=k%C3%B6ln&whereLat=&whereLng=');
  console.log('wait for scroll...')
  await page.waitForTimeout(20000); // time for manual scrolling because I'm to lazy to code it

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

  console.log(data, data.length)

  const csv = await converter.json2csv(Object.entries(data), {});
  fs.writeFileSync('./data.csv', csv)
}

main()