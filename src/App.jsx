import React, { useEffect } from 'react'
import Router from '@/navigation/Router'
import ErrorBoundary from '@/components/common/ErrorBoundary.jsx'
import { useAppStore } from '@/store/appStore'
import { onUserAuthStateChanged, getUserProfile } from '@/services/userAuthService'

export default function App() {
  const { setUser, setUserProfile, clearUserData } = useAppStore()

  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged(async (user) => {
      if (user) {
        // Kullanıcı giriş yapmış
        setUser(user)
        
        // Firestore'dan kullanıcı profilini getir
        const profile = await getUserProfile(user.uid)
        if (profile) {
          setUserProfile(profile)
        }
      } else {
        // Kullanıcı çıkış yapmış
        clearUserData()
      }
    })

    return () => unsubscribe()
  }, [setUser, setUserProfile, clearUserData])

  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  )
}