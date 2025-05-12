import { ObjectId } from "mongodb";
import { createEstateFromContract } from "./create-estate";

export const updateContractAfterSubscription = async ({ userId, contractId, db }) => {
  const contractCollection = db.collection('contracts');
  const userCollection = db.collection('users')
  const contract = await contractCollection.findOneAndUpdate(
    { _id: new ObjectId(contractId) },
    { $set: { user_id: userId, paid: true } },
    { returnDocument: 'after' }
  )

  if (contract) {
    const estateCollection = db.collection('estates');
    await createEstateFromContract({ contract, user_id: userId, collection: estateCollection })
    await userCollection.findOneAndUpdate(
      { _id: userId },
      { $set: {
        landlordName: contract.landlordName,
        landlordStreet: contract.landlordStreet,
        landlordCity: contract.landlordCity,
        landlordZip: contract.landlordZip,
        landlordRepresentedBy: contract.landlordRepresentedBy,
        bankAccount: contract.bankAccount
      } },
      { returnDocument: 'after' }
    )
  }
}