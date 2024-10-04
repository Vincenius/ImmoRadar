import 'dotenv/config'
import * as Sentry from '@sentry/node';
import cron from 'node-cron';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import getTemplate from './templates/notification.js'
import { sendEmail } from './utils/emails.js'

if (process.env.GLITCHTIP_URL) {
  console.log('Init Glitchtip', process.env.GLITCHTIP_URL)
  Sentry.init({ dsn: process.env.GLITCHTIP_URL });
}

const TEST_RUN = process.env.TEST_RUN === 'true'

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
  if (titleIncludes && titleIncludes.length > 0) {
      titleFilter['$and'] = titleIncludes.map(includeStr => ({
          title: { $regex: includeStr, $options: 'i' }
      }));
  }
  
  if (titleExcludes && titleExcludes.length > 0) {
      titleFilter['$nor'] = titleExcludes.map(excludeStr => ({
          title: { $regex: excludeStr, $options: 'i' }
      }));
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
    const emailCollection = db.collection('emails');
    const endOfToday = new Date();
    const startOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    startOfToday.setHours(0, 0, 0, 0);

    const subscriptions = await subscriptionCollection.find({
      confirmed: true,
      notifications: {
        $elemMatch: {
          active: true,
          next_send_date: { $lte: endOfToday }
        }
      }
    }).toArray();
  
    // filter notifications based on next_send_date
    const filteredSubs = subscriptions.map(sub => ({
      ...sub,
      notifications: sub.notifications.filter(notif =>
        notif.active &&
        notif.query &&
        new Date(notif.next_send_date) <= endOfToday
      )
    })).filter(sub => !TEST_RUN || sub.email === 'vincentwill@arcor.de');

    // loop through notifications
    for (const sub of filteredSubs) {
      const { email, notifications, token } = sub;

      const fetchLocations = notifications.map(notif => (!notif.manualInput && notif.query)).filter(Boolean)
      const locations = await locationCollection.find({ name: { $in: [...new Set(fetchLocations)] } }).toArray();

      const queries = notifications.map(notif => {
        const from = new Date();
        from.setDate(from.getDate() - notif.frequency);

        let query = {}
        if (notif.manualInput) {
          // zip code search
          if (/^\d{5}$/.test(notif.query)) {
            query = {
              $and: [
                { created_at: { $gte: from } },
                { 'address.zipCode': { $in: [notif.query] } },
                ...mapFilter(notif.filter),
              ]
            }
          } else {
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
        const emailToken = uuidv4();
        const count = result.totalCount;
        const templateHtml = getTemplate({ count, estates: result.results, token, emailToken });
        const subject = `ImmoRadar | ${count > 50 ? '50+' : count} neue Wohnungen gefunden!`

        await Promise.all([
          sendEmail({
            to: email,
            subject,
            html: templateHtml
          }),
          emailCollection.insertOne({
            email,
            created_at: new Date(),
            opened: false,
            token: emailToken,
          })
        ]);
      }

      const updatePromises = notifications.map(notif => {
        const nextSendDate = new Date(notif.next_send_date);
        nextSendDate.setDate(nextSendDate.getDate() + notif.frequency);

        return subscriptionCollection.updateOne(
          { email, "notifications.id": notif.id },
          { $set: { "notifications.$.next_send_date": nextSendDate } }
        );
      });

      await Promise.allSettled(updatePromises);
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

if (!TEST_RUN) {
  console.log('INIT CRON JOB')

  cron.schedule('0 10 * * *', () => {
    console.log(new Date().toISOString(), 'running notification job');
    notificationRunner();
  });
} else {
  notificationRunner();
}
