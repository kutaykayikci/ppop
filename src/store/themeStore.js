import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  themes: {
    poop: 'classic',
    costume: 'default',
    room: 'basic',
    counter: 'classic'
  },
  setTheme: (type, id) => set((state) => ({
    themes: { ...state.themes, [type]: id }
  })),
  hydrate: (themes) => set({ themes })
}))


