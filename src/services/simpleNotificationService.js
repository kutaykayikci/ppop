// Basit toast notification sistemi
let notifications = [];
let notificationId = 0;

// Notification tipi
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  ACHIEVEMENT: 'achievement'
};

// Notification göster
export const showNotification = (message, type = NOTIFICATION_TYPES.INFO, duration = 4000) => {
  const id = ++notificationId;
  const notification = {
    id,
    message,
    type,
    timestamp: Date.now()
  };

  notifications.push(notification);
  
  // Console'da göster (geliştirme için)
  const emoji = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
    achievement: '🏆'
  }[type] || 'ℹ️';
  
  console.log(`${emoji} ${message}`);

  // DOM'da basit toast göster
  showToast(notification, duration);

  // Belirli süre sonra temizle
  setTimeout(() => {
    removeNotification(id);
  }, duration);

  return id;
};

// Basit toast UI (DOM manipulation)
const showToast = (notification, duration) => {
  // Toast container oluştur/getir
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  // Toast elementi oluştur
  const toast = document.createElement('div');
  toast.id = `toast-${notification.id}`;
  toast.style.cssText = `
    background: ${getToastColor(notification.type)};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    border: 2px solid #333;
    font-family: 'Press Start 2P', monospace;
    font-size: 10px;
    max-width: 300px;
    word-wrap: break-word;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    transform: translateX(100%);
    transition: transform 0.3s ease;
    pointer-events: auto;
  `;
  
  toast.textContent = notification.message;
  container.appendChild(toast);

  // Animasyon
  setTimeout(() => {
    toast.style.transform = 'translateX(0)';
  }, 10);

  // Kaldırma animasyonu
  setTimeout(() => {
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, duration - 300);
};

// Toast rengi
const getToastColor = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS: return '#00b894';
    case NOTIFICATION_TYPES.ERROR: return '#e74c3c';
    case NOTIFICATION_TYPES.WARNING: return '#f39c12';
    case NOTIFICATION_TYPES.ACHIEVEMENT: return '#9b59b6';
    default: return '#3498db';
  }
};

// Notification kaldır
const removeNotification = (id) => {
  notifications = notifications.filter(n => n.id !== id);
};

// Tüm notifications'ları temizle
export const clearAllNotifications = () => {
  notifications = [];
  const container = document.getElementById('toast-container');
  if (container) {
    container.innerHTML = '';
  }
};

// Shortcut functions
export const showSuccess = (message, duration) => 
  showNotification(message, NOTIFICATION_TYPES.SUCCESS, duration);

export const showError = (message, duration) => 
  showNotification(message, NOTIFICATION_TYPES.ERROR, duration);

export const showInfo = (message, duration) => 
  showNotification(message, NOTIFICATION_TYPES.INFO, duration);

export const showWarning = (message, duration) => 
  showNotification(message, NOTIFICATION_TYPES.WARNING, duration);

export const showAchievement = (achievement) => 
  showNotification(
    `${achievement.icon} ${achievement.title}: ${achievement.description}`, 
    NOTIFICATION_TYPES.ACHIEVEMENT, 
    6000
  );

// Room notification helpers
export const notifyRoomJoined = (roomName, userName) => 
  showInfo(`${userName} ${roomName} odasina katildi`);

export const notifyCharacterReady = (userName) => 
  showInfo(`${userName} karakterini tamamladi`);

export const notifyRoomFull = () => 
  showWarning('Oda dolu! Maksimum 5 kisi katilabilir');

export const notifyPoopAdded = (count) => {
  // Poop eklendi bildirimi
  showSuccess(`💩 Poop eklendi! Toplam: ${count}`, 2000);
};

// Mevcut notifications'ları getir
export const getNotifications = () => [...notifications];
