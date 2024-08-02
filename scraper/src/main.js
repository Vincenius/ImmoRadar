import 'dotenv/config'
import './utils/glitchtip.js'
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { immonetCrawler } from "./immonet.js";
import { wgGesuchtCrawler } from "./wg-gesucht.js";

// 'NEW_SCAN' OR 'FULL_SCAN'
// await immoweltCrawler('FULL_SCAN')
// await immobilienscoutCrawler('NEW_SCAN');
// await kleinanzeigenCrawler('NEW_SCAN')
await wgGesuchtCrawler('FULL_SCAN')

// TODOs
// await immonetCrawler('FULL_SCAN');

