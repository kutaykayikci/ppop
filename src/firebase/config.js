import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3v0ebnm6HMJTM84vY8IVrSkmfXpZxDw0",
  authDomain: "poopcount-1a556.firebaseapp.com",
  projectId: "poopcount-1a556",
  storageBucket: "poopcount-1a556.firebasestorage.app",
  messagingSenderId: "644753590566",
  appId: "1:644753590566:web:311b83690ceaaa2c9919e7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
