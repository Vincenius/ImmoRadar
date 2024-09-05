import cron from 'node-cron'
import 'dotenv/config'
import './utils/glitchtip.js'

import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";
import { inberlinwohnenCrawler } from './inberlinwohnen.js'

let isFullScanRunning = false;

const runScan = async (type) => {
  console.log('run various')
  await Promise.allSettled([
    immoweltCrawler(type),
    kleinanzeigenCrawler(type),
    wgGesuchtCrawler(type),
    inberlinwohnenCrawler()
  ])
  console.log('run immoscout crawler')
  await immobilienscoutCrawler(type)    
}

console.log('INIT CRON JOB')

cron.schedule('1,11,21,31,41,51 * * * *', () => {
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

// */5 * * * * -> run and check if it is every sixth hour -> NEW
// 0 */6 * * * -> FULL
// global variable to check if full scan is running
