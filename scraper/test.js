import { MongoClient } from 'mongodb';
import { splitIntoBatches } from './src/utils/utils.js'

const run = async () => {
  const client = new MongoClient('here');

  try {
    await client.connect();
    const db = client.db('prod');
    const collection = db.collection('estates');
  
    // delete all immoscout entries
    // immowelt.de, kleinanzeigen.de, ohne-makler.net, wg-gesucht.de
    const result = await collection.find({ provider: 'immowelt.de' }).limit(10).toArray();
    const uris = result.map(r => r.url)
    const errors = []

    console.log(result)
    
    const start = performance.now();

    const batches = splitIntoBatches(uris, 10)
    let i = 1;

    for (const batch of batches) {
      console.log(`running batch`, i, 'of', batches.length)
      i++;
      const batchResult = await Promise.allSettled(batch.map(async uri => {
        const res = await fetch(uri, { method: 'HEAD' })  
        return { uri, status: res.status }
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
    client.close();
  }
}

run()
