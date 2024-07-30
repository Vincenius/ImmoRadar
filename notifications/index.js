import 'dotenv/config'
import { MongoClient } from 'mongodb';
import getTemplate from './templates/notification.js'
import { sendEmail } from './utils/emails.js'

const mapFilter = ({ minPrice, maxPrice, minSize, maxSize, minRooms, maxRooms, featuresArray, titleIncludes, titleExcludes, providersArray }) => {
  // FILTER
  const priceFilter = {};
  if (minPrice && !isNaN(parseInt(minPrice))) {
      priceFilter['price.value'] = { $gte: parseInt(minPrice) };
  }
  if (maxPrice && !isNaN(parseInt(maxPrice))) {
      priceFilter['price.value'] = { ...priceFilter['price.value'], $lte: parseInt(maxPrice) };
  }

  const sizeFilter = {};
  if (minSize && !isNaN(parseInt(minSize))) {
      sizeFilter['livingSpace'] = { $gte: parseInt(minSize) };
  }
  if (maxSize && !isNaN(parseInt(maxSize))) {
      sizeFilter['livingSpace'] = { ...sizeFilter['livingSpace'], $lte: parseInt(maxSize) };
  }

  const roomsFilter = {};
  if (minRooms && !isNaN(parseInt(minRooms))) {
      roomsFilter['rooms'] = { $gte: parseInt(minRooms) };
  }
  if (maxRooms && !isNaN(parseInt(maxRooms))) {
      roomsFilter['rooms'] = { ...roomsFilter['rooms'], $lte: parseInt(maxRooms) };
  }

  // FEATURES FILTER
  const featuresFilter = {};
  if (featuresArray && Array.isArray(featuresArray)) {
      featuresFilter['features'] = { $all: featuresArray };
  }

  // TITLE FILTER
  const titleFilter = {};
  if (titleIncludes) {
      titleFilter['title'] = { $regex: titleIncludes, $options: 'i' };
  }
  if (titleExcludes) {
      titleFilter['title'] = { ...titleFilter['title'], $not: { $regex: titleExcludes, $options: 'i' } };
  }

  // PROVIDER FILTER
  const providerFilter = {};
  if (providersArray && Array.isArray(providersArray)) {
      providerFilter['provider'] = { $nin: providersArray };
  }

  return [priceFilter, sizeFilter, roomsFilter, featuresFilter, titleFilter, providerFilter]
    .filter(obj => Object.keys(obj).length > 0);
}

const filterDuplicateAggregation = [{
  $group: {
      _id: {
          title: "$title",
          price: "$price"
      },
      docs: { $push: "$$ROOT" }
  }},
  {
      $unwind: "$docs"
  },
  {
  $group: {
      _id: {
          title: "$_id.title",
          price: "$_id.price",
          provider: "$docs.provider"
      },
      doc: { $first: "$docs" }
  }
  },
  {
      $group: {
      _id: {
          title: "$_id.title",
          price: "$_id.price"
      },
      doc: { $first: "$doc" }
      }
  },
  {
      $replaceRoot: { newRoot: "$doc" }
  },
]

const notificationRunner = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const subscriptionCollection = db.collection('subscriptions');
    const collection = db.collection('estates');
    const locationCollection = db.collection('locations');
    const endOfToday = new Date();
    const startOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    startOfToday.setHours(0, 0, 0, 0);

    const subscriptions = await subscriptionCollection.find({
      confirmed: true,
      notifications: {
        $elemMatch: {
          active: true,
          next_send_date: { $lte: endOfToday, $gte: startOfToday }
        }
      }
    }).toArray();

    // filter notifications based on next_send_date
    const filteredSubs = subscriptions.map(sub => ({
      ...sub,
      notifications: sub.notifications.filter(notif =>
        notif.active &&
        notif.query &&
        new Date(notif.next_send_date) <= endOfToday &&
        new Date(notif.next_send_date) >= startOfToday
      )
    }))

    // loop through notifications
    for (const sub of filteredSubs) {
      const { email, notifications, token } = sub;
      // todo get all non-manual zip codes

      const fetchLocations = notifications.map(notif => (!notif.manualInput && notif.query)).filter(Boolean)
      const locations = await locationCollection.find({ name: { $in: [...new Set(fetchLocations)] } }).toArray();

      const queries = notifications.map(notif => {
        const from = new Date();
        from.setDate(from.getDate() - notif.frequency);

        let query = {}
        if (notif.manualInput) {
          query = {
            $and: [
              { created_at: { $gte: from } },
              { $or: [
                { 'address.city': { $regex: notif.query, $options: 'i' } },
                { 'address.district': { $regex: notif.query, $options: 'i' } }
              ] },
              ...mapFilter(notif.filter),
            ]
          }
        } else {
          const location = locations.find(loc => loc.name === notif.query);
          if (location) {
            query = {
              $and: [
                { created_at: { $gte: from } },
                { 'address.zipCode': { $in: location.zipCodes } },
                ...mapFilter(notif.filter),
              ]
            }
          }
        }

        return query
      }).filter(obj => Object.keys(obj).length > 0);

      const [result] = await collection.aggregate([
        { $match: { $or: queries } },
        ...filterDuplicateAggregation,
        {
            $facet: {
                results: [
                    { $sort: { created_at: -1 } },
                    { $limit: 100 }
                ],
                totalCount: [
                    { $count: "count" }
                ]
            }
        },
        {
            $project: {
                results: 1,
                totalCount: { $arrayElemAt: ["$totalCount.count", 0] }
            }
        }
      ]).toArray()

      if (result.totalCount > 0 && result.results.length > 0) {
        const count = result.totalCount;
        const templateHtml = getTemplate({ count, estates: result.results, token });
        const subject = `ImmoRadar | ${count > 50 ? '50+' : count} neue Wohnungen gefunden!`

        sendEmail({
          to: email,
          subject,
          html: templateHtml
        })
        // TODO update next_send_date
      }
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

notificationRunner();
