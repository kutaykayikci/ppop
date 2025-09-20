import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getFirebaseErrorMessage, logError } from '../utils/errorUtils';

// Kullanici kaydi
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Profil güncelle
    await updateProfile(user, { displayName });
    
    // Firestore'da kullanıcı profili oluştur
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            displayName,
            createdAt: new Date(),
            totalPoopCount: 0,
            joinedRooms: [],
            achievements: [],
            character: {
              gender: null,
              name: null,
              color: null,
              ready: false
            }
          });
    
    return { success: true, user };
  } catch (error) {
    logError(error, 'registerUser');
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

// Kullanici girisi  
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    logError(error, 'loginUser');
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

// Kullanici cikisi
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    logError(error, 'logoutUser');
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

// Kullanici durumu dinleyici
export const onUserAuthStateChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Kullanici profilini getir
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    return userDoc.exists() ? { id: uid, ...userDoc.data() } : null;
  } catch (error) {
    console.error('Profil getirme hatasi:', error);
    return null;
  }
};

// Kullanici profilini guncelle
export const updateUserProfile = async (uid, updates) => {
  try {
    await updateDoc(doc(db, 'users', uid), updates);
    return { success: true };
  } catch (error) {
    logError(error, 'updateUserProfile');
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

// Kullanici karakterini guncelle
export const updateUserCharacter = async (userId, characterData) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      character: characterData
    });
    return { success: true };
  } catch (error) {
    logError(error, 'updateUserCharacter');
    return { success: false, error: getFirebaseErrorMessage(error) };
  }
};

// Mevcut kullaniciyi getir
export const getCurrentUser = () => {
  return auth.currentUser;
};
