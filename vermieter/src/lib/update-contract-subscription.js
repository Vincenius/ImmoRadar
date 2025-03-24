import { ObjectId } from "mongodb";
import { createEstateFromContract } from "./create-estate";

export const updateContractAfterSubscription = async ({ userId, contractId, db }) => {
  const contractCollection = db.collection('contracts');
  const contract = await contractCollection.findOneAndUpdate(
    { _id: new ObjectId(contractId) },
    { $set: { user_id: userId, paid: true } },
    { returnDocument: 'after' }
  )

  console.log({ contract })

  if (contract) {
    const estateCollection = db.collection('estates');
    await createEstateFromContract({ contract, user_id: userId, collection: estateCollection })
  }
}