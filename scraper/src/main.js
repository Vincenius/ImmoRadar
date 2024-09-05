import 'dotenv/config'
import './utils/glitchtip.js'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { immonetCrawler } from "./immonet.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";
import { wohnungsboerseCrawler } from './wohnungsboerse.js'
import { inberlinwohnenCrawler } from './inberlinwohnen.js'


// const runScan = async (type) => {
//   console.log('run various')
//   await Promise.allSettled([
//     immoweltCrawler(type),
//     kleinanzeigenCrawler(type),
//     wgGesuchtCrawler(type),
//     inberlinwohnenCrawler()
//   ])
//   console.log('run immoscout crawler')
//   await immobilienscoutCrawler(type)    
// }

// await runScan('NEW_SCAN')

// 'NEW_SCAN' OR 'FULL_SCAN'
// await immobilienscoutCrawler('NEW_SCAN');
await immoweltCrawler('NEW_SCAN')
// await kleinanzeigenCrawler('NEW_SCAN')
// await wgGesuchtCrawler('NEW_SCAN')
// await inberlinwohnenCrawler()

// TODOs
// await immonetCrawler('FULL_SCAN');
// await wohnungsboerseCrawler('FULL_SCAN')

console.log('DONE')
