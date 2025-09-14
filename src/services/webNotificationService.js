// Basit Web Notification servisi - CORS sorunu olmadan çalışır
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Web Notification gönder (browser native)
export const sendWebNotification = async (title, body, options = {}) => {
  try {
    // Browser notification izni kontrol et
    if (!('Notification' in window)) {
      console.warn('Bu tarayıcı notification desteklemiyor');
      return { success: false, error: 'Notification desteklenmiyor' };
    }

    if (Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        return { success: false, error: 'Notification izni verilmedi' };
      }
    }

    // Notification gönder
    const notification = new Notification(title, {
      body: body,
      icon: options.icon || '/poop-emoji.svg',
      badge: options.badge || '/poop-emoji.svg',
      tag: options.tag || 'poop-notification',
      requireInteraction: options.requireInteraction || true,
      silent: options.silent || false,
      data: options.data || {}
    });

    // Notification tıklandığında
    notification.onclick = function() {
      window.focus();
      notification.close();
      
      if (options.onClick) {
        options.onClick();
      }
    };

    // Notification kapatıldığında
    notification.onclose = function() {
      console.log('Notification kapatıldı');
    };

    return { success: true, notification };

  } catch (error) {
    console.error('Web notification hatası:', error);
    return { success: false, error: error.message };
  }
};

// Partner aktivitesi bildirimi (web notification)
export const sendPartnerActivityWebNotification = async (characterName, characterEmoji, roomId) => {
  try {
    const result = await sendWebNotification(
      `${characterName} ${characterEmoji} Pooped!`,
      `Partnerin poop yaptı! Sen de hemen katıl! 💩`,
      {
        icon: characterEmoji,
        tag: `partner-activity-${roomId}`,
        data: {
          type: 'partner_activity',
          roomId: roomId,
          characterName: characterName
        },
        onClick: () => {
          // Room'a yönlendir
          window.location.href = `/?room=${roomId}`;
        }
      }
    );

    // Firestore'a log kaydet
    await logNotification('partner_activity', {
      characterName,
      characterEmoji,
      roomId,
      success: result.success
    });

    return result;

  } catch (error) {
    console.error('Partner aktivitesi bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Başarı bildirimi (web notification)
export const sendAchievementWebNotification = async (achievementName, achievementEmoji, characterName) => {
  try {
    const result = await sendWebNotification(
      `🏆 Yeni Başarı!`,
      `${characterName}, ${achievementName} başarısını kazandın! ${achievementEmoji}`,
      {
        icon: achievementEmoji,
        tag: `achievement-${characterName}`,
        data: {
          type: 'achievement',
          achievementName,
          characterName
        }
      }
    );

    // Firestore'a log kaydet
    await logNotification('achievement', {
      achievementName,
      achievementEmoji,
      characterName,
      success: result.success
    });

    return result;

  } catch (error) {
    console.error('Başarı bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Günlük popup bildirimi (web notification)
export const sendDailyPopupWebNotification = async (characterName) => {
  try {
    const result = await sendWebNotification(
      `🎉 Bugün Poop Yaptık!`,
      `${characterName} ilk poop'unu yaptı! Harika başlangıç! 🚀`,
      {
        icon: '💩',
        tag: `daily-popup-${characterName}`,
        data: {
          type: 'daily_popup',
          characterName
        }
      }
    );

    return result;

  } catch (error) {
    console.error('Günlük popup bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Admin toplu bildirimi (web notification)
export const sendBulkWebNotification = async (title, body, targetUsers = []) => {
  try {
    // Tüm aktif kullanıcılara bildirim gönder
    const results = [];
    
    // Eğer hedef kullanıcılar belirtilmişse, sadece onlara gönder
    if (targetUsers.length > 0) {
      for (const user of targetUsers) {
        const result = await sendWebNotification(title, body, {
          tag: `bulk-notification-${user.id}`,
          data: {
            type: 'bulk_notification',
            targetUser: user.id
          }
        });
        results.push(result);
      }
    } else {
      // Genel bildirim
      const result = await sendWebNotification(title, body, {
        tag: 'bulk-notification-general',
        data: {
          type: 'bulk_notification',
          target: 'all'
        }
      });
      results.push(result);
    }

    // Firestore'a log kaydet
    await logNotification('bulk_notification', {
      title,
      body,
      targetCount: targetUsers.length || 'all',
      successCount: results.filter(r => r.success).length,
      totalCount: results.length
    });

    return {
      success: true,
      sent: results.filter(r => r.success).length,
      total: results.length,
      results
    };

  } catch (error) {
    console.error('Toplu bildirim hatası:', error);
    return { success: false, error: error.message };
  }
};

// Notification log'u Firestore'a kaydet
const logNotification = async (type, data) => {
  try {
    const logRef = collection(db, 'web_notification_logs');
    await addDoc(logRef, {
      type,
      data,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Notification log kaydetme hatası:', error);
  }
};

// Notification izni durumunu kontrol et
export const checkNotificationPermission = () => {
  if (!('Notification' in window)) {
    return {
      supported: false,
      permission: 'unsupported',
      message: 'Bu tarayıcı notification desteklemiyor'
    };
  }

  return {
    supported: true,
    permission: Notification.permission,
    message: Notification.permission === 'granted' ? 
      'Bildirimler aktif' : 
      Notification.permission === 'denied' ? 
        'Bildirimler reddedilmiş' : 
        'Bildirim izni verilmemiş'
  };
};

// Notification izni iste
export const requestNotificationPermission = async () => {
  try {
    if (!('Notification' in window)) {
      return { success: false, error: 'Notification desteklenmiyor' };
    }

    const permission = await Notification.requestPermission();
    
    return {
      success: permission === 'granted',
      permission,
      message: permission === 'granted' ? 
        'Bildirim izni verildi!' : 
        'Bildirim izni reddedildi'
    };

  } catch (error) {
    console.error('Notification izni isteme hatası:', error);
    return { success: false, error: error.message };
  }
};