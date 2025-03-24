export const createEstateFromContract = async ({ contract, user_id, collection }) => {
  const estate = {
    user_id,
    rooms: contract.rooms,
    rentals: contract.rentals,
    carportNumber: contract.carportNumber,
    street: contract.street,
    city: contract.city,
    zip: contract.zip,
    level: contract.level,
    location: contract.location,
    flatType: contract.flatType,
    sharedAssets: contract.sharedAssets,
    additionalRooms: contract.additionalRooms,
    additionalRentals: contract.additionalRentals,
  }

  await collection.insertOne(estate);
}