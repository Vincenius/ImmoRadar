import 'dotenv/config'
import { MongoClient } from 'mongodb';


const notificationRunner = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.MONGODB_DB);
    const subscriptionCollection = db.collection('subscriptions');
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

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
      notifications: sub.notifications.filter(notif => new Date(notif.next_send_date) <= endOfToday)
    }))

    console.log(filteredSubs);
    // loop through notifications
      // fetch data based on filter and query (+manualInput)
      // filter duplicates
      // construct and send if there are new elements email
      // update next_send_date

  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.close();
  }
}

notificationRunner();
