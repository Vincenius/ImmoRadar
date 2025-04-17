import { create } from 'zustand'

const useTrackStore = create((set) => ({
  trackedEvents: {},
  addTrackedEvent: (name) => set((state) => ({ trackedEvents: { ...state.trackedEvents, [name]: true } })),
}))

export default function trackEvent(name) {
  const { trackedEvents, addTrackedEvent } = useTrackStore.getState()
  if (process.env.NEXT_PUBLIC_ANALYTICS_ID && window.umami && !trackedEvents[name]) {
    umami.track(name);
    addTrackedEvent(name)
  }
}