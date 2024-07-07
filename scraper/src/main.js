import 'dotenv/config'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
// import { immonetCrawler } from "./immonet.js";

// Promise.allSettled

// 'NEW_SCAN' OR 'FULL_SCAN'
// await immoweltCrawler('NEW_SCAN')
// await immobilienscoutCrawler('NEW_SCAN');
await kleinanzeigenCrawler('FULL_SCAN')
// await immonetCrawler();
