import { MongoClient } from 'mongodb';
import 'dotenv/config'
import { splitIntoBatches } from './src/utils/utils.js'

const providers = [{
  name: 'immowelt.de',
}, {
  name: 'kleinanzeigen.de',
  options: { batch: 20 },
}, {
  name: 'ohne-makler.net',
}, {
  name: 'wg-gesucht',
  options: { reqType: 'GET' }
}]

const run = async () => {
  const client = new MongoClient('yoyo');

  try {
    await client.connect();
    const db = client.db('prod');
    const collection = db.collection('estates');
  
    // immowelt.de, immobilienscout24.de, (kleinanzeigen.de -> 20 batch), ohne-makler.net, wg-gesucht.de -> GET
    const result = await collection.find({ provider: 'immowelt.de' }).toArray();
    client.close();
    
    const uris = result.map(r => r.url)
    const errors = []
    
    const start = performance.now();

    const batches = splitIntoBatches(uris, 50)
    let i = 1;

    for (const batch of batches) {
      console.log(`running batch`, i, 'of', batches.length)
      i++;
      const batchResult = await Promise.allSettled(batch.map(async uri => {
        try {
          const res = await fetch(uri, { method: 'HEAD' })
          return { uri, status: res.status }
        }
        catch (error) {
          console.error(uri, error)
          return { uri, status: 500 }
        }
      }))
      
      for (const res of batchResult) {
        if (res.value.status !== 200) {
          errors.push({ uri: res.value.uri, status: res.value.status })
        }
      }
    }

    console.log(errors, errors.length)

    const end = performance.now();
    const executionTime = (end - start) / 1000;  // Convert to seconds
    console.log(`Execution time: ${executionTime} seconds`);
  } catch (e) {
    console.error(e)
  } finally {
    // client.close();
  }
}

run()
