import { MongoClient } from 'mongodb';
import { parseFeatures } from '../src/utils/parseFeatures.js';

// todo migration remove without searchUrl

const run = async () => {
  const client = new MongoClient('mongodb+srv://admin:lna5Cq5oRCspKze8@dev.7ndpuku.mongodb.net/?retryWrites=true&w=majority&appName=dev');
  await client.connect();
  const db = client.db('prod');
  const collection = db.collection('estates');

  // delete all immoscout entries
  await collection.deleteMany({ provider: 'immobilienscout24.de' });

  client.close();
}

run()
