import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// Firebase messaging dinamik import ile kullanılacak (bundle diyet)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Zorunlu env kontrolleri
if (Object.values(firebaseConfig).some(v => !v)) {
  throw new Error('Missing Firebase environment variables. Please configure VITE_FIREBASE_* envs.')
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// VAPID Key - Firebase Console'dan alacaksınız
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY

// FCM Token al
export const getFCMToken = async () => {
  try {
    // Service Worker'ın hazır olduğundan emin ol
    if (!('serviceWorker' in navigator)) {
      console.error('Service Worker desteklenmiyor');
      return null;
    }

    // Service Worker registration'ı bekle
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker hazır:', registration);

    const { getMessaging, getToken } = await import('firebase/messaging')
    const messaging = getMessaging(app)
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });
    
    if (token) {
      console.log('FCM Token alındı:', token);
      return token;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('FCM Token alma hatası:', error);
    return null;
  }
};

// Foreground mesajları dinle
export const onMessageListener = () => {
  return new Promise((resolve) => {
    import('firebase/messaging').then(({ getMessaging, onMessage }) => {
      const messaging = getMessaging(app)
      onMessage(messaging, (payload) => {
        console.log('Foreground mesaj alındı:', payload);
        resolve(payload);
      });
    })
  });
};
