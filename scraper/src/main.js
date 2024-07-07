import 'dotenv/config'
import './utils/glitchtip.js'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
// import { immonetCrawler } from "./immonet.js";

// 'NEW_SCAN' OR 'FULL_SCAN'
// await immoweltCrawler('NEW_SCAN')
// await immobilienscoutCrawler('NEW_SCAN');
await kleinanzeigenCrawler('NEW_SCAN')
// await immonetCrawler();
