import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      await client.connect();
      const db = client.db(process.env.MONGODB_DB);
      const collection = db.collection('contracts');

      const {
        visited,
        rooms,
        rentals,
        contract,
        landlordName,
        landlordStreet,
        landlordCity,
        landlordZip,
        landlordRepresentedBy,
        tenantName,
        tenantStreet,
        tenantCity,
        tenantZip,
        street,
        city,
        zip,
        level,
        location,
        flatType,
        sharedAssets,
        rent,
        deposit,
        bankAccount,
        utilitiesType,
        heating,
        utilities,
        rentStart,
        visitedDate,
        enclosures,
        additionalRooms,
        additionalEnclosures,
        additionalRentals,
        rentSteps,
      } = req.body.userData

      const result = await collection.insertOne({
        visited,
        rooms,
        rentals,
        contract,
        landlordName,
        landlordStreet,
        landlordCity,
        landlordZip,
        landlordRepresentedBy,
        tenantName,
        tenantStreet,
        tenantCity,
        tenantZip,
        street,
        city,
        zip,
        level,
        location,
        flatType,
        sharedAssets,
        rent,
        deposit,
        bankAccount,
        utilitiesType,
        heating,
        utilities,
        rentStart,
        visitedDate,
        enclosures,
        additionalRooms,
        additionalEnclosures,
        additionalRentals,
        rentSteps,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
