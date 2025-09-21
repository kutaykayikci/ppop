// Merkezi Feedback Yönetim Sistemi
// Tüm kullanıcı feedback'lerini tek yerden yönetir

import { createPopup, POPUP_TYPES, closePopup, closeAllPopups } from './popupManagerService';
import { showNotification, NOTIFICATION_TYPES, clearAllNotifications } from './simpleNotificationService';
import feedbackSoundService from './feedbackSoundService';

// Feedback tipleri - tüm uygulama genelinde kullanılacak
export const FEEDBACK_TYPES = {
  // Hata mesajları
  ROOM_FULL: 'room_full',
  ROOM_NOT_FOUND: 'room_not_found',
  ROOM_ALREADY_JOINED: 'room_already_joined',
  ROOM_CAPACITY_FULL: 'room_capacity_full',
  NETWORK_ERROR: 'network_error',
  AUTH_ERROR: 'auth_error',
  VALIDATION_ERROR: 'validation_error',
  PERMISSION_ERROR: 'permission_error',
  
  // Başarı mesajları
  ROOM_JOINED: 'room_joined',
  ROOM_CREATED: 'room_created',
  ROOM_LEFT: 'room_left',
  POOP_ADDED: 'poop_added',
  CHARACTER_READY: 'character_ready',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  
  // Bilgi mesajları
  PARTNER_JOINED: 'partner_joined',
  PARTNER_LEFT: 'partner_left',
  PARTNER_ACTIVITY: 'partner_activity',
  DAILY_REMINDER: 'daily_reminder',
  MOTIVATION_MESSAGE: 'motivation_message',
  
  // Uyarı mesajları
  LOW_BATTERY: 'low_battery',
  OFFLINE_MODE: 'offline_mode',
  STORAGE_FULL: 'storage_full',
  UPDATE_AVAILABLE: 'update_available',
  
  // Sistem mesajları
  SYNC_STARTED: 'sync_started',
  SYNC_COMPLETED: 'sync_completed',
  SYNC_FAILED: 'sync_failed',
  BACKUP_CREATED: 'backup_created',
  BACKUP_RESTORED: 'backup_restored'
};

// Feedback seviyeleri - gösterim şekli
export const FEEDBACK_LEVELS = {
  TOAST: 'toast',      // Kısa, geçici (3-5 saniye)
  POPUP: 'popup',      // Orta, etkileşimli (5-10 saniye)
  MODAL: 'modal',      // Uzun, detaylı (kullanıcı kapatana kadar)
  BANNER: 'banner',    // Sürekli, üstte (kullanıcı kapatana kadar)
  INLINE: 'inline'     // Sayfa içinde, kontekstual
};

// Feedback öncelik seviyeleri
export const FEEDBACK_PRIORITY = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  URGENT: 4,
  CRITICAL: 5
};

// Feedback animasyon tipleri
export const FEEDBACK_ANIMATIONS = {
  NONE: 'none',
  FADE: 'fade',
  SLIDE: 'slide',
  BOUNCE: 'bounce',
  SHAKE: 'shake',
  PULSE: 'pulse',
  ZOOM: 'zoom',
  FLIP: 'flip'
};

// Merkezi Feedback Yöneticisi
class FeedbackManager {
  constructor() {
    this.settings = {
      enabled: true,
      defaultLevel: FEEDBACK_LEVELS.TOAST,
      enableSound: true,
      enableVibration: true,
      enableAnimations: true,
      maxConcurrent: 3,
      autoClose: true,
      position: 'top-right',
      theme: 'pixel',
      language: 'tr'
    };
    
    this.templates = this.initializeTemplates();
    this.activeFeedbacks = [];
    this.queue = [];
    this.isProcessing = false;
    
    // Cihaz özelliklerini algıla
    this.deviceInfo = this.detectDevice();
    
    // Global event listener'ları ekle
    this.setupGlobalListeners();
  }

  // Cihaz bilgilerini algıla
  detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android/i.test(navigator.userAgent) && 'ontouchend' in document;
    const isDesktop = !isMobile && !isTablet;
    
