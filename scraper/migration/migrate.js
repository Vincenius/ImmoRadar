import { MongoClient } from 'mongodb';
import { parseFeatures } from '../src/utils/parseFeatures.js';

const run = async () => {
  const client = new MongoClient('here');
  await client.connect();
  const db = client.db('prod');
  const collection = db.collection('estates');
  // const elements = await collection.find({ features: 'BARRIER_FREE' }).toArray();

  // const resultAdd = await collection.updateMany(
  //   { features: 'GARAGE' },
  //   {
  //     $addToSet: { features: 'CAR_PARK' }
  //   }
  // );

  // console.log(`${resultAdd.modifiedCount} documents updated successfully in the add operation`);

  // const resultPull = await collection.updateMany(
  //   { features: 'GARAGE' },
  //   {
  //     $pull: { features: 'GARAGE' }
  //   }
  // );

  // console.log(`${resultPull.modifiedCount} documents updated successfully in the pull operation`);


  // let updates = []
  // for (const element of elements) {
  //   const newFeatures = parseFeatures(element)

  //   if (element.features.length !== newFeatures.length) {
  //     updates.push({
  //       filter: { _id: element._id },
  //       update: { $set: { features: newFeatures } }
  //     });
  //   }
  // }

  // if (updates.length > 0) {
  //   const bulkOps = updates.map(update => ({
  //     updateOne: {
  //       filter: update.filter,
  //       update: update.update
  //     }
  //   }));

  //   await collection.bulkWrite(bulkOps);
  // }


  client.close();
}

run()
