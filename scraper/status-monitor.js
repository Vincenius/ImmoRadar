import { MongoClient } from 'mongodb';
import { splitIntoBatches } from './src/utils/utils.js'

const main = async () => {
  const client = new MongoClient('mongodb://vincenius:6fc07b5d3d824f4d9f22284f9b959320@82.165.133.109:27017/?authSource=admin'); // todo

  try {
    await client.connect();
    const db = client.db('prod');
    const collection = db.collection('estates');
  
    const result = await collection.find({ provider: 'wg-gesucht.de' }).toArray(); // kleinanzeigen.de
    console.log(result.length)
  
    // split result into batches
    // const batches = splitIntoBatches(result, 50)
  
    // let i = 0;
    // for (const batch of batches) {
    //   i++;
    //   console.log(`running batch`, i, 'of', batches.length)
    //   const urlResults = await Promise.allSettled(batch.map(async estate => {
    //     const res = await fetch(estate.url)
    //     return { url: estate.url, status: res.status }
    //   }))
    
    //   // delete 404 entries
    //   console.log(urlResults.map(r => r.value).filter(r => r.status !== 200))
    // }
  } catch (error) {
    console.error(error)
  } finally {
    client.close();
  }
}

main()