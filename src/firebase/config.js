import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB3v0ebnm6HMJTM84vY8IVrSkmfXpZxDw0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "poopcount-1a556.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "poopcount-1a556",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "poopcount-1a556.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "644753590566",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:644753590566:web:311b83690ceaaa2c9919e7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
