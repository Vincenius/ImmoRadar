import fs from 'fs'
import 'dotenv/config'
import { middleware } from './src/utils/middleware.js'

const tmp = fs.readFileSync('./tmp/wg-gesucht.json')
const data = JSON.parse(tmp)

const rawFeatures = data.map(d => d.rawFeatures).flat()

console.log(JSON.stringify([...new Set(rawFeatures)]))


// const run = async ({ page, collection }) => {
//     const result = await collection.aggregate([
//         { $unwind: "$features" },  // Unwind the "features" array
//         { $group: { _id: "$features" } },  // Group by the "features" array values
//         { $project: { _id: 0, feature: "$_id" } }  // Project the unique values into a field called "feature"
//     ]).toArray()

//     const result = await collection.updateMany(
//       { company: "Privater Nutzer" },
//       { $set: { company: "Privat" } }
//     )

//     console.log('Documents updated:', result);
// }

// const crawler = async () => {
//     await middleware(run, 'tmp');
// }

// crawler()


// [
//     "FIRST_TIME_USE",
//     "FITTED_KITCHEN",
//     "LOGGIA",
//     "PASSENGER_LIFT",
//     "SENIOR_FRIENDLY",
//     "BALCONY",
//     "PETS_ALLOWED",
//     "GARDEN_SHARED",
//     "FULLY_CELLARED",
//     "AIR_CONDITIONED",
//     "GROUND_FLOOR",
//     "CAR_PARK",
//     "PRIME_LOCATION",
//     "OLD_BUILDING",
//     "NEW_BUILDING",
//     "FLAT_SHARE_POSSIBLE",
//     "HERITAGE_PROTECTION_DEPRECIATION",
//     "COMPUTER_CABLING",
//     "BATH_WITH_TUB",
//     "WHEELCHAIR_ACCESSIBLE",
//     "GARDEN",
//     "FULLY_FURNISHED",
//     "FREIGHT_ELEVATOR",
//     "FULLY_RENOVATED",
//     "BATH_WITH_WINDOW",
//     "FULLY_DEVELOPED",
//     "TERRACE",
//     "PARTLY_FURNISHED",
//     "BASEMENT",
//     "CERTIFICATE_OF_ELIGIBILITY",
//     "NEW_BUILDING_PROJECT",
//     "CARPORT",
//     "ATTIC",
//     "GUEST_TOILET"
//   ]


