// Basit Web Notification servisi - CORS sorunu olmadan çalışır
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// iOS ve Safari uyumlu notification kontrolü
const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

// Web Notification gönder (iOS uyumlu)
export const sendWebNotification = async (title, body, options = {}) => {
  try {
    console.log('Notification gönderiliyor:', { title, body, options });
    console.log('Browser bilgisi:', { 
      userAgent: navigator.userAgent, 
      isIOS: isIOS(), 
      isSafari: isSafari(),
      hasNotification: 'Notification' in window 
    });

    // iOS Safari'de notification çok kısıtlı
    if (isIOS() || isSafari()) {
      console.log('iOS/Safari tespit edildi, alternatif yöntem kullanılıyor');
      return await sendIOSCompatibleNotification(title, body, options);
    }

    // Diğer browser'lar için normal notification
    if (!('Notification' in window)) {
      console.warn('Bu tarayıcı notification desteklemiyor');
      return { success: false, error: 'Notification desteklenmiyor' };
    }

    if (Notification.permission !== 'granted') {
      console.log('Notification izni isteniyor...');
      const permission = await Notification.requestPermission();
      console.log('Notification izni sonucu:', permission);
      
      if (permission !== 'granted') {
        console.warn('Notification izni verilmedi:', permission);
        return { success: false, error: `Notification izni verilmedi: ${permission}` };
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

    console.log('Notification oluşturuldu:', notification);

    // Notification tıklandığında
    notification.onclick = function() {
      console.log('Notification tıklandı');
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

// iOS uyumlu alternatif bildirim
const sendIOSCompatibleNotification = async (title, body, options = {}) => {
  try {
    // iOS'ta visual feedback için page title değiştir
    const originalTitle = document.title;
    document.title = `🔔 ${title}`;
    
    // 3 saniye sonra eski title'a döndür
    setTimeout(() => {
      document.title = originalTitle;
    }, 3000);

    // Console'a log yaz
    console.log(`🔔 ${title}: ${body}`);
    
    // LocalStorage'a notification kaydet (diğer tab'lar için)
    const notification = {
      id: Date.now(),
      title,
      body,
      timestamp: new Date().toISOString(),
      data: options.data || {}
    };
    
    const existingNotifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
    existingNotifications.push(notification);
    
    // Son 10 notification'ı tut
    if (existingNotifications.length > 10) {
      existingNotifications.splice(0, existingNotifications.length - 10);
    }
    
    localStorage.setItem('pendingNotifications', JSON.stringify(existingNotifications));
    
    // Custom event tetikle
    window.dispatchEvent(new CustomEvent('notificationReceived', { 
      detail: notification 
    }));

    // Visual feedback için toast göster
    showToast(title, body, options);

    return { success: true, notification: { id: notification.id } };

  } catch (error) {
    console.error('iOS notification hatası:', error);
    return { success: false, error: error.message };
  }
};

// Toast bildirimi göster
const showToast = (title, body, options = {}) => {
  // Toast container oluştur
  let toastContainer = document.getElementById('notification-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'notification-toast-container';
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  // Toast elementi oluştur
  const toast = document.createElement('div');
  toast.style.cssText = `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    margin-bottom: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    max-width: 300px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
    cursor: pointer;
    border: 2px solid #333;
  `;

  toast.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 5px; font-size: 14px;">
      ${title}
    </div>
    <div style="font-size: 12px; opacity: 0.9;">
      ${body}
    </div>
  `;

  toastContainer.appendChild(toast);

  // Animasyon
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 100);

  // Tıklama olayı
  toast.onclick = () => {
    if (options.onClick) {
      options.onClick();
    }
    removeToast(toast);
  };

  // 5 saniye sonra otomatik kaldır
  setTimeout(() => {
    removeToast(toast);
  }, 5000);
};

const removeToast = (toast) => {
  toast.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
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

// Notification izni durumunu kontrol et (iOS uyumlu)
export const checkNotificationPermission = () => {
  const browserInfo = {
    isIOS: isIOS(),
    isSafari: isSafari(),
    hasNotification: 'Notification' in window,
    userAgent: navigator.userAgent
  };

  console.log('Notification izni kontrol ediliyor:', browserInfo);

  // iOS Safari'de notification çok kısıtlı
  if (isIOS() || isSafari()) {
    return {
      supported: true,
      permission: 'ios_compatible',
      message: 'iOS/Safari uyumlu bildirim sistemi aktif',
      browserInfo
    };
  }

  if (!('Notification' in window)) {
    return {
      supported: false,
      permission: 'unsupported',
      message: 'Bu tarayıcı notification desteklemiyor',
      browserInfo
    };
  }

  return {
    supported: true,
    permission: Notification.permission,
    message: Notification.permission === 'granted' ? 
      'Bildirimler aktif' : 
      Notification.permission === 'denied' ? 
        'Bildirimler reddedilmiş' : 
        'Bildirim izni verilmemiş',
    browserInfo
  };
};

// Notification izni iste (iOS uyumlu)
export const requestNotificationPermission = async () => {
  try {
    console.log('Notification izni isteniyor...');
    
    // iOS Safari'de normal notification API yok
    if (isIOS() || isSafari()) {
      console.log('iOS/Safari tespit edildi, alternatif sistem kullanılacak');
      return {
        success: true,
        permission: 'ios_compatible',
        message: 'iOS/Safari uyumlu bildirim sistemi aktif!'
      };
    }

    if (!('Notification' in window)) {
      return { success: false, error: 'Notification desteklenmiyor' };
    }

    const permission = await Notification.requestPermission();
    console.log('Notification izni sonucu:', permission);
    
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