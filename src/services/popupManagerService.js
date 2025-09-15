import AnimatedPopup from '../components/Notification/AnimatedPopup';
import AchievementNotification from '../components/Achievement/AchievementNotification';
import MotivationMessage from '../components/Motivation/MotivationMessage';

// Popup kuyruğu
let popupQueue = [];
let activePopups = [];
let isProcessing = false;

// Popup ayarları
let popupSettings = {
  enabled: true,
  sound: true,
  duration: 5000,
  maxConcurrent: 3,
  position: 'top-right',
  types: {
    achievement: true,
    motivation: true,
    partner: true,
    daily_reminder: true,
    room_activity: true,
    character_update: true,
    success: true,
    warning: true,
    error: true,
    info: true
  }
};

// Maksimum eş zamanlı popup sayısı
const MAX_CONCURRENT_POPUPS = popupSettings.maxConcurrent;

// Popup tipleri
export const POPUP_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
  PARTNER: 'partner',
  ACHIEVEMENT: 'achievement',
  MOTIVATION: 'motivation',
  DAILY_REMINDER: 'daily_reminder',
  ROOM_ACTIVITY: 'room_activity',
  CHARACTER_UPDATE: 'character_update'
};

// Popup öncelik seviyeleri
export const POPUP_PRIORITY = {
  LOW: 1,
  NORMAL: 2,
  HIGH: 3,
  URGENT: 4
};

// Popup konfigürasyonları
const POPUP_CONFIGS = {
  [POPUP_TYPES.SUCCESS]: {
    icon: '✅',
    duration: 3000,
    priority: POPUP_PRIORITY.NORMAL
  },
  [POPUP_TYPES.WARNING]: {
    icon: '⚠️',
    duration: 4000,
    priority: POPUP_PRIORITY.HIGH
  },
  [POPUP_TYPES.ERROR]: {
    icon: '❌',
    duration: 5000,
    priority: POPUP_PRIORITY.HIGH
  },
  [POPUP_TYPES.INFO]: {
    icon: 'ℹ️',
    duration: 3000,
    priority: POPUP_PRIORITY.NORMAL
  },
  [POPUP_TYPES.PARTNER]: {
    icon: '💕',
    duration: 4000,
    priority: POPUP_PRIORITY.HIGH
  },
  [POPUP_TYPES.ACHIEVEMENT]: {
    icon: '🏆',
    duration: 5000,
    priority: POPUP_PRIORITY.HIGH
  },
  [POPUP_TYPES.MOTIVATION]: {
    icon: '💪',
    duration: 4000,
    priority: POPUP_PRIORITY.NORMAL
  },
  [POPUP_TYPES.DAILY_REMINDER]: {
    icon: '⏰',
    duration: 6000,
    priority: POPUP_PRIORITY.HIGH
  },
  [POPUP_TYPES.ROOM_ACTIVITY]: {
    icon: '🏠',
    duration: 3500,
    priority: POPUP_PRIORITY.NORMAL
  },
  [POPUP_TYPES.CHARACTER_UPDATE]: {
    icon: '👤',
    duration: 3000,
    priority: POPUP_PRIORITY.NORMAL
  }
};

// Popup ayarlarını güncelle
export const updatePopupSettings = (newSettings) => {
  popupSettings = { ...popupSettings, ...newSettings };
  // Global olarak erişilebilir yap
  if (typeof window !== 'undefined') {
    window.popupManager = { updateSettings: updatePopupSettings };
  }
};

