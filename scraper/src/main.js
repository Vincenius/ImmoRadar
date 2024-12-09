import 'dotenv/config'
import './utils/glitchtip.js'
import { splitIntoBatches } from './utils/utils.js'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";
import { inberlinwohnenCrawler } from './inberlinwohnen.js'
import { ohneMaklerCrawler } from './ohne-makler.js'
// import { wohnungsboerseCrawler } from './wohnungsboerse.js'

// 'NEW_SCAN' OR 'FULL_SCAN'
const immoscoutScraper = immobilienscoutCrawler('FULL_SCAN');
const immoweltScraper = immoweltCrawler('FULL_SCAN')
const kleinanzeigenScraper = kleinanzeigenCrawler('FULL_SCAN')
const wgGesuchtScraper = wgGesuchtCrawler('FULL_SCAN')
const inBerlinWohnenScraper = inberlinwohnenCrawler()
const ohneMaklerScraper = ohneMaklerCrawler('FULL_SCAN')

// TODOs
// await wohnungsboerseCrawler('FULL_SCAN')

const allScraper = [
  // ...immoscoutScraper,
  // ...immoweltScraper,
  // wgGesuchtScraper,
  inBerlinWohnenScraper,
  // ...kleinanzeigenScraper,
  // ...ohneMaklerScraper,
]

const batches = splitIntoBatches(allScraper, 4)
for (const batch of batches) {
  try {
    await Promise.allSettled(batch.map(fn => fn()))
  } catch (error) {
      console.error("Batch Error:", error);
  }
}

