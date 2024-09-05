import { MongoClient } from 'mongodb';
import { parseFeatures } from '../src/utils/parseFeatures.js';

// todo migration remove without searchUrl

const run = async () => {
  const client = new MongoClient('yoyo');
  await client.connect();
  const db = client.db('prod');
  const collection = db.collection('estates');

  // delete all immoscout entries
  await collection.deleteMany({ provider: 'immowelt.de', searchUrl: { $exists: false } });

  client.close();
}

run()
