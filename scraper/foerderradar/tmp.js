const fs = require('fs');
let converter = require('json-2-csv');
const { firefox } = require('playwright');

const cities = [
  'Koeln',
  // 'Berlin',
]

const main = async () => {
  const browser = await firefox.launch({ headless: false });
  const page = await browser.newPage();

  for (const city of cities) {
    await page.goto(`https://www.whofinance.de/berater-finden/finanzberater/${encodeURI(city)}/geldanlage/`);
    await page.waitForTimeout(2000)

    const pages = await page.evaluate(() => {
      return document.querySelectorAll('.page-item').length
    })

    const links = []
    for (let i = 1; i <= pages; i++) {
      await page.goto(`https://www.whofinance.de/berater-finden/finanzberater/${encodeURI(city)}/geldanlage/?page=${i}`)
      await page.waitForTimeout(2000)

      const newLinks = await page.evaluate(() => {
        const results = []
        document.querySelectorAll('.container-photo a').forEach(link => results.push(link.href))
        return results
      })
      links.push(newLinks)
    }

    const allLinks = links.flat()
    const allAdvisors = []

    for (const link of allLinks) {
      await page.goto(link)
      await page.waitForTimeout(2000)

      const advisor = await page.evaluate(() => {
        const name = document.querySelector('h1')?.textContent.trim()
        const office = document.querySelector('.wf-office-name')?.textContent.trim() 
        const rating = document.querySelector('.rating-text')?.textContent.trim().split(/\s+/).join(' ')
        const address = document.querySelector('.address-block')?.textContent.trim().split(/\s+/).join(' ')
        const info = document.querySelector('.berater-list')?.textContent.trim().split(/\s+/).join(' ')
        const phone = document.querySelector('#consultant-phone')?.href.replace('tel:', '')
        const mobile = document.querySelector('#consultant-mobile')?.href.replace('tel:', '')

        return {
          name,
          office,
          rating,
          address,
          info,
          phone,
          mobile
        }
      })

      allAdvisors.push(advisor)
    }

    console.log(allAdvisors)
    console.log(city, 'scraped', data.length)

    const csv = await converter.json2csv(Object.entries(allAdvisors), {});
    fs.writeFileSync(`./${city}-data.csv`, csv)
  }

  await page.close();
}

main()