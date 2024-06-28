import 'dotenv/config'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immonetCrawler } from "./immonet.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";

// 'NEW_SCAN' OR 'FULL_SCAN'
// await immoweltCrawler('NEW_SCAN')
await kleinanzeigenCrawler('NEW_SCAN')
// await immonetCrawler();
// await immobilienscoutCrawler();