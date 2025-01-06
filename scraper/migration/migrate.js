import { MongoClient } from 'mongodb';
import { parseFeatures } from '../src/utils/parseFeatures.js';

// todo migration remove without searchUrl

const run = async () => {
  const client = new MongoClient('here');
  await client.connect();
  const db = client.db('prod');
  const collection = db.collection('properties');

  // delete all immoscout entries
  const result = await collection.deleteMany({ provider: 'immobilienscout24.de' });
  console.log(result)

  client.close();
}

run()
