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

// Partner aktivitesi bildirimi gönder
export const sendPartnerActivityNotification = async (roomId, characterId, characterName, characterEmoji) => {
  try {
    // Room'daki diğer karakterleri getir
    const characters = await getRoomCharacters(roomId);
    const otherCharacters = characters.filter(char => char.id !== characterId);
    
    if (otherCharacters.length === 0) {
      console.log('Room\'da başka karakter yok');
      return { success: false, message: 'Room\'da başka karakter yok' };
    }

    // Room'daki aktif FCM token'ları getir
    const tokens = await getRoomFCMTokens(roomId);
    const otherTokens = tokens.filter(token => token.characterId !== characterId);

    if (otherTokens.length === 0) {
      console.log('Room\'da aktif FCM token yok');
      return { success: false, message: 'Room\'da aktif FCM token yok' };
    }

    // Push notification gönder
    const pushData = {
      title: `${characterName} ${characterEmoji} Pooped!`,
      body: `Partnerin poop yaptı! Sen de hemen katıl! 💩`,
      icon: characterEmoji,
      badge: '/poop-emoji.svg',
      data: {
        type: 'partner_activity',
        roomId: roomId,
        characterId: characterId,
        characterName: characterName,
        timestamp: new Date().toISOString()
      },
      actions: [
        {
          action: 'view',
          title: 'Görüntüle',
          icon: '/poop-emoji.svg'
        }
      ],
      requireInteraction: true,
      silent: false
    };

    // Her token için push gönder
    const results = [];
    for (const token of otherTokens) {
      try {
        const result = await sendPushToToken(token.token, pushData);
        results.push({ token: token.token, success: result.success });
      } catch (error) {
        console.error(`Token ${token.token} için push gönderimi başarısız:`, error);
        results.push({ token: token.token, success: false, error: error.message });
      }
    }

    // Push gönderimini logla
    await logPushNotification({
      type: 'partner_activity',
      roomId,
      characterId,
      characterName,
      targetCount: otherTokens.length,
      successCount: results.filter(r => r.success).length,
      data: pushData
    });

    return {
      success: true,
      sent: results.filter(r => r.success).length,
      total: results.length,
      results
    };

  } catch (error) {
    console.error('Partner aktivitesi bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Hedef bildirimi gönder
export const sendGoalAchievementNotification = async (roomId, characterId, characterName, goalType, goalValue) => {
  try {
    const tokens = await getRoomFCMTokens(roomId);
    const targetToken = tokens.find(token => token.characterId === characterId);

    if (!targetToken) {
      console.log('Karakter için aktif FCM token bulunamadı');
      return { success: false, message: 'Aktif FCM token bulunamadı' };
    }

    const pushData = {
      title: `🎉 Hedef Tamamlandı!`,
      body: `${characterName}, ${goalType} hedefine ulaştın! (${goalValue} poop)`,
      icon: '🎯',
      badge: '/poop-emoji.svg',
      data: {
        type: 'goal_achievement',
        roomId: roomId,
        characterId: characterId,
        characterName: characterName,
        goalType: goalType,
        goalValue: goalValue,
        timestamp: new Date().toISOString()
      },
      actions: [
        {
          action: 'view',
          title: 'Görüntüle',
          icon: '🎯'
        }
      ],
      requireInteraction: true
    };

    const result = await sendPushToToken(targetToken.token, pushData);

    // Push gönderimini logla
    await logPushNotification({
      type: 'goal_achievement',
      roomId,
      characterId,
      characterName,
      targetCount: 1,
      successCount: result.success ? 1 : 0,
      data: pushData
    });

    return result;

  } catch (error) {
    console.error('Hedef bildirimi hatası:', error);
    return { success: false, error: error.message };
  }
};

// Toplu bildirim gönder (Admin için)
export const sendBulkNotification = async (title, body, targetType = 'all', targetValue = null) => {
  try {
    let tokens = [];

    if (targetType === 'all') {
      tokens = await getAllActiveFCMTokens();
    } else if (targetType === 'room' && targetValue) {
      tokens = await getRoomFCMTokens(targetValue);
    } else if (targetType === 'character' && targetValue) {
      const allTokens = await getAllActiveFCMTokens();
      tokens = allTokens.filter(token => token.characterId === targetValue);
    }

    if (tokens.length === 0) {
      return { success: false, message: 'Hedef bulunamadı' };
    }

    const pushData = {
      title: title,
      body: body,
      icon: '/poop-emoji.svg',
      badge: '/poop-emoji.svg',
      data: {
        type: 'bulk_notification',
        targetType: targetType,
        targetValue: targetValue,
        timestamp: new Date().toISOString()
      },
      actions: [
        {
          action: 'view',
          title: 'Görüntüle',
          icon: '/poop-emoji.svg'
        }
      ],
      requireInteraction: true
    };

    // Her token için push gönder
    const results = [];
    for (const token of tokens) {
      try {
        const result = await sendPushToToken(token.token, pushData);
        results.push({ token: token.token, success: result.success });
      } catch (error) {
        console.error(`Token ${token.token} için push gönderimi başarısız:`, error);
        results.push({ token: token.token, success: false, error: error.message });
      }
    }

    // Push gönderimini logla
    await logPushNotification({
      type: 'bulk_notification',
      roomId: null,
      characterId: null,
      characterName: 'Admin',
      targetCount: tokens.length,
      successCount: results.filter(r => r.success).length,
      data: pushData
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

// Tek token'a push gönder
const sendPushToToken = async (token, pushData) => {
  try {
    // Firebase Cloud Messaging API kullanarak push gönder
    const response = await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `key=import.meta.env.VITE_FCM_SERVER_KEY`
      },
      body: JSON.stringify({
        to: token,
        notification: {
          title: pushData.title,
          body: pushData.body,
          icon: pushData.icon,
          badge: pushData.badge,
          requireInteraction: pushData.requireInteraction,
          silent: pushData.silent || false
        },
        data: pushData.data,
        actions: pushData.actions
      })
    });

    const result = await response.json();
    
    if (response.ok && result.success === 1) {
      return { success: true, messageId: result.results[0]?.message_id };
    } else {
      console.error('FCM push hatası:', result);
      return { success: false, error: result.error || 'Push gönderimi başarısız' };
    }

  } catch (error) {
    console.error('Push gönderimi hatası:', error);
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
