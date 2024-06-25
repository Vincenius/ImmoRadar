import { immoweltCrawler } from "./immowelt.js";
import { immonetCrawler } from "./immonet.js";
import { immobilienscoutCrawler } from "./immobilienscout.js";
import { kleinanzeigenCrawler } from "./kleinanzeigen.js";

await immoweltCrawler()
// await immonetCrawler();
// await immobilienscoutCrawler();
// await kleinanzeigenCrawler()