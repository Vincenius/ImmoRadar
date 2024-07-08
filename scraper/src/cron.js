import cron from 'node-cron'
import 'dotenv/config'
import './utils/glitchtip.js'

import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";

let isFullScanRunning = false;

// run sequential because of slow server -> can be changed on upgrades
const runScan = async (type) => {
  try {
    await immoweltCrawler(type);
  } catch (e) {
    console.error('immoweltCrawler', e);
  }

  try {
    await immobilienscoutCrawler(type)
  } catch (e) {
    console.error('immobilienscoutCrawler', e);
  }

  try {
    await kleinanzeigenCrawler(type);
  } catch (e) {
    console.error('kleinanzeigenCrawler', e);
  }
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

cron.schedule('0 */12 * * *', () => {
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
