import 'dotenv/config'
import { immoweltCrawler } from "./immowelt.js";
import { immonetCrawler } from "./immonet.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";

await immoweltCrawler('NEW_SCAN') // OR 'NEW_SCAN' OR 'FULL_SCAN'
// await immonetCrawler();
// await immobilienscoutCrawler();
// await kleinanzeigenCrawler()