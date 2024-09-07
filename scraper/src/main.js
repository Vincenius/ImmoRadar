import 'dotenv/config'
import './utils/glitchtip.js'
import { splitIntoBatches } from './utils/utils.js'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { immonetCrawler } from "./immonet.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";
import { wohnungsboerseCrawler } from './wohnungsboerse.js'
import { inberlinwohnenCrawler } from './inberlinwohnen.js'

// 'NEW_SCAN' OR 'FULL_SCAN'
const immoscoutScraper = immobilienscoutCrawler('NEW_SCAN');
const immoweltScraper = immoweltCrawler('NEW_SCAN')
const kleinanzeigenScraper = kleinanzeigenCrawler('NEW_SCAN')
const wgGesuchtScraper = wgGesuchtCrawler('NEW_SCAN')
const inBerlinWohnenScraper = inberlinwohnenCrawler()

// TODOs
// await immonetCrawler('FULL_SCAN');
// await wohnungsboerseCrawler('FULL_SCAN')

const allScraper = [
  // ...immoscoutScraper,
  // ...immoweltScraper,
  // wgGesuchtScraper,
  inBerlinWohnenScraper,
    // ...kleinanzeigenScraper,
]

const batches = splitIntoBatches(allScraper, 5)
for (const batch of batches) {
  try {
    await Promise.allSettled(batch.map(fn => fn(type)))
  } catch (error) {
      console.error("Batch Error:", error);
  }
}

