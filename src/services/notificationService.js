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

// Popup bildirim gönder (sadece popup, push izni gerekmez)
export const sendPushNotification = async (template, customData = {}) => {
  try {
    // Popup manager'ı import et
    const { createPopup, POPUP_TYPES } = await import('./popupManagerService');
    
    // Popup tipini belirle (require yerine ESM import'tan gelen sabitler)
    const popupType = getPopupTypeFromTemplate(template, POPUP_TYPES);
    
    // Popup olarak göster
    createPopup({
      type: popupType,
      title: template.title,
      message: template.body,
      duration: 5000,
      data: customData,
      actions: template.actions || [],
      onAction: (actionId, actionData) => {
        // Aksiyon işlemleri
        if (template.onAction) {
          template.onAction(actionId, actionData);
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error('Popup bildirim gönderme hatası:', error);
    return false;
  }
};

// Template tipinden popup tipini belirle
const getPopupTypeFromTemplate = (template, POPUP_TYPES) => {
  switch (template.type) {
    case 'achievement':
      return POPUP_TYPES.ACHIEVEMENT;
    case 'motivation':
      return POPUP_TYPES.MOTIVATION;
    case 'partner_activity':
      return POPUP_TYPES.PARTNER;
    case 'daily_reminder':
      return POPUP_TYPES.DAILY_REMINDER;
    case 'room_activity':
      return POPUP_TYPES.ROOM_ACTIVITY;
    case 'character_update':
      return POPUP_TYPES.CHARACTER_UPDATE;
    case 'error':
      return POPUP_TYPES.ERROR;
    case 'warning':
      return POPUP_TYPES.WARNING;
    case 'success':
      return POPUP_TYPES.SUCCESS;
    default:
      return POPUP_TYPES.INFO;
  }
};

// Native bildirim gönder (fallback - artık kullanılmıyor)
export const sendNotification = async (template, customData = {}) => {
  // Popup-only stratejisi: eski API'yi koruyarak popup göster
  return await sendPushNotification(template, customData)
}

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
