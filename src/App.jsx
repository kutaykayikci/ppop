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

  // PWA Install Banner Handler
  useEffect(() => {
    let deferredPrompt = null;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      deferredPrompt = e;
      // Store the event for later use
      window.deferredPrompt = e;
    };

    const handleAppInstalled = () => {
      // Clear the deferredPrompt so it can only be used once
      deferredPrompt = null;
      window.deferredPrompt = null;
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [])

  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  )
}