const headers = process.env.PROTECTION
  ? { 'Authorization': `Basic ${process.env.PROTECTION}` }
  : {}

export default headers