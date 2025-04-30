import { create } from 'zustand'

const useDataStore = create((set) => ({
  dataStore: {},
  setDataStore: (newData) => set((state) => ({ dataStore: { ...state.dataStore, ...newData } })),
}))

export default useDataStore
