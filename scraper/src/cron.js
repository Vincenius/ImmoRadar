import cron from 'node-cron'
import 'dotenv/config'
import './utils/glitchtip.js'
import { splitIntoBatches } from './utils/utils.js'

import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";
import { inberlinwohnenCrawler } from './inberlinwohnen.js'

// let isFullScanRunning = false;

const runScan = async (type) => {
  const immoscoutScraper = immobilienscoutCrawler('NEW_SCAN');
  const immoweltScraper = immoweltCrawler('NEW_SCAN')
  const kleinanzeigenScraper = kleinanzeigenCrawler('NEW_SCAN')
  const wgGesuchtScraper = wgGesuchtCrawler('NEW_SCAN')
  const inBerlinWohnenScraper = inberlinwohnenCrawler()

  const allScraper = [
    ...immoscoutScraper,
    ...immoweltScraper,
    wgGesuchtScraper,
    inBerlinWohnenScraper,
    ...kleinanzeigenScraper,
  ]

  const batches = splitIntoBatches(allScraper, 5)
  for (const batch of batches) {
    try {
      await Promise.allSettled(batch.map(fn => fn()))
    } catch (error) {
        console.error("Batch Error:", error);
    }
  }  
}

console.log('INIT CRON JOB')

cron.schedule('5,15,25,35,45,55 * * * *', () => {
  console.log(new Date().toISOString(), 'running new scan');

  runScan('NEW_SCAN').then(() => {
    console.log(new Date().toISOString(), 'new scan finished');
  })
  // if (!isFullScanRunning) {
    
  // } else {
  //   console.log(new Date().toISOString(), 'skipping new scan because full scan is running');
  // }
});

cron.schedule('0 */6 * * *', () => {
  console.log(new Date().toISOString(), 'running full scan');
  // isFullScanRunning = true;

  runScan('FULL_SCAN').then(() => {
    // isFullScanRunning = false;
    console.log(new Date().toISOString(), 'full scan finished');
  })
});

// */5 * * * *
