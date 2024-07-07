import * as Sentry from '@sentry/node';

if (process.env.GLITCHTIP_URL) {
  console.log('Init Glitchtip', process.env.GLITCHTIP_URL)
  Sentry.init({ dsn: process.env.GLITCHTIP_URL });
}

