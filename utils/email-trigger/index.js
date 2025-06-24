require('dotenv').config()
const fs = require('fs');

const getOptions = () => ({
  method: 'GET',
  headers: {
    'x-api-key': process.env.API_KEY,
    'Content-Type': 'application/json'
  },
})

const main = async () => {
  console.log('run cron', new Date().toISOString())
  await fetch(`${process.env.BASE_URL}/api/send-emails`, getOptions())
}

module.exports = main