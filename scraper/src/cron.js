import cron from 'node-cron'
import 'dotenv/config'
import './utils/glitchtip.js'
import { splitIntoBatches } from './utils/utils.js'

import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";
import { inberlinwohnenCrawler } from './inberlinwohnen.js'

let isFullScanRunning = false;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const runScan = async (type) => {
  const immoscoutScraper = immobilienscoutCrawler(type);
  const immoweltScraper = immoweltCrawler(type)
  const kleinanzeigenScraper = kleinanzeigenCrawler(type)
  const wgGesuchtScraper = wgGesuchtCrawler(type)
  const inBerlinWohnenScraper = inberlinwohnenCrawler()

  const allScraper = [
    ...immoscoutScraper,
    ...immoweltScraper,
    wgGesuchtScraper,
    inBerlinWohnenScraper,
    ...kleinanzeigenScraper,
  ]

  const batches = splitIntoBatches(allScraper, 4)
  for (const batch of batches) {
    try {
      await Promise.allSettled(batch.map(fn => fn()))
      await wait(2000)
    } catch (error) {
        console.error("Batch Error:", error);
    }
  }
}

console.log('INIT CRON JOB')

cron.schedule('5,15,25,35,45,55 * * * *', () => {
  if (!isFullScanRunning) {
    console.log(new Date().toISOString(), 'running new scan');

    runScan('NEW_SCAN').then(() => {
      console.log(new Date().toISOString(), 'new scan finished');
    })
  } else {
    console.log(new Date().toISOString(), 'skipping new scan because full scan is running');
  }
});

cron.schedule('0 */6 * * *', () => {
  console.log(new Date().toISOString(), 'running full scan');
  isFullScanRunning = true;

  runScan('FULL_SCAN').then(() => {
    isFullScanRunning = false;
    console.log(new Date().toISOString(), 'full scan finished');
  })
});
