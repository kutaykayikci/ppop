// Bildirim türleri
export const NOTIFICATION_TYPES = {
  REMINDER: 'reminder',
  ACHIEVEMENT: 'achievement',
  PARTNER_ACTIVITY: 'partner_activity',
  MOTIVATION: 'motivation',
  STREAK: 'streak'
};

// Bildirim şablonları
export const NOTIFICATION_TEMPLATES = {
  // Günlük hatırlatıcılar
  daily_reminder: {
    title: 'Günlük Poop Hatırlatıcısı',
    body: 'Bugün henüz poop yapmadın! Hadi başla! 💩',
    icon: '💩',
    type: NOTIFICATION_TYPES.REMINDER
  },
  
  afternoon_reminder: {
    title: 'Öğleden Sonra Hatırlatıcısı',
    body: 'Öğleden sonra da aktif ol! 💪',
    icon: '☀️',
    type: NOTIFICATION_TYPES.REMINDER
  },
  
  evening_reminder: {
    title: 'Akşam Hatırlatıcısı',
    body: 'Akşam da harika gidiyorsun! 🌅',
    icon: '🌅',
    type: NOTIFICATION_TYPES.REMINDER
  },

  // Başarı bildirimleri
  achievement_unlocked: {
    title: 'Yeni Başarı!',
    body: 'Tebrikler! Yeni bir başarı rozeti kazandın! 🏆',
    icon: '🏆',
    type: NOTIFICATION_TYPES.ACHIEVEMENT
  },
  
  streak_milestone: {
    title: 'Streak Rekoru!',
    body: 'Harika! Yeni bir streak rekoru kırdın! 🔥',
    icon: '🔥',
    type: NOTIFICATION_TYPES.STREAK
  },

  // Partner aktivite bildirimleri
  partner_poop: {
    title: 'Partner Aktivitesi',
    body: 'Partnerin de aktif! Sen de katıl! 👫',
    icon: '👫',
    type: NOTIFICATION_TYPES.PARTNER_ACTIVITY
  },
  
  partner_achievement: {
    title: 'Partner Başarısı',
    body: 'Partnerin yeni bir başarı kazandı! Tebrik et! 🎉',
    icon: '🎉',
    type: NOTIFICATION_TYPES.PARTNER_ACTIVITY
  },

  // Motivasyon bildirimleri
  daily_motivation: {
    title: 'Günlük Motivasyon',
    body: 'Sen harikasın! Bugün de mükemmel gidiyorsun! ⭐',
    icon: '⭐',
    type: NOTIFICATION_TYPES.MOTIVATION
  },
  
  weekly_motivation: {
    title: 'Haftalık Motivasyon',
    body: 'Bu hafta inanılmaz bir performans! 🚀',
    icon: '🚀',
    type: NOTIFICATION_TYPES.MOTIVATION
  }
};

// Bildirim zamanları (saat)
export const REMINDER_TIMES = {
  MORNING: 9,    // 09:00
  AFTERNOON: 15, // 15:00
  EVENING: 19    // 19:00
};

// Bildirim izinlerini kontrol et
export const checkNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Push bildirim gönder
export const sendPushNotification = async (template, customData = {}) => {
  try {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.ready;
      
      await registration.showNotification(template.title, {
        body: template.body,
        icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHRleHQgeD0iMTYiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIj7wn5KpPC90ZXh0Pgo8L3N2Zz4K',
        badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHRleHQgeD0iMTYiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIj7wn5KpPC90ZXh0Pgo8L3N2Zz4K',
        tag: template.type,
        requireInteraction: false,
        data: {
          type: template.type,
          timestamp: new Date().toISOString(),
          ...customData
        },
        actions: [
          {
            action: 'open',
            title: 'Aç',
            icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI0IiBmaWxsPSIjOEI0NTEzIi8+CiAgPHRleHQgeD0iMTYiIHk9IjIyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIwIj7wn5KpPC90ZXh0Pgo8L3N2Zz4K'
          }
        ]
      });
      
      return true;
    } else {
      // Fallback to regular notification
      return await sendNotification(template, customData);
    }
  } catch (error) {
    console.error('Push bildirim gönderme hatası:', error);
    return await sendNotification(template, customData);
  }
};

// Bildirim gönder
export const sendNotification = async (template, customData = {}) => {
  const hasPermission = await checkNotificationPermission();
  
  if (!hasPermission) {
    return false;
  }

  try {
    const notification = new Notification(template.title, {
      body: template.body,
      icon: '/poop-emoji.svg', // PWA icon
      badge: '/poop-emoji.svg',
      tag: template.type,
      data: {
        type: template.type,
        timestamp: new Date().toISOString(),
        ...customData
      }
    });

    // Bildirimi 5 saniye sonra kapat
    setTimeout(() => {
      notification.close();
    }, 5000);

    return true;
  } catch (error) {
    console.error('Bildirim gönderme hatası:', error);
    return false;
  }
};

