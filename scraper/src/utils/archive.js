import { MongoClient } from 'mongodb';

export const archiveEntries = async ({ collection, query }) => {
  const client = new MongoClient(process.env.ARCHIVE_URI);

  try {
    await client.connect();
    const db = client.db('prod');
    const archiveCollection = db.collection('estates');

    const entries = await collection.find(query).toArray();
    await archiveCollection.insertMany(entries.map(e => ({ ...e, deleted_at: new Date() })));
    await collection.deleteMany(query);
  } catch (error) {
    console.error('error on archiving', error)
  } finally {
    client.close();
  }
}