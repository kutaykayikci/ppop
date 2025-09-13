import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// FCM Messaging
export const messaging = getMessaging(app);

// VAPID Key - Firebase Console'dan alacaksınız
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

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
    onMessage(messaging, (payload) => {
      console.log('Foreground mesaj alındı:', payload);
      resolve(payload);
    });
  });
};