    return {
      isMobile,
      isTablet,
      isDesktop,
      hasVibration: 'vibrate' in navigator,
      hasAudio: typeof Audio !== 'undefined',
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  }

  // Global event listener'ları kur
  setupGlobalListeners() {
    // Online/offline durumu
    window.addEventListener('online', () => {
      this.show(FEEDBACK_TYPES.NETWORK_ERROR, {}, {
        level: FEEDBACK_LEVELS.TOAST,
        message: 'İnternet bağlantısı yeniden kuruldu!',
        type: 'success'
      });
    });

    window.addEventListener('offline', () => {
      this.show(FEEDBACK_TYPES.OFFLINE_MODE, {}, {
        level: FEEDBACK_LEVELS.BANNER,
        message: 'İnternet bağlantısı kesildi. Çevrimdışı modda çalışıyorsunuz.',
        persistent: true
      });
    });

    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      this.show(FEEDBACK_TYPES.UPDATE_AVAILABLE, {}, {
        level: FEEDBACK_LEVELS.POPUP,
        title: 'Uygulamayı Yükle',
        message: 'Bu uygulamayı ana ekranınıza ekleyebilirsiniz!',
        actions: [
          { id: 'install', label: 'Yükle', primary: true },
          { id: 'later', label: 'Daha Sonra' }
        ],
        onAction: (actionId) => {
          if (actionId === 'install') {
            e.prompt();
          }
        }
      });
    });
  }

  // Feedback şablonlarını başlat
  initializeTemplates() {
    return {
      // HATA MESAJLARI
      [FEEDBACK_TYPES.ROOM_FULL]: {
        title: 'Oda Dolu',
        message: 'Bu oda maksimum kapasiteye ulaştı. Başka bir oda deneyin.',
        icon: '🚫',
        level: FEEDBACK_LEVELS.POPUP,
        priority: FEEDBACK_PRIORITY.HIGH,
        duration: 5000,
        animation: FEEDBACK_ANIMATIONS.SHAKE,
        sound: 'error',
        vibration: [200, 100, 200],
        actions: [
          { id: 'create_room', label: 'Yeni Oda Oluştur', primary: true },
          { id: 'try_again', label: 'Tekrar Dene' },
          { id: 'browse_rooms', label: 'Odaları Görüntüle' }
        ]
      },

      [FEEDBACK_TYPES.ROOM_NOT_FOUND]: {
        title: 'Oda Bulunamadı',
        message: 'Girdiğiniz oda ID\'si geçersiz veya silinmiş.',
        icon: '🔍',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 4000,
        animation: FEEDBACK_ANIMATIONS.FADE,
        sound: 'warning'
      },

      [FEEDBACK_TYPES.ROOM_ALREADY_JOINED]: {
        title: 'Zaten Katıldınız',
        message: 'Bu odada zaten bulunuyorsunuz.',
        icon: '👤',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.LOW,
        duration: 3000,
        animation: FEEDBACK_ANIMATIONS.PULSE
      },

      [FEEDBACK_TYPES.ROOM_CAPACITY_FULL]: {
        title: 'Oda Kapasitesi Dolu',
        message: 'Bu oda maksimum kapasiteye ulaştı.',
        icon: '🚫',
        level: FEEDBACK_LEVELS.POPUP,
        priority: FEEDBACK_PRIORITY.HIGH,
        duration: 5000,
        animation: FEEDBACK_ANIMATIONS.SHAKE,
        sound: 'error',
        vibration: [200, 100, 200],
        actions: [
          { id: 'create_room', label: 'Yeni Oda Oluştur', primary: true },
          { id: 'try_again', label: 'Tekrar Dene' },
          { id: 'browse_rooms', label: 'Odaları Görüntüle' }
        ]
      },

      [FEEDBACK_TYPES.NETWORK_ERROR]: {
        title: 'Bağlantı Hatası',
        message: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
        icon: '🌐',
        level: FEEDBACK_LEVELS.BANNER,
        priority: FEEDBACK_PRIORITY.HIGH,
        persistent: true,
        animation: FEEDBACK_ANIMATIONS.PULSE,
        sound: 'error'
      },

      [FEEDBACK_TYPES.AUTH_ERROR]: {
        title: 'Giriş Hatası',
        message: 'Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.',
        icon: '🔐',
        level: FEEDBACK_LEVELS.MODAL,
        priority: FEEDBACK_PRIORITY.URGENT,
        actions: [
          { id: 'login', label: 'Giriş Yap', primary: true },
          { id: 'cancel', label: 'İptal' }
        ]
      },

      // BAŞARI MESAJLARI
      [FEEDBACK_TYPES.ROOM_JOINED]: {
        title: 'Odaya Katıldınız',
        message: 'Başarıyla odaya katıldınız!',
        icon: '✅',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 3000,
        animation: FEEDBACK_ANIMATIONS.BOUNCE,
        sound: 'success',
        vibration: [100]
      },

      [FEEDBACK_TYPES.ROOM_CREATED]: {
        title: 'Oda Oluşturuldu',
        message: 'Yeni oda başarıyla oluşturuldu!',
        icon: '🏠',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 3000,
        animation: FEEDBACK_ANIMATIONS.ZOOM,
        sound: 'success'
      },

      [FEEDBACK_TYPES.POOP_ADDED]: {
        title: 'Poop Eklendi',
        message: 'Yeni poop kaydedildi!',
        icon: '💩',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 2000,
        animation: FEEDBACK_ANIMATIONS.BOUNCE,
        sound: 'poop',
        vibration: [50, 50, 50]
      },

      [FEEDBACK_TYPES.CHARACTER_READY]: {
        title: 'Karakter Hazır',
        message: 'Karakteriniz başarıyla oluşturuldu!',
        icon: '👤',
        level: FEEDBACK_LEVELS.POPUP,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 4000,
        animation: FEEDBACK_ANIMATIONS.ZOOM,
        sound: 'success'
      },

      [FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED]: {
        title: 'Yeni Başarı!',
        message: 'Tebrikler! Yeni bir başarı rozeti kazandınız!',
        icon: '🏆',
        level: FEEDBACK_LEVELS.POPUP,
        priority: FEEDBACK_PRIORITY.HIGH,
        duration: 6000,
        animation: FEEDBACK_ANIMATIONS.BOUNCE,
        sound: 'achievement',
        vibration: [200, 100, 200, 100, 200]
      },

      // BİLGİ MESAJLARI
      [FEEDBACK_TYPES.PARTNER_JOINED]: {
        title: 'Partner Katıldı',
        message: 'Partneriniz odaya katıldı!',
        icon: '👫',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 4000,
        animation: FEEDBACK_ANIMATIONS.SLIDE,
        sound: 'info'
      },

      [FEEDBACK_TYPES.PARTNER_ACTIVITY]: {
        title: 'Partner Aktivitesi',
        message: 'Partneriniz aktif! Sen de katıl!',
        icon: '💪',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 4000,
        animation: FEEDBACK_ANIMATIONS.PULSE
      },

      [FEEDBACK_TYPES.DAILY_REMINDER]: {
        title: 'Günlük Hatırlatıcı',
        message: 'Bugün henüz poop yapmadınız! Hadi başlayın!',
        icon: '⏰',
        level: FEEDBACK_LEVELS.POPUP,
        priority: FEEDBACK_PRIORITY.HIGH,
        duration: 8000,
        animation: FEEDBACK_ANIMATIONS.PULSE,
        sound: 'reminder',
        actions: [
          { id: 'start_poop', label: 'Poop Yap', primary: true },
          { id: 'remind_later', label: 'Daha Sonra Hatırlat' }
        ]
      },

      [FEEDBACK_TYPES.MOTIVATION_MESSAGE]: {
        title: 'Motivasyon',
        message: 'Sen harikasın! Bugün de mükemmel gidiyorsun!',
        icon: '⭐',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 5000,
        animation: FEEDBACK_ANIMATIONS.FADE,
        sound: 'motivation'
      },

      // UYARI MESAJLARI
      [FEEDBACK_TYPES.LOW_BATTERY]: {
        title: 'Düşük Pil',
        message: 'Pil seviyeniz düşük. Şarj cihazınızı takın.',
        icon: '🔋',
        level: FEEDBACK_LEVELS.BANNER,
        priority: FEEDBACK_PRIORITY.HIGH,
        persistent: true,
        animation: FEEDBACK_ANIMATIONS.PULSE,
        sound: 'warning'
      },

      [FEEDBACK_TYPES.OFFLINE_MODE]: {
        title: 'Çevrimdışı Mod',
        message: 'İnternet bağlantısı yok. Çevrimdışı modda çalışıyorsunuz.',
        icon: '📡',
        level: FEEDBACK_LEVELS.BANNER,
        priority: FEEDBACK_PRIORITY.HIGH,
        persistent: true,
        animation: FEEDBACK_ANIMATIONS.PULSE
      },

      [FEEDBACK_TYPES.STORAGE_FULL]: {
        title: 'Depolama Dolu',
        message: 'Cihazınızda yeterli alan yok. Bazı veriler silinebilir.',
        icon: '💾',
        level: FEEDBACK_LEVELS.MODAL,
        priority: FEEDBACK_PRIORITY.URGENT,
        actions: [
          { id: 'cleanup', label: 'Temizle', primary: true },
          { id: 'ignore', label: 'Yoksay' }
        ]
      },

      [FEEDBACK_TYPES.UPDATE_AVAILABLE]: {
        title: 'Güncelleme Mevcut',
        message: 'Yeni bir güncelleme var. Şimdi güncellemek ister misiniz?',
        icon: '🔄',
        level: FEEDBACK_LEVELS.POPUP,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 10000,
        actions: [
          { id: 'update', label: 'Güncelle', primary: true },
          { id: 'later', label: 'Daha Sonra' }
        ]
      },

      // SİSTEM MESAJLARI
      [FEEDBACK_TYPES.SYNC_STARTED]: {
        title: 'Senkronizasyon',
        message: 'Verileriniz senkronize ediliyor...',
        icon: '🔄',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.LOW,
        duration: 2000,
        animation: FEEDBACK_ANIMATIONS.PULSE
      },

      [FEEDBACK_TYPES.SYNC_COMPLETED]: {
        title: 'Senkronizasyon Tamamlandı',
        message: 'Tüm verileriniz başarıyla senkronize edildi.',
        icon: '✅',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.NORMAL,
        duration: 3000,
        animation: FEEDBACK_ANIMATIONS.FADE,
        sound: 'success'
      },

      [FEEDBACK_TYPES.SYNC_FAILED]: {
        title: 'Senkronizasyon Hatası',
        message: 'Verileriniz senkronize edilemedi. Tekrar deneyin.',
        icon: '❌',
        level: FEEDBACK_LEVELS.TOAST,
        priority: FEEDBACK_PRIORITY.HIGH,
        duration: 5000,
        animation: FEEDBACK_ANIMATIONS.SHAKE,
        sound: 'error'
      }
    };
  }

  // Ana feedback gösterim fonksiyonu
  show(type, customData = {}, options = {}) {
    if (!this.settings.enabled) {
      return null;
    }

    const template = this.templates[type];
    if (!template) {
      console.warn(`Feedback template not found: ${type}`);
      return null;
    }

    // Custom data ile template'i birleştir
    const config = {
      ...template,
      ...options,
      data: { ...template.data, ...customData },
      id: Date.now() + Math.random(),
      createdAt: new Date()
    };

    // Cihaz özelliklerine göre ayarla
    this.adaptToDevice(config);

    // Kuyruğa ekle
    this.addToQueue(config);

    // Kuyruğu işle
    this.processQueue();

    return config.id;
  }

  // Cihaz özelliklerine göre feedback'i ayarla
  adaptToDevice(config) {
    if (this.deviceInfo.isMobile) {
      // Mobil cihazlarda daha kısa mesajlar
      if (config.message && config.message.length > 50) {
        config.message = config.message.substring(0, 47) + '...';
      }
      
      // Mobil cihazlarda daha kısa süre
      if (config.duration > 3000) {
        config.duration = 3000;
      }
      
      // Mobil cihazlarda daha az animasyon
      if (config.animation === FEEDBACK_ANIMATIONS.BOUNCE) {
        config.animation = FEEDBACK_ANIMATIONS.FADE;
      }
    }

    // Titreşim desteği yoksa kapat
    if (!this.deviceInfo.hasVibration) {
      config.vibration = null;
    }

    // Ses desteği yoksa kapat
    if (!this.deviceInfo.hasAudio) {
      config.sound = null;
    }
  }

  // Kuyruğa ekle (öncelik sırasına göre)
  addToQueue(config) {
    // Aynı tipte ve benzer içerikli feedback varsa, eskisini kaldır
    const existingIndex = this.queue.findIndex(f => 
      f.type === config.type && 
      f.message === config.message &&
      Date.now() - f.createdAt.getTime() < 10000 // 10 saniye içinde
    );
    
    if (existingIndex !== -1) {
      this.queue.splice(existingIndex, 1);
    }

    // Öncelik sırasına göre ekle
    let inserted = false;
    for (let i = 0; i < this.queue.length; i++) {
      if (config.priority > this.queue[i].priority) {
        this.queue.splice(i, 0, config);
        inserted = true;
        break;
      }
    }
    
    if (!inserted) {
      this.queue.push(config);
    }
  }

  // Kuyruğu işle
  async processQueue() {
    if (this.isProcessing || this.activeFeedbacks.length >= this.settings.maxConcurrent) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0 && this.activeFeedbacks.length < this.settings.maxConcurrent) {
      const feedback = this.queue.shift();
      await this.showFeedback(feedback);
    }

    this.isProcessing = false;
  }

  // Feedback göster
  async showFeedback(feedback) {
    this.activeFeedbacks.push(feedback);

    // Ses çal
    if (feedback.sound && this.settings.enableSound) {
      this.playSound(feedback.sound);
    }

    // Titreşim
    if (feedback.vibration && this.settings.enableVibration) {
      this.triggerVibration(feedback.vibration);
    }

    // Screen reader'a duyur
    this.announceToScreenReader(feedback.message);

    // Seviyeye göre gösterim
    let feedbackId;
    switch (feedback.level) {
      case FEEDBACK_LEVELS.TOAST:
        feedbackId = this.showToast(feedback);
        break;
      case FEEDBACK_LEVELS.POPUP:
        feedbackId = this.showPopup(feedback);
        break;
      case FEEDBACK_LEVELS.MODAL:
        feedbackId = this.showModal(feedback);
        break;
      case FEEDBACK_LEVELS.BANNER:
        feedbackId = this.showBanner(feedback);
        break;
      case FEEDBACK_LEVELS.INLINE:
        feedbackId = this.showInline(feedback);
        break;
      default:
        feedbackId = this.showToast(feedback);
    }

    // Otomatik kapatma
    if (feedback.duration && feedback.duration > 0 && !feedback.persistent) {
      setTimeout(() => {
        this.closeFeedback(feedback.id);
      }, feedback.duration);
    }

    return feedbackId;
  }

  // Toast gösterimi
  showToast(feedback) {
    const notificationType = this.getNotificationType(feedback.type);
    return showNotification(
      feedback.message,
      notificationType,
      feedback.duration
    );
  }

  // Popup gösterimi
  showPopup(feedback) {
    return createPopup({
      type: this.getPopupType(feedback.type),
      title: feedback.title,
      message: feedback.message,
      icon: feedback.icon,
      duration: feedback.duration,
      actions: feedback.actions,
      onAction: feedback.onAction,
      data: feedback.data
    });
  }

  // Modal gösterimi (gelecekte implement edilecek)
  showModal(feedback) {
    console.log('Modal feedback:', feedback);
    // Modal implementasyonu burada olacak
    return feedback.id;
  }

  // Banner gösterimi (gelecekte implement edilecek)
  showBanner(feedback) {
    console.log('Banner feedback:', feedback);
    // Banner implementasyonu burada olacak
    return feedback.id;
  }

  // Inline gösterimi (gelecekte implement edilecek)
  showInline(feedback) {
    console.log('Inline feedback:', feedback);
    // Inline implementasyonu burada olacak
    return feedback.id;
  }

  // Feedback kapat
  closeFeedback(feedbackId) {
    const index = this.activeFeedbacks.findIndex(f => f.id === feedbackId);
    if (index !== -1) {
      this.activeFeedbacks.splice(index, 1);
    }
    
    // Kuyruğu tekrar işle
    setTimeout(() => this.processQueue(), 100);
  }

  // Tüm feedback'leri kapat
  closeAllFeedbacks() {
    this.activeFeedbacks = [];
    this.queue = [];
    closeAllPopups();
    clearAllNotifications();
  }

  // Tip dönüşümleri
  getNotificationType(feedbackType) {
    const typeMap = {
      [FEEDBACK_TYPES.ROOM_FULL]: NOTIFICATION_TYPES.WARNING,
      [FEEDBACK_TYPES.ROOM_NOT_FOUND]: NOTIFICATION_TYPES.ERROR,
      [FEEDBACK_TYPES.NETWORK_ERROR]: NOTIFICATION_TYPES.ERROR,
      [FEEDBACK_TYPES.AUTH_ERROR]: NOTIFICATION_TYPES.ERROR,
      [FEEDBACK_TYPES.ROOM_JOINED]: NOTIFICATION_TYPES.SUCCESS,
      [FEEDBACK_TYPES.ROOM_CREATED]: NOTIFICATION_TYPES.SUCCESS,
      [FEEDBACK_TYPES.POOP_ADDED]: NOTIFICATION_TYPES.SUCCESS,
      [FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED]: NOTIFICATION_TYPES.ACHIEVEMENT,
      [FEEDBACK_TYPES.PARTNER_JOINED]: NOTIFICATION_TYPES.INFO,
      [FEEDBACK_TYPES.DAILY_REMINDER]: NOTIFICATION_TYPES.INFO,
      [FEEDBACK_TYPES.MOTIVATION_MESSAGE]: NOTIFICATION_TYPES.INFO
    };
    return typeMap[feedbackType] || NOTIFICATION_TYPES.INFO;
  }

  getPopupType(feedbackType) {
    const typeMap = {
      [FEEDBACK_TYPES.ROOM_FULL]: POPUP_TYPES.WARNING,
      [FEEDBACK_TYPES.ROOM_NOT_FOUND]: POPUP_TYPES.ERROR,
      [FEEDBACK_TYPES.NETWORK_ERROR]: POPUP_TYPES.ERROR,
      [FEEDBACK_TYPES.AUTH_ERROR]: POPUP_TYPES.ERROR,
      [FEEDBACK_TYPES.ROOM_JOINED]: POPUP_TYPES.SUCCESS,
      [FEEDBACK_TYPES.ROOM_CREATED]: POPUP_TYPES.SUCCESS,
      [FEEDBACK_TYPES.POOP_ADDED]: POPUP_TYPES.SUCCESS,
      [FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED]: POPUP_TYPES.ACHIEVEMENT,
      [FEEDBACK_TYPES.PARTNER_JOINED]: POPUP_TYPES.INFO,
      [FEEDBACK_TYPES.DAILY_REMINDER]: POPUP_TYPES.DAILY_REMINDER,
      [FEEDBACK_TYPES.MOTIVATION_MESSAGE]: POPUP_TYPES.MOTIVATION
    };
    return typeMap[feedbackType] || POPUP_TYPES.INFO;
  }

  // Ses çal
  playSound(soundType) {
    if (!this.settings.enableSound || !this.deviceInfo.hasAudio) {
      return;
    }

    // FeedbackSoundService kullan
    feedbackSoundService.play(soundType);
  }

  // Titreşim
  triggerVibration(pattern) {
    if (!this.settings.enableVibration || !this.deviceInfo.hasVibration) {
      return;
    }

    try {
      navigator.vibrate(pattern);
    } catch (error) {
      console.log('Titreşim desteklenmiyor:', error);
    }
  }

  // Screen reader'a duyur
  announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = message;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.top = '-10000px';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement);
      }
    }, 1000);
  }

  // Ayarları güncelle
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Ses servisi ayarlarını güncelle
    if (newSettings.enableSound !== undefined) {
      feedbackSoundService.setEnabled(newSettings.enableSound);
    }
    
    if (newSettings.soundVolume !== undefined) {
      feedbackSoundService.setVolume(newSettings.soundVolume);
    }
    
    // LocalStorage'a kaydet
    try {
      localStorage.setItem('feedbackSettings', JSON.stringify(this.settings));
    } catch (error) {
      console.log('Ayarlar kaydedilemedi:', error);
    }
  }

  // Ayarları yükle
  loadSettings() {
    try {
      const savedSettings = localStorage.getItem('feedbackSettings');
      if (savedSettings) {
        this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.log('Ayarlar yüklenemedi:', error);
    }
  }

  // Template ekle/güncelle
  addTemplate(type, template) {
    this.templates[type] = template;
  }

  // İstatistikleri al
  getStats() {
    return {
      active: this.activeFeedbacks.length,
      queued: this.queue.length,
      maxConcurrent: this.settings.maxConcurrent,
      settings: this.settings,
      deviceInfo: this.deviceInfo
    };
  }
}

