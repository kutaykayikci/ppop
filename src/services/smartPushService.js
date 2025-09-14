import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { getRoomFCMTokens, getAllActiveFCMTokens } from './fcmService';
import { getRoomCharacters } from './characterService';
import { 
  sendPartnerActivityWebNotification,
  sendAchievementWebNotification,
  sendDailyPopupWebNotification,
  sendBulkWebNotification
} from './webNotificationService';

// Partner aktivitesi bildirimi gönder (Web Notification)
export const sendPartnerActivityNotification = async (roomId, characterId, characterName, characterEmoji) => {
  try {
    // Web Notification kullan (CORS sorunu yok)
    const result = await sendPartnerActivityWebNotification(characterName, characterEmoji, roomId);
    
    return {
      success: result.success,
      sent: result.success ? 1 : 0,
      total: 1,
      results: [result]
    };

  } catch (error) {
    console.error('Partner aktivitesi bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Hedef bildirimi gönder (Web Notification)
export const sendGoalAchievementNotification = async (roomId, characterId, characterName, goalType, goalValue) => {
  try {
    // Web Notification kullan
    const result = await sendAchievementWebNotification(
      `${goalType} Hedefi`,
      '🎯',
      characterName
    );

    return result;

  } catch (error) {
    console.error('Hedef bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Toplu bildirim gönder (Admin için - Web Notification)
export const sendBulkNotification = async (title, body, targetType = 'all', targetValue = null) => {
  try {
    // Web Notification kullan (CORS sorunu yok)
    const result = await sendBulkWebNotification(title, body);
    
    return {
      success: result.success,
      sent: result.sent,
      total: result.total,
      results: result.results
    };

  } catch (error) {
    console.error('Toplu bildirim hatası:', error);
    return { success: false, error: error.message };
  }
};

// Tek token'a push gönder (Firestore üzerinden)
const sendPushToToken = async (token, pushData) => {
  try {
    // CORS sorunu nedeniyle FCM API'sine doğrudan erişim yok
    // Bunun yerine Firestore'a push notification request kaydediyoruz
    // Firebase Functions bu verileri okuyup gerçek push'ları gönderebilir
    
    const pushRequest = {
      token: token,
      notification: {
        title: pushData.title,
        body: pushData.body,
        icon: pushData.icon,
        badge: pushData.badge,
        requireInteraction: pushData.requireInteraction,
        silent: pushData.silent || false
      },
      data: pushData.data,
      actions: pushData.actions,
      timestamp: new Date(),
      status: 'pending'
    };

    // Firestore'a push request kaydet
    const pushRequestRef = collection(db, 'push_requests');
    await addDoc(pushRequestRef, pushRequest);

    console.log('Push request Firestore\'a kaydedildi:', pushRequest);
    
    // Şimdilik başarılı döndür (gerçek push Firebase Functions tarafından yapılacak)
    return { success: true, messageId: 'firestore_saved' };

  } catch (error) {
    console.error('Push request kaydetme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Push gönderimini logla
const logPushNotification = async (logData) => {
  try {
    const logRef = collection(db, 'push_logs');
    await addDoc(logRef, {
      ...logData,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Push log kaydetme hatası:', error);
  }
};

// Push istatistiklerini getir
export const getPushStatistics = async (timeframe = 'week') => {
  try {
    const logRef = collection(db, 'push_logs');
    const snapshot = await getDocs(logRef);
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Zaman aralığına göre filtrele
    const now = new Date();
    let filteredLogs = logs;

    if (timeframe === 'day') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filteredLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp?.seconds ? log.timestamp.seconds * 1000 : log.createdAt);
        return logTime >= today;
      });
    } else if (timeframe === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp?.seconds ? log.timestamp.seconds * 1000 : log.createdAt);
        return logTime >= weekAgo;
      });
    } else if (timeframe === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredLogs = logs.filter(log => {
        const logTime = new Date(log.timestamp?.seconds ? log.timestamp.seconds * 1000 : log.createdAt);
        return logTime >= monthAgo;
      });
    }

    // İstatistikleri hesapla
    const stats = {
      total: filteredLogs.length,
      sent: filteredLogs.reduce((sum, log) => sum + log.successCount, 0),
      failed: filteredLogs.reduce((sum, log) => sum + (log.targetCount - log.successCount), 0),
      partnerActivity: filteredLogs.filter(log => log.type === 'partner_activity').length,
      goalAchievement: filteredLogs.filter(log => log.type === 'goal_achievement').length,
      bulkNotification: filteredLogs.filter(log => log.type === 'bulk_notification').length
    };

    return { logs: filteredLogs, stats };

  } catch (error) {
    console.error('Push istatistikleri getirme hatası:', error);
    return { logs: [], stats: { total: 0, sent: 0, failed: 0, partnerActivity: 0, goalAchievement: 0, bulkNotification: 0 } };
  }
};
