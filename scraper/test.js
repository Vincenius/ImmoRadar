import { MongoClient } from 'mongodb';
import axios from 'axios';
import 'dotenv/config'
import { splitIntoBatches } from './src/utils/utils.js'

const run = async () => {
  const client = new MongoClient('mongodb://vincenius:6fc07b5d3d824f4d9f22284f9b959320@82.165.133.109:27017/?authSource=admin');

  try {
    await client.connect();
    const db = client.db('prod');
    const collection = db.collection('estates');
  
    // delete all immoscout entries
    // immobilienscout24.de, immowelt.de, (kleinanzeigen.de -> 20 batch), ohne-makler.net, wg-gesucht.de -> GET
    // https://chatgpt.com/c/6751f7b4-d618-8007-9132-9b9808e95f5b
    const result = await collection.find({ provider: 'immobilienscout24.de' }).limit(1000).toArray();
    client.close();
    
    const uris = result.map(r => r.url)
    const errors = []

    // const response = await axios.head(uris[0], {
    //   proxy: {
    //     protocol: 'http',
    //     host: '87.106.235.175',
    //     port: 3128,
    //     auth: {
    //       username: process.env.PROXY_USERNAME_1,
    //       password: process.env.PROXY_PASSWORD_1
    //     }
    //   },
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    //   }
    // });
    // console.log(response)

    // console.log(result[0].url)
    // const res = await fetch(result[0].url, { method: 'GET', headers: {
    //   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    //   'Accept-Language': 'en-US,en;q=0.9',
    // } }).catch(err => console.log('err',err))
    // console.log(res.status)
    
    // const start = performance.now();

    // const batches = splitIntoBatches(uris, 50)
    // let i = 1;

    // for (const batch of batches) {
    //   console.log(`running batch`, i, 'of', batches.length)
    //   i++;
    //   const batchResult = await Promise.allSettled(batch.map(async uri => {
    //     const res = await fetch(uri, { method: 'HEAD' })
    //     return { uri, status: res.status }
    //   }))
      
    //   for (const res of batchResult) {
    //     if (res.value.status !== 200) {
    //       errors.push({ uri: res.value.uri, status: res.value.status })
    //     }
    //   }
    // }

    // console.log(errors, errors.length)

    // const end = performance.now();
    // const executionTime = (end - start) / 1000;  // Convert to seconds
    // console.log(`Execution time: ${executionTime} seconds`);
  } catch (e) {
    console.error(e)
  } finally {
    // client.close();
  }
}

run()
