import { create } from 'zustand'

export const useAppStore = create((set, get) => ({
  // User auth state'leri
  user: null,
  isAuthenticated: false,
  userProfile: null,
  userRooms: [],
  currentRoom: null,
  
  // UI state'leri
  isLoading: false,
  error: null,
  
  // User actions
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),
  
  setUserProfile: (userProfile) => set({ 
    userProfile,
    error: null 
  }),
  
  setUserRooms: (userRooms) => set({ 
    userRooms,
    error: null 
  }),
  
  setCurrentRoom: (room) => set({ 
    currentRoom: room,
    error: null 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  // Çıkış yapınca temizle
  clearUserData: () => set({ 
    user: null, 
    isAuthenticated: false, 
    userProfile: null, 
    userRooms: [],
    currentRoom: null,
    error: null
  }),
  
  // Utility actions
  clearError: () => set({ error: null })
}))