// Singleton instance
const feedbackManager = new FeedbackManager();

// Ayarları yükle
feedbackManager.loadSettings();

// Export edilecek fonksiyonlar
export const showFeedback = (type, customData, options) => 
  feedbackManager.show(type, customData, options);

export const updateFeedbackSettings = (settings) => 
  feedbackManager.updateSettings(settings);

export const addFeedbackTemplate = (type, template) => 
  feedbackManager.addTemplate(type, template);

export const closeFeedback = (feedbackId) => 
  feedbackManager.closeFeedback(feedbackId);

export const closeAllFeedbacks = () => 
  feedbackManager.closeAllFeedbacks();

export const getFeedbackStats = () => 
  feedbackManager.getStats();

// Kısayol fonksiyonları
export const showRoomFull = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.ROOM_FULL, {}, options);

export const showRoomCapacityFull = (currentUsers, maxUsers, options = {}) => 
  showFeedback(FEEDBACK_TYPES.ROOM_CAPACITY_FULL, { currentUsers, maxUsers }, options);

export const showRoomNotFound = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.ROOM_NOT_FOUND, {}, options);

export const showNetworkError = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.NETWORK_ERROR, {}, options);

export const showAuthError = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.AUTH_ERROR, {}, options);

export const showRoomJoined = (roomName, options = {}) => 
  showFeedback(FEEDBACK_TYPES.ROOM_JOINED, { roomName }, options);

