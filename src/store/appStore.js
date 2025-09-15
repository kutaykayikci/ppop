import { create } from 'zustand'

export const useAppStore = create((set) => ({
  currentView: 'room-selector',
  room: null,
  characters: [],
  isWaiting: false,
  onboardingSeen: false,
  setView: (view) => set({ currentView: view }),
  setRoom: (room) => set({ room }),
  setCharacters: (characters) => set({ characters }),
  setIsWaiting: (isWaiting) => set({ isWaiting }),
  setOnboardingSeen: (seen) => set({ onboardingSeen: seen })
}))


