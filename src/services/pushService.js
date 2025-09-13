import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { sendPushNotification } from './notificationService';
import { getRoomFCMTokens, getAllActiveFCMTokens } from './fcmService';

// Firebase Cloud Messaging ile push gönder
const sendFCMNotification = async (tokens, payload) => {
  try {
    // Bu fonksiyon backend'de çalışacak
    // Frontend'den sadece Firestore'a push request kaydediyoruz
    const pushRequestRef = collection(db, 'push_requests');
    await addDoc(pushRequestRef, {
      tokens,
      payload,
      status: 'pending',
      createdAt: new Date()
    });

    return { success: true };
  } catch (error) {
    console.error('FCM push gönderme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Push bildirimini tüm kullanıcılara gönder
export const sendPushToAllUsers = async (pushData) => {
  try {
    // Tüm aktif FCM token'ları al
    const tokens = await getAllActiveFCMTokens();
    const tokenList = tokens.map(t => t.token);

    if (tokenList.length === 0) {
      return {
        success: false,
        error: 'Aktif FCM token bulunamadı'
      };
    }

    // FCM payload oluştur
    const fcmPayload = {
      notification: {
        title: pushData.title,
        body: pushData.body,
        icon: '/poop-emoji.svg'
      },
      data: {
        type: 'admin_push',
        pushId: pushData.id,
        targetType: 'all',
        click_action: '/'
      }
    };

    // FCM push gönder
    const result = await sendFCMNotification(tokenList, fcmPayload);

    if (result.success) {
      // Local notification da gönder (fallback)
      await sendPushNotification({
        title: pushData.title,
        body: pushData.body,
        icon: pushData.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHRleHQgeD0iMTYiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIj7wn5KpPC90ZXh0Pgo8L3N2Zz4K',
        type: 'admin_push'
      }, {
        pushId: pushData.id,
        targetType: 'all'
      });
    }

    return {
      success: result.success,
      message: result.success ? 'Push tüm kullanıcılara gönderildi' : result.error,
      sent: result.success,
      tokenCount: tokenList.length
    };
  } catch (error) {
    console.error('Tüm kullanıcılara push gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Belirli bir odaya push gönder
export const sendPushToRoom = async (roomId, pushData) => {
  try {
    // Oda kullanıcılarının FCM token'larını al
    const tokens = await getRoomFCMTokens(roomId);
    const tokenList = tokens.map(t => t.token);

    if (tokenList.length === 0) {
      return {
        success: false,
        error: `Oda ${roomId} için aktif FCM token bulunamadı`
      };
    }

    // FCM payload oluştur
    const fcmPayload = {
      notification: {
        title: pushData.title,
        body: pushData.body,
        icon: '/poop-emoji.svg'
      },
      data: {
        type: 'admin_push',
        pushId: pushData.id,
        targetType: 'room',
        targetId: roomId,
        click_action: '/'
      }
    };

    // FCM push gönder
    const result = await sendFCMNotification(tokenList, fcmPayload);

    if (result.success) {
      // Local notification da gönder (fallback)
      await sendPushNotification({
        title: pushData.title,
        body: pushData.body,
        icon: pushData.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHRleHQgeD0iMTYiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIj7wn5KpPC90ZXh0Pgo8L3N2Zz4K',
        type: 'admin_push'
      }, {
        pushId: pushData.id,
        targetType: 'room',
        targetId: roomId
      });
    }

    return {
      success: result.success,
      message: result.success ? `Push oda ${roomId} kullanıcılarına gönderildi` : result.error,
      sent: result.success,
      tokenCount: tokenList.length
    };
  } catch (error) {
    console.error('Oda kullanıcılarına push gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Belirli bir karaktere push gönder
export const sendPushToCharacter = async (characterId, pushData) => {
  try {
    // Karakter bilgilerini bul ve push gönder
    
    const result = await sendPushNotification({
      title: pushData.title,
      body: pushData.body,
      icon: pushData.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHRleHQgeD0iMTYiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIj7wn5KpPC90ZXh0Pgo8L3N2Zz4K',
      type: 'admin_push'
    }, {
      pushId: pushData.id,
      targetType: 'character',
      targetId: characterId
    });

    return {
      success: true,
      message: `Push karakter ${characterId} kullanıcısına gönderildi`,
      sent: true
    };
  } catch (error) {
    console.error('Karakter kullanıcısına push gönderme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Push bildirimini kaydet
export const savePushNotification = async (pushData) => {
  try {
    const pushRef = collection(db, 'admin_pushes');
    const docRef = await addDoc(pushRef, {
      ...pushData,
      createdAt: new Date(),
      id: null // Firestore otomatik ID verecek
    });
    
    // ID'yi güncelle
    await updateDoc(docRef, {
      id: docRef.id
    });
    
    return {
      success: true,
      id: docRef.id
    };
  } catch (error) {
    console.error('Push kaydetme hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Push geçmişini getir
export const getPushHistory = async () => {
  try {
    const pushRef = collection(db, 'admin_pushes');
    const q = query(pushRef, orderBy('sentAt', 'desc'), limit(50));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Push geçmişi getirme hatası:', error);
    return [];
  }
};

// Zamanlanmış push'ları kontrol et
export const checkScheduledPushes = async () => {
  try {
    const now = new Date();
    const pushRef = collection(db, 'admin_pushes');
    const q = query(
      pushRef,
      orderBy('scheduledTime'),
      limit(10)
    );
    const snapshot = await getDocs(q);
    
    const scheduledPushes = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(push => {
        const scheduledTime = new Date(push.scheduledTime);
        return scheduledTime <= now && push.status === 'scheduled';
      });
    
    // Zamanlanmış push'ları gönder
    for (const push of scheduledPushes) {
      let result;
      
      if (push.targetType === 'all') {
        result = await sendPushToAllUsers(push);
      } else if (push.targetType === 'room') {
        result = await sendPushToRoom(push.targetId, push);
      } else if (push.targetType === 'character') {
        result = await sendPushToCharacter(push.targetId, push);
      }
      
      if (result.success) {
        // Status'u güncelle
        await updateDoc(doc(db, 'admin_pushes', push.id), {
          status: 'sent',
          sentAt: new Date().toISOString()
        });
      }
    }
    
    return scheduledPushes.length;
  } catch (error) {
    console.error('Zamanlanmış push kontrolü hatası:', error);
    return 0;
  }
};

// Push istatistikleri
export const getPushStats = async () => {
  try {
    const pushHistory = await getPushHistory();
    
    const stats = {
      totalPushes: pushHistory.length,
      todayPushes: 0,
      weeklyPushes: 0,
      targetTypes: {
        all: 0,
        room: 0,
        character: 0
      }
    };
    
    const today = new Date().toISOString().split('T')[0];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    pushHistory.forEach(push => {
      // Günlük push'lar
      if (push.sentAt && push.sentAt.split('T')[0] === today) {
        stats.todayPushes++;
      }
      
      // Haftalık push'lar
      if (push.sentAt && new Date(push.sentAt) >= oneWeekAgo) {
        stats.weeklyPushes++;
      }
      
      // Hedef türleri
      if (stats.targetTypes[push.targetType] !== undefined) {
        stats.targetTypes[push.targetType]++;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Push istatistikleri getirme hatası:', error);
    return {
      totalPushes: 0,
      todayPushes: 0,
      weeklyPushes: 0,
      targetTypes: { all: 0, room: 0, character: 0 }
    };
  }
};

// updateDoc ve doc zaten yukarıda import edilmiş
