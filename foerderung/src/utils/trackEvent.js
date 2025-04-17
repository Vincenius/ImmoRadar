let trackedEvents = {} // prevent duplicate tracking -> todo improve by using global state https://github.com/pmndrs/zustand ???

export default function trackEvent(name) {
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID && window.umami && !trackedEvents[name]) {
    umami.track(name);
    trackedEvents[name] = true
  }
}