export const showRoomCreated = (roomName, options = {}) => 
  showFeedback(FEEDBACK_TYPES.ROOM_CREATED, { roomName }, options);

export const showPoopAdded = (count, options = {}) => 
  showFeedback(FEEDBACK_TYPES.POOP_ADDED, { count }, options);

export const showCharacterReady = (characterName, options = {}) => 
  showFeedback(FEEDBACK_TYPES.CHARACTER_READY, { characterName }, options);

export const showAchievementUnlocked = (achievement, options = {}) => 
  showFeedback(FEEDBACK_TYPES.ACHIEVEMENT_UNLOCKED, { achievement }, options);

export const showPartnerJoined = (partnerName, options = {}) => 
  showFeedback(FEEDBACK_TYPES.PARTNER_JOINED, { partnerName }, options);

export const showDailyReminder = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.DAILY_REMINDER, {}, options);

export const showMotivationMessage = (message, options = {}) => 
  showFeedback(FEEDBACK_TYPES.MOTIVATION_MESSAGE, { message }, options);

export const showSyncStarted = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.SYNC_STARTED, {}, options);

export const showSyncCompleted = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.SYNC_COMPLETED, {}, options);

export const showSyncFailed = (options = {}) => 
  showFeedback(FEEDBACK_TYPES.SYNC_FAILED, {}, options);

// Default export
export default feedbackManager;