// Popup oluştur
export const createPopup = (config) => {
  // Popup'lar devre dışıysa hiçbir şey yapma
  if (!popupSettings.enabled) {
    return null;
  }

  const {
    type = POPUP_TYPES.INFO,
    title,
    message,
    icon,
    duration,
    priority = POPUP_PRIORITY.NORMAL,
    data = {},
    onClose,
    onAction,
    actions = []
  } = config;

  // Bu tip popup devre dışıysa hiçbir şey yapma
  if (!popupSettings.types[type]) {
    return null;
  }

  const popupConfig = POPUP_CONFIGS[type] || POPUP_CONFIGS[POPUP_TYPES.INFO];
  
  const popup = {
    id: Date.now() + Math.random(),
    type,
    title,
    message,
    icon: icon || popupConfig.icon,
    duration: duration || popupSettings.duration,
    priority,
    data,
    onClose,
    onAction,
    actions,
    createdAt: new Date(),
    position: calculatePosition(),
    sound: popupSettings.sound
  };

  // Kuyruğa ekle
  addToQueue(popup);
  
  // Kuyruğu işle
  processQueue();
  
  return popup.id;
};

// Kuyruğa ekle (öncelik sırasına göre)
const addToQueue = (popup) => {
  // Aynı tipte ve benzer içerikli popup varsa, eskisini kaldır
  const existingIndex = popupQueue.findIndex(p => 
    p.type === popup.type && 
    p.message === popup.message &&
    Date.now() - p.createdAt.getTime() < 10000 // 10 saniye içinde
  );
  
  if (existingIndex !== -1) {
    popupQueue.splice(existingIndex, 1);
  }

  // Öncelik sırasına göre ekle
  let inserted = false;
  for (let i = 0; i < popupQueue.length; i++) {
    if (popup.priority > popupQueue[i].priority) {
      popupQueue.splice(i, 0, popup);
      inserted = true;
      break;
    }
  }
  
  if (!inserted) {
    popupQueue.push(popup);
  }
};

// Kuyruğu işle
const processQueue = async () => {
  if (isProcessing || activePopups.length >= popupSettings.maxConcurrent) {
    return;
  }

  isProcessing = true;

  while (popupQueue.length > 0 && activePopups.length < popupSettings.maxConcurrent) {
    const popup = popupQueue.shift();
    await showPopup(popup);
  }

  isProcessing = false;
};

// Popup göster
const showPopup = (popup) => {
  return new Promise((resolve) => {
    activePopups.push(popup);

    const handleClose = () => {
      const index = activePopups.findIndex(p => p.id === popup.id);
      if (index !== -1) {
        activePopups.splice(index, 1);
      }
      
      if (popup.onClose) {
        popup.onClose();
      }
      
      resolve();
      
      // Kuyruğu tekrar işle
      setTimeout(() => processQueue(), 100);
    };

    // Popup tipine göre render et
    renderPopup(popup, handleClose);
  });
};

// Popup render et
const renderPopup = (popup, onClose) => {
  const container = document.getElementById('popup-container') || createPopupContainer();

  switch (popup.type) {
    case POPUP_TYPES.ACHIEVEMENT:
      renderAchievementPopup(popup, onClose, container);
      break;
    case POPUP_TYPES.MOTIVATION:
      renderMotivationPopup(popup, onClose, container);
      break;
    default:
      renderAnimatedPopup(popup, onClose, container);
      break;
  }
};

// AnimatedPopup render et
const renderAnimatedPopup = (popup, onClose, container) => {
  const popupElement = document.createElement('div');
  popupElement.id = `popup-${popup.id}`;
  
  // React render için gerekli
  import('react-dom/client').then(({ createRoot }) => {
    import('react').then(React => {
      const root = createRoot(popupElement);
      root.render(
        React.createElement(AnimatedPopup, {
          title: popup.title,
          message: popup.message,
          icon: popup.icon,
          type: popup.type,
          duration: popup.duration,
          position: popup.position,
          sound: popup.sound,
          actions: popup.actions,
          onAction: popup.onAction,
          onClose,
          show: true
        })
      );
      container.appendChild(popupElement);
    });
  });
};

// Achievement popup render et
const renderAchievementPopup = (popup, onClose, container) => {
  const popupElement = document.createElement('div');
  popupElement.id = `popup-${popup.id}`;
  
  import('react-dom/client').then(({ createRoot }) => {
    import('react').then(React => {
      const root = createRoot(popupElement);
      root.render(
        React.createElement(AchievementNotification, {
          achievement: popup.data.achievement,
          onClose
        })
      );
      container.appendChild(popupElement);
    });
  });
};

