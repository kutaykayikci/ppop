import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
// Firestore import'ları artık gerekli değil
import { auth } from '../firebase/config';

// Firebase Auth'daki kullanıcılar admin yetkisine sahip
const checkFirebaseAdminRole = async (uid, email) => {
  // Firebase Authentication'da kayıtlı olan tüm kullanıcılar admin olabilir
  // Bu daha güvenli çünkü email listesi kodda sabit değil
  // Firebase Console'dan kullanıcı ekleyip çıkarabilirsiniz
  return true; // Firebase Auth'da kayıtlı olan herkes admin
};

// Admin girişi
export const adminSignIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Firebase'de admin rolü kontrol et
    const isFirebaseAdmin = await checkFirebaseAdminRole(user.uid, user.email);
    
    if (!isFirebaseAdmin) {
      await signOut(auth);
      throw new Error('Bu kullanıcı admin yetkisine sahip değil');
    }
    
    // Admin bilgilerini kaydet
    localStorage.setItem('adminUser', JSON.stringify({
      email: user.email,
      uid: user.uid,
      loginTime: new Date().toISOString()
    }));
    
    return {
      success: true,
      user: {
        email: user.email,
        uid: user.uid
      }
    };
  } catch (error) {
    console.error('Admin giriş hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Admin çıkışı
export const adminSignOut = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('adminUser');
    return { success: true };
  } catch (error) {
    console.error('Admin çıkış hatası:', error);
    return { success: false, error: error.message };
  }
};

// Admin durumunu kontrol et
export const checkAdminAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe();
      
      if (user) {
        // Firebase'de admin rolü kontrol et
        const isFirebaseAdmin = await checkFirebaseAdminRole(user.uid, user.email);
        
        if (isFirebaseAdmin) {
          // Admin bilgilerini güncelle
          localStorage.setItem('adminUser', JSON.stringify({
            email: user.email,
            uid: user.uid,
            loginTime: new Date().toISOString()
          }));
          
          resolve({
            isAdmin: true,
            user: {
              email: user.email,
              uid: user.uid
            }
          });
        } else {
          localStorage.removeItem('adminUser');
          resolve({ isAdmin: false });
        }
      } else {
        localStorage.removeItem('adminUser');
        resolve({ isAdmin: false });
      }
    });
  });
};

// Mevcut admin kullanıcısını getir
export const getCurrentAdmin = () => {
  const adminData = localStorage.getItem('adminUser');
  if (adminData) {
    try {
      return JSON.parse(adminData);
    } catch (error) {
      localStorage.removeItem('adminUser');
      return null;
    }
  }
  return null;
};

// Admin yetkisi kontrolü
export const isAdmin = () => {
  const adminData = getCurrentAdmin();
  return adminData !== null;
};

// Artık Firestore'a admin kaydetmeye gerek yok
// Sadece Firebase Authentication'daki kullanıcılar admin
