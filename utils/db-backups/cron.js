const cron = require('node-cron')
const runBackup = require('./index.js')

cron.schedule('0 2 * * *', () => {
  console.log(new Date().toISOString(), 'running backup job');
  runBackup()
});

// run backup on start for testing
runBackup()