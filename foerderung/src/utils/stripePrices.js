const devPrices = {
  'starter': 'price_1RPju3KQunG297XzcWcM9VJz',
  'premium': 'price_1RPjyAKQunG297XzPZzO1d6C',
  'premium_upgrade': 'price_1RPjyzKQunG297XzNkEXxG4r',
  'premium_plus': 'price_1RT1EtKQunG297XzxXn4Lrma',
  'premium_plus_upgrade_starter': 'price_1RT2NrKQunG297XzwJWOe8Cm',
  'premium_plus_upgrade_premium': 'price_1RT2QYKQunG297Xz4p8QI6Cv'
}

const prodPrices = {
  'starter': 'price_1Rt255KQunG297XzMR3If91U',
  'premium': 'price_1Rt25lKQunG297XzlhLmvz6O',
  'premium_upgrade': 'price_1Rt27HKQunG297XzO6M6eokH',
  'premium_plus': 'price_1Rt26SKQunG297Xz3rB2BmIv',
  'premium_plus_upgrade_starter': 'price_1RXQawKQunG297XzhWgDF3Nn',
  'premium_plus_upgrade_premium': 'price_1RXQawKQunG297XzhONtpdad'
}

export default process.env.STRIPE_SECRET_KEY.includes('live') ? prodPrices : devPrices