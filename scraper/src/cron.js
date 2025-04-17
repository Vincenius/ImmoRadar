import cron from 'node-cron'
import 'dotenv/config'
import './utils/glitchtip.js'
import { splitIntoBatches } from './utils/utils.js'

import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";

let isFullScanRunning = false;

const runScan = async (type) => {
  const immoscoutScraper = immobilienscoutCrawler(type);
  const immoweltScraper = immoweltCrawler(type)
  const kleinanzeigenScraper = kleinanzeigenCrawler(type)

  const otherScraper = [
    ...immoweltScraper,
    ...kleinanzeigenScraper,
  ]

  const batches = splitIntoBatches(otherScraper, 4)
  for (const batch of batches) {
    try {
      await Promise.allSettled(batch.map(fn => fn()))
    } catch (error) {
        console.error("Batch Error:", error);
    }
  }

  const immoscoutBatches = splitIntoBatches(immoscoutScraper, 2) // reduce concurrency because firefox uses more cpu
  for (const batch of immoscoutBatches) {
    try {
      await Promise.allSettled(batch.map(fn => fn()))
    } catch (error) {
        console.error("Batch Error:", error);
    }
  }
}

console.log('INIT CRON JOB')

// cron.schedule('45 */6 * * *', () => {
//   if (!isFullScanRunning) {
//     console.log(new Date().toISOString(), 'running new scan');

//     runScan('NEW_SCAN').then(() => {
//       console.log(new Date().toISOString(), 'new scan finished');
//     })
//   } else {
//     console.log(new Date().toISOString(), 'skipping new scan because full scan is running');
//   }
// });

cron.schedule('0 9 * * *', () => {
  console.log(new Date().toISOString(), 'running full scan');
  isFullScanRunning = true;

  runScan('FULL_SCAN').then(() => {
    isFullScanRunning = false;
    console.log(new Date().toISOString(), 'full scan finished');
  })
});
