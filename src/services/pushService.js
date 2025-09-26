import { collection, addDoc, getDocs, query, orderBy, limit, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { sendPushNotification } from '@/services/notificationService';

// Popup-only stratejisi: Sadece UI popup gösteriyoruz

// Push bildirimini tüm kullanıcılara gönder
export const sendPushToAllUsers = async (pushData) => {
  try {
    // Popup-only: sadece local popup göster
    await sendPushNotification({
      title: pushData.title,
      body: pushData.body,
      icon: pushData.imageUrl || '💩',
      type: 'admin_push'
    }, {
      pushId: pushData.id,
      targetType: 'all'
    })
    return { success: true, sent: true, message: 'Popup shown to current user' }
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
    // Popup-only
    await sendPushNotification({
      title: pushData.title,
      body: pushData.body,
      icon: pushData.imageUrl || '💩',
      type: 'room_activity',
      actions: [
        {
          id: 'view_room',
          label: 'Odayı Görüntüle',
          data: { roomId },
          closeOnClick: false
        },
        {
          id: 'dismiss',
          label: 'Kapat',
          data: {},
          closeOnClick: true
        }
      ]
    }, {
      pushId: pushData.id,
      targetType: 'room',
      targetId: roomId
    });
    return { success: true, sent: true, message: `Popup shown for room ${roomId}` }
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
      icon: pushData.imageUrl || '💩',
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
      createdAt: new Date()
      // ID'yi burada eklemiyoruz, Firestore otomatik verecek
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
