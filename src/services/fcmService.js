import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getFCMToken, onMessageListener } from '../firebase/config';
import { checkNotificationPermission } from './notificationService';

// FCM Token'ı kaydet
export const saveFCMToken = async (userId, roomId, characterId) => {
  try {
    const token = await getFCMToken();
    
    if (!token) {
      throw new Error('FCM Token alınamadı');
    }

    // Mevcut token'ı kontrol et
    const existingToken = await getFCMTokenByUser(userId);
    
    if (existingToken) {
      // Mevcut token'ı güncelle
      await updateFCMToken(existingToken.id, token, roomId, characterId);
    } else {
      // Yeni token kaydet
      const tokenRef = collection(db, 'fcm_tokens');
      await addDoc(tokenRef, {
        userId,
        token,
        roomId,
        characterId,
        createdAt: new Date(),
        isActive: true
      });
    }

    return { success: true, token };
  } catch (error) {
    console.error('FCM Token kaydetme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Kullanıcının FCM Token'ını getir
export const getFCMTokenByUser = async (userId) => {
  try {
    const tokenRef = collection(db, 'fcm_tokens');
    const q = query(tokenRef, where('userId', '==', userId), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('FCM Token getirme hatası:', error);
    return null;
  }
};

// FCM Token'ı güncelle
export const updateFCMToken = async (tokenId, newToken, roomId, characterId) => {
  try {
    const tokenRef = doc(db, 'fcm_tokens', tokenId);
    await updateDoc(tokenRef, {
      token: newToken,
      roomId,
      characterId,
      updatedAt: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('FCM Token güncelleme hatası:', error);
    return { success: false, error: error.message };
  }
};

// FCM Token'ı sil
export const deleteFCMToken = async (userId) => {
  try {
    const token = await getFCMTokenByUser(userId);
    
    if (token) {
      await deleteDoc(doc(db, 'fcm_tokens', token.id));
    }
    
    return { success: true };
  } catch (error) {
    console.error('FCM Token silme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Oda kullanıcılarının token'larını getir
export const getRoomFCMTokens = async (roomId) => {
  try {
    const tokenRef = collection(db, 'fcm_tokens');
    const q = query(tokenRef, where('roomId', '==', roomId), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Oda FCM Token\'ları getirme hatası:', error);
    return [];
  }
};

// Tüm aktif token'ları getir
export const getAllActiveFCMTokens = async () => {
  try {
    const tokenRef = collection(db, 'fcm_tokens');
    const q = query(tokenRef, where('isActive', '==', true));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Tüm FCM Token\'ları getirme hatası:', error);
    return [];
  }
};

// Push notification izni kontrol et ve token al
export const initializePushNotifications = async (userId, roomId, characterId) => {
  try {
    // Notification izni kontrol et
    if (!('Notification' in window)) {
      console.warn('Bu tarayıcı notification desteklemiyor');
      return { success: false, error: 'Notification desteklenmiyor' };
    }

    if (Notification.permission === 'denied') {
      console.warn('Notification izni reddedildi');
      return { success: false, error: 'Notification izni reddedildi' };
    }

    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification izni verilmedi');
        return { success: false, error: 'Notification izni verilmedi' };
      }
    }

    // Service Worker kontrol et
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker desteklenmiyor');
      return { success: false, error: 'Service Worker desteklenmiyor' };
    }

    // Service Worker'ın hazır olmasını bekle
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker hazır:', registration);

    // FCM Token'ı kaydet
    const result = await saveFCMToken(userId, roomId, characterId);
    
    if (result.success) {
      console.log('FCM Token başarıyla kaydedildi');
      // Foreground mesajları dinle
      onMessageListener().then((payload) => {
        console.log('Foreground mesaj:', payload);
        // Burada custom notification gösterebilirsiniz
      });
    }

    return result;
  } catch (error) {
    console.error('Push notification başlatma hatası:', error);
    return { success: false, error: error.message };
  }
};

// Push notification durumunu kontrol et
export const checkPushNotificationStatus = () => {
  const status = {
    supported: 'Notification' in window,
    permission: Notification.permission,
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window
  };

  return status;
};