// Motivation popup render et
const renderMotivationPopup = (popup, onClose, container) => {
  const popupElement = document.createElement('div');
  popupElement.id = `popup-${popup.id}`;
  
  import('react-dom/client').then(({ createRoot }) => {
    import('react').then(React => {
      const root = createRoot(popupElement);
      root.render(
        React.createElement(MotivationMessage, {
          message: popup.message,
          type: popup.data.motivationType || 'general',
          duration: popup.duration,
          onClose
        })
      );
      container.appendChild(popupElement);
    });
  });
};

// Popup konteyner oluştur
const createPopupContainer = () => {
  const container = document.createElement('div');
  container.id = 'popup-container';
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 10000;
  `;
  document.body.appendChild(container);
  return container;
};

// Popup pozisyonu hesapla
const calculatePosition = () => {
  const positions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
  const occupiedPositions = activePopups.map(p => p.position);
  const preferredPosition = popupSettings.position;
  
  // Önce tercih edilen pozisyonu dene
  if (!occupiedPositions.includes(preferredPosition)) {
    return preferredPosition;
  }
  
  // Sonra diğer pozisyonları dene
  return positions.find(pos => !occupiedPositions.includes(pos)) || preferredPosition;
};

// Popup kapat
export const closePopup = (popupId) => {
  const popup = activePopups.find(p => p.id === popupId);
  if (popup) {
    const element = document.getElementById(`popup-${popupId}`);
    if (element) {
      element.remove();
    }
    const index = activePopups.findIndex(p => p.id === popupId);
    if (index !== -1) {
      activePopups.splice(index, 1);
    }
  }
};

// Tüm popup'ları kapat
export const closeAllPopups = () => {
  activePopups.forEach(popup => closePopup(popup.id));
  popupQueue = [];
};

// Popup istatistikleri
export const getPopupStats = () => {
  return {
    active: activePopups.length,
    queued: popupQueue.length,
    maxConcurrent: MAX_CONCURRENT_POPUPS
  };
};

// Önceden tanımlanmış popup'lar
export const showSuccessPopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.SUCCESS,
    title,
    message,
    ...options
  });
};

export const showWarningPopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.WARNING,
    title,
    message,
    ...options
  });
};

export const showErrorPopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.ERROR,
    title,
    message,
    ...options
  });
};

export const showInfoPopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.INFO,
    title,
    message,
    ...options
  });
};

export const showPartnerPopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.PARTNER,
    title,
    message,
    ...options
  });
};

export const showAchievementPopup = (achievement, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.ACHIEVEMENT,
    title: 'Yeni Başarı!',
    message: achievement.name,
    data: { achievement },
    ...options
  });
};

export const showMotivationPopup = (message, type = 'general', options = {}) => {
  return createPopup({
    type: POPUP_TYPES.MOTIVATION,
    message,
    data: { motivationType: type },
    ...options
  });
};

export const showDailyReminderPopup = (message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.DAILY_REMINDER,
    title: 'Günlük Hatırlatıcı',
    message,
    ...options
  });
};

export const showRoomActivityPopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.ROOM_ACTIVITY,
    title,
    message,
    ...options
  });
};

export const showCharacterUpdatePopup = (title, message, options = {}) => {
  return createPopup({
    type: POPUP_TYPES.CHARACTER_UPDATE,
    title,
    message,
    ...options
  });
};

// Popup ayarlarını al
export const getPopupSettings = () => {
  return { ...popupSettings };
};

// Popup istatistikleri
// Not: getPopupStats üstte tanımlı. Detaylı istatistik gerekiyorsa yeni isimle ekleyin.
export const getPopupStatsDetailed = () => {
  return {
    active: activePopups.length,
    queued: popupQueue.length,
    maxConcurrent: popupSettings.maxConcurrent,
    settings: popupSettings
  };
};
