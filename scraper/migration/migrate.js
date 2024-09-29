import { MongoClient } from 'mongodb';
import { parseFeatures } from '../src/utils/parseFeatures.js';

// todo migration remove without searchUrl

const run = async () => {
  const client = new MongoClient('mongodb://vincenius:6fc07b5d3d824f4d9f22284f9b959320@217.72.202.55:27017/?authSource=admin');
  await client.connect();
  const db = client.db('prod');
  const collection = db.collection('estates');

  // delete all immoscout entries
  const result = await collection.deleteMany({ provider: 'immobilienscout24.de' });
  console.log(result)

  client.close();
}

run()