// Günlük hatırlatıcıları ayarla
export const scheduleDailyReminders = (roomId, characterId) => {
  // Zaten ayarlanmış mı kontrol et
  const reminderKey = `reminders_${roomId}_${characterId}`;
  const existingReminders = localStorage.getItem(reminderKey);
  
  if (existingReminders) {
    return; // Zaten ayarlanmış
  }

  // Hatırlatıcı zamanlarını hesapla
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const reminderTimes = [
    { time: REMINDER_TIMES.MORNING, template: 'daily_reminder' },
    { time: REMINDER_TIMES.AFTERNOON, template: 'afternoon_reminder' },
    { time: REMINDER_TIMES.EVENING, template: 'evening_reminder' }
  ];

  reminderTimes.forEach(({ time, template }) => {
    const reminderTime = new Date(today.getTime() + time * 60 * 60 * 1000);
    
    // Eğer bugün geçtiyse yarına ayarla
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();
    
    setTimeout(async () => {
      // Bugün poop yapıldı mı kontrol et
      const todayPoops = await getTodayPoops(roomId, characterId);
      
      if (todayPoops.length === 0) {
        await sendNotification(NOTIFICATION_TEMPLATES[template], {
          roomId,
          characterId
        });
      }
      
      // Bir sonraki gün için tekrar ayarla
      scheduleNextDayReminder(roomId, characterId, time, template);
    }, timeUntilReminder);
  });

  // Hatırlatıcıları kaydet
  localStorage.setItem(reminderKey, JSON.stringify({
    roomId,
    characterId,
    scheduledAt: new Date().toISOString()
  }));
};

// Bir sonraki gün için hatırlatıcı ayarla
const scheduleNextDayReminder = (roomId, characterId, time, template) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(time, 0, 0, 0);
  
  const timeUntilTomorrow = tomorrow.getTime() - new Date().getTime();
  
  setTimeout(async () => {
    const todayPoops = await getTodayPoops(roomId, characterId);
    
    if (todayPoops.length === 0) {
      await sendNotification(NOTIFICATION_TEMPLATES[template], {
        roomId,
        characterId
      });
    }
    
    // Sonsuz döngü
    scheduleNextDayReminder(roomId, characterId, time, template);
  }, timeUntilTomorrow);
};

// Başarı bildirimi gönder
export const sendAchievementNotification = async (achievement) => {
  const template = {
    ...NOTIFICATION_TEMPLATES.achievement_unlocked,
    body: `Tebrikler! "${achievement.name}" başarısını kazandın! ${achievement.emoji}`,
    icon: achievement.emoji
  };

  return await sendNotification(template, {
    achievementId: achievement.id,
    achievementType: achievement.type
  });
};

// Partner aktivite bildirimi gönder
export const sendPartnerActivityNotification = async (partnerName, activity) => {
  const template = {
    ...NOTIFICATION_TEMPLATES.partner_poop,
    body: `${partnerName} ${activity}! Sen de katıl! 👫`,
    icon: '👫'
  };

  return await sendNotification(template, {
    partnerName,
    activity
  });
};

// Streak bildirimi gönder
export const sendStreakNotification = async (streakCount) => {
  const template = {
    ...NOTIFICATION_TEMPLATES.streak_milestone,
    body: `Harika! ${streakCount} günlük seri devam ediyor! 🔥`,
    icon: '🔥'
  };

  return await sendNotification(template, {
    streakCount
  });
};

// Motivasyon bildirimi gönder
export const sendMotivationNotification = async (motivation) => {
  const template = {
    ...NOTIFICATION_TEMPLATES.daily_motivation,
    body: motivation.text,
    icon: motivation.emoji
  };

  return await sendNotification(template, {
    motivationType: 'daily'
  });
};

// Bildirim ayarlarını kaydet
export const saveNotificationSettings = (roomId, characterId, settings) => {
  const key = `notification_settings_${roomId}_${characterId}`;
  localStorage.setItem(key, JSON.stringify({
    ...settings,
    updatedAt: new Date().toISOString()
  }));
};

// Bildirim ayarlarını getir
export const getNotificationSettings = (roomId, characterId) => {
  const key = `notification_settings_${roomId}_${characterId}`;
  const settings = localStorage.getItem(key);
  
  if (settings) {
    return JSON.parse(settings);
  }
  
  // Varsayılan ayarlar
  return {
    dailyReminders: true,
    achievementNotifications: true,
    partnerActivity: true,
    motivationMessages: true,
    reminderTimes: {
      morning: true,
      afternoon: true,
      evening: false
    }
  };
};

// Hatırlatıcıları temizle
export const clearReminders = (roomId, characterId) => {
  const reminderKey = `reminders_${roomId}_${characterId}`;
  localStorage.removeItem(reminderKey);
};

// Yardımcı fonksiyon
const getTodayPoops = async (roomId, characterId) => {
  try {
    const { getTodayPoops } = await import('../firebase/poopService');
    return await getTodayPoops(roomId, characterId);
  } catch (error) {
    console.error('Bugünkü poops getirme hatası:', error);
    return [];
  }
};
