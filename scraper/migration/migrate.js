import { MongoClient } from 'mongodb';
import { parseFeatures } from '../src/utils/parseFeatures.js';

// todo migration remove without searchUrl

const run = async () => {
  const client = new MongoClient('yoyo');
  await client.connect();
  const db = client.db('prod');
  const collection = db.collection('estates');

  // delete all immoscout entries
  const result = await collection.deleteMany({ provider: 'immowelt.de' });
  console.log(result)

  client.close();
}

run()
