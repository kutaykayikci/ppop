// Popup bildirim türleri
export const POPUP_TYPES = {
  DAILY_REMINDER: 'daily_reminder',
  ACHIEVEMENT: 'achievement',
  PARTNER_ACTIVITY: 'partner_activity',
  MOTIVATION: 'motivation',
  STREAK: 'streak',
  SPECIAL_EVENT: 'special_event',
  WARNING: 'warning',
  SUCCESS: 'success',
  INFO: 'info'
};

// Popup şablonları
export const POPUP_TEMPLATES = {
  daily_reminder: {
    title: '⏰ Günlük Hatırlatıcı',
    message: 'Bugün henüz poop yapmadın! Hadi başla! 💩',
    icon: '💩',
    type: 'warning',
    duration: 6000,
    position: 'top-right',
    sound: true
  },
  
  achievement: {
    title: '🏆 Yeni Başarı!',
    message: 'Tebrikler! Yeni bir başarı rozeti kazandın!',
    icon: '🏆',
    type: 'success',
    duration: 8000,
    position: 'top-center',
    sound: true,
    confetti: true
  },
  
  partner_activity: {
    title: '👫 Partner Aktivitesi',
    message: 'Partnerin de aktif! Sen de katıl!',
    icon: '👫',
    type: 'partner',
    duration: 5000,
    position: 'top-left',
    sound: true
  },
  
  motivation: {
    title: '💪 Motivasyon',
    message: 'Sen harikasın! Bugün de mükemmel gidiyorsun!',
    icon: '⭐',
    type: 'motivation',
    duration: 4000,
    position: 'top-center',
    sound: false
  },
  
  streak: {
    title: '�� Streak Rekoru!',
    message: 'Harika! Yeni bir streak rekoru kırdın!',
    icon: '��',
    type: 'streak',
    duration: 6000,
    position: 'top-center',
    sound: true,
    fireworks: true
  },
  
  special_event: {
    title: '�� Özel Etkinlik',
    message: 'Özel bir etkinlik başladı! Kaçırma!',
    icon: '🎉',
    type: 'special',
    duration: 10000,
    position: 'center',
    sound: true,
    modal: true
  }
};

// Popup kuyruğu yönetimi
class PopupQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.activePopups = new Map();
  }

  add(popupData) {
    const id = Date.now() + Math.random();
    this.queue.push({ id, ...popupData });
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const popup = this.queue.shift();
      
      // Aynı tipte popup varsa bekle
      if (this.activePopups.has(popup.type)) {
        this.queue.unshift(popup);
        await this.waitForPopup(popup.type);
        continue;
      }
      
      await this.showPopup(popup);
    }
    
    this.isProcessing = false;
  }

  async showPopup(popup) {
    return new Promise((resolve) => {
      this.activePopups.set(popup.type, popup);
      
      // Popup bileşenini tetikle
      window.dispatchEvent(new CustomEvent('showPopup', { 
        detail: { ...popup, onClose: () => {
          this.activePopups.delete(popup.type);
          resolve();
        }}
      }));
    });
  }

  async waitForPopup(type) {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (!this.activePopups.has(type)) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
}

const popupQueue = new PopupQueue();

// Popup gönderme fonksiyonları
export const showPopupNotification = (templateKey, customData = {}) => {
  const template = POPUP_TEMPLATES[templateKey];
  if (!template) return;

  const popupData = {
    ...template,
    ...customData,
    timestamp: new Date().toISOString()
  };

  popupQueue.add(popupData);
};

export const showCustomPopup = (popupData) => {
  const defaultData = {
    type: 'info',
    duration: 4000,
    position: 'top-right',
    sound: false
  };

  popupQueue.add({ ...defaultData, ...popupData });
};

// Zamanlanmış popup'lar
export const schedulePopupReminder = (templateKey, delay, customData = {}) => {
  setTimeout(() => {
    showPopupNotification(templateKey, customData);
  }, delay);
};

// Günlük hatırlatıcı popup'ları
export const scheduleDailyPopups = (roomId, characterId) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Sabah hatırlatıcısı (09:00)
  const morningTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
  if (morningTime > now) {
    const morningDelay = morningTime.getTime() - now.getTime();
    schedulePopupReminder('daily_reminder', morningDelay, {
      roomId,
      characterId,
      time: 'sabah'
    });
  }
  
  // Öğleden sonra hatırlatıcısı (15:00)
  const afternoonTime = new Date(today.getTime() + 15 * 60 * 60 * 1000);
  if (afternoonTime > now) {
    const afternoonDelay = afternoonTime.getTime() - now.getTime();
    schedulePopupReminder('daily_reminder', afternoonDelay, {
      roomId,
      characterId,
      time: 'öğleden sonra'
    });
  }
  
  // Akşam hatırlatıcısı (19:00)
  const eveningTime = new Date(today.getTime() + 19 * 60 * 60 * 1000);
  if (eveningTime > now) {
    const eveningDelay = eveningTime.getTime() - now.getTime();
    schedulePopupReminder('daily_reminder', eveningDelay, {
      roomId,
      characterId,
      time: 'akşam'
    });
  }
};

// Başarı popup'ı
export const showAchievementPopup = (achievement) => {
  showPopupNotification('achievement', {
    message: `"${achievement.name}" başarısını kazandın! ${achievement.emoji}`,
    achievementData: achievement
  });
};

// Partner aktivite popup'ı
export const showPartnerActivityPopup = (partnerName, activity) => {
  showPopupNotification('partner_activity', {
    message: `${partnerName} ${activity}! Sen de katıl! 💩`,
    partnerName,
    activity
  });
};

// Streak popup'ı
export const showStreakPopup = (streakCount) => {
  showPopupNotification('streak', {
    message: `${streakCount} günlük seri devam ediyor! 🔥`,
    streakCount
  });
};

// Motivasyon popup'ı
export const showMotivationPopup = (motivation) => {
  showPopupNotification('motivation', {
    message: motivation.text,
    emoji: motivation.emoji
  });
};

// Özel etkinlik popup'ı
export const showSpecialEventPopup = (eventData) => {
  showPopupNotification('special_event', {
    title: eventData.title,
    message: eventData.message,
    icon: eventData.icon,
    eventData
  });
};

export default popupQueue;
