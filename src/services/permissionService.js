import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc,
  doc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Kalıcı bildirim izni kaydet
export const saveNotificationPermission = async (userId, characterId, roomId, permission) => {
  try {
    // Mevcut izin kaydını kontrol et
    const existingPermission = await getNotificationPermission(userId);
    
    if (existingPermission) {
      // Mevcut izni güncelle
      const permissionRef = doc(db, 'notification_permissions', existingPermission.id);
      await updateDoc(permissionRef, {
        permission,
        characterId,
        roomId,
        updatedAt: serverTimestamp(),
        isActive: permission === 'granted'
      });
    } else {
      // Yeni izin kaydı oluştur
      const permissionRef = collection(db, 'notification_permissions');
      await addDoc(permissionRef, {
        userId,
        characterId,
        roomId,
        permission,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: permission === 'granted'
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Bildirim izni kaydetme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Kullanıcının bildirim izni durumunu getir
export const getNotificationPermission = async (userId) => {
  try {
    const permissionRef = collection(db, 'notification_permissions');
    const q = query(permissionRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    
    return null;
  } catch (error) {
    console.error('Bildirim izni getirme hatası:', error);
    return null;
  }
};

// Tüm bildirim izinlerini getir (Admin için)
export const getAllNotificationPermissions = async () => {
  try {
    const permissionRef = collection(db, 'notification_permissions');
    const snapshot = await getDocs(permissionRef);
    
    const permissions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // İstatistikleri hesapla
    const stats = {
      total: permissions.length,
      granted: permissions.filter(p => p.permission === 'granted').length,
      denied: permissions.filter(p => p.permission === 'denied').length,
      active: permissions.filter(p => p.isActive).length
    };

    return {
      permissions,
      stats
    };
  } catch (error) {
    console.error('Tüm bildirim izinleri getirme hatası:', error);
    return { permissions: [], stats: { total: 0, granted: 0, denied: 0, active: 0 } };
  }
};

// Room bazında bildirim izinlerini getir
export const getRoomNotificationPermissions = async (roomId) => {
  try {
    const permissionRef = collection(db, 'notification_permissions');
    const q = query(permissionRef, where('roomId', '==', roomId));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Room bildirim izinleri getirme hatası:', error);
    return [];
  }
};

// Bildirim izni kontrol et ve kalıcı kaydet
export const checkAndSaveNotificationPermission = async (userId, characterId, roomId) => {
  try {
    if (!('Notification' in window)) {
      await saveNotificationPermission(userId, characterId, roomId, 'unsupported');
      return { 
        success: false, 
        permission: 'unsupported',
        message: 'Bu tarayıcı bildirimleri desteklemiyor' 
      };
    }

    const currentPermission = Notification.permission;
    
    // İzni kalıcı olarak kaydet
    await saveNotificationPermission(userId, characterId, roomId, currentPermission);

    if (currentPermission === 'denied') {
      return { 
        success: false, 
        permission: 'denied',
        message: 'Bildirim izni reddedilmiş' 
      };
    }

    if (currentPermission === 'default') {
      // İzin iste
      const permission = await Notification.requestPermission();
      await saveNotificationPermission(userId, characterId, roomId, permission);
      
      if (permission !== 'granted') {
        return { 
          success: false, 
          permission,
          message: 'Bildirim izni verilmedi' 
        };
      }
    }

    return { 
      success: true, 
      permission: currentPermission,
      message: 'Bildirim izni aktif' 
    };
  } catch (error) {
    console.error('Bildirim izni kontrol hatası:', error);
    return { 
      success: false, 
      permission: 'error',
      error: error.message 
    };
  }
};

// Bildirim izni durumunu localStorage'a da kaydet (hızlı erişim için)
export const savePermissionToLocalStorage = (userId, permission) => {
  try {
    localStorage.setItem(`notification_permission_${userId}`, permission);
    localStorage.setItem('last_permission_check', Date.now().toString());
  } catch (error) {
    console.error('localStorage kaydetme hatası:', error);
  }
};

// localStorage'dan bildirim izni durumunu getir
export const getPermissionFromLocalStorage = (userId) => {
  try {
    return localStorage.getItem(`notification_permission_${userId}`);
  } catch (error) {
    console.error('localStorage okuma hatası:', error);
    return null;
  }
};

// Bildirim izni cache'ini temizle
export const clearPermissionCache = (userId) => {
  try {
    localStorage.removeItem(`notification_permission_${userId}`);
    localStorage.removeItem('last_permission_check');
  } catch (error) {
    console.error('localStorage temizleme hatası:', error);
  }
};
