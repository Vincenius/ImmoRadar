import { immonetCrawler } from "./immonet.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { immoweltCrawler } from "./immowelt.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";

import { wgGesuchtCrawler } from "./wg-gesucht.js";

// await immonetCrawler();
// await immobilienscoutCrawler();
// await immoweltCrawler()
await kleinanzeigenCrawler()