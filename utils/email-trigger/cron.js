const cron = require('node-cron')
const runEmail = require('./index.js')

cron.schedule('0 8 * * *', () => {
  console.log(new Date().toISOString(), 'running backup job');
  runEmail()
});

// run backup on start for testing
runEmail()