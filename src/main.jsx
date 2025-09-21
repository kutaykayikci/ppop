import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import './index.css'
import './styles/themeEffects.css'

// Console spam'i sustur
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
  const message = args.join(' ');
  if (message.includes('Download the React DevTools') || 
      message.includes('Service Worker') ||
      message.includes('Banner not shown') ||
      message.includes('Unchecked runtime.lastError') ||
      message.includes('Loaded successfully') ||
      message.includes('Version v') ||
      message.includes('🏆') ||
      message.includes('Yeni basarim') ||
      message.includes('basarim:')) {
    return;
  }
  originalConsoleLog.apply(console, args);
};

console.error = (...args) => {
  const message = args.join(' ');
  if (message.includes('Firebase') || 
      message.includes('identitytoolkit.googleapis.com') ||
      message.includes('Failed to fetch') ||
      message.includes('Achievement/Notification kontrol hatasi') ||
      message.includes('SyntaxError') ||
      message.includes('message port closed') ||
      message.includes('asynchronous response') ||
      message.includes('listener indicated')) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args) => {
  const message = args.join(' ');
  if (message.includes('React DevTools') ||
      message.includes('Service Worker') ||
      message.includes('Banner not shown') ||
      message.includes('beforeinstallpromptevent') ||
      message.includes('runtime.lastError') ||
      message.includes('Encountered two children with the same key') ||
      message.includes('Keys should be unique') ||
      message.includes('Warning:')) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Service Worker Registration with Cache Busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Tek Service Worker kaydı
    navigator.serviceWorker.register('/sw.js', {
      updateViaCache: 'none' // SW dosyasını cache'leme
    })
      .then((registration) => {
        
        // Güncelleme kontrolü
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Yeni SW yüklendi, kullanıcıya bildir
              showUpdateNotification();
            }
          });
        });
        return registration;
      })
      .catch((error) => {
        // Service Worker registration failed - sessizce yakala
      });
  });

  // SW mesajlarını dinle
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'SW_UPDATED') {
      // Cache'i temizle
      clearCache();
    }
    
    if (event.data.type === 'FORCE_RELOAD') {
      window.location.reload(true);
    }
  });
}

// Otomatik güncelleme - kullanıcıya sormadan
function showUpdateNotification() {
  // Arka planda otomatik cache temizleme ve güncelleme
  clearCache().then(() => {
    window.location.reload(true);
  });
}

// Cache temizleme fonksiyonu
function clearCache() {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        resolve();
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    } else {
      resolve();
    }
  });
}

// Sayfa yüklendiğinde otomatik cache kontrolü
window.addEventListener('load', () => {
  // Her sayfa yüklenişinde cache'i kontrol et ve temizle
  setTimeout(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      // SW'den versiyon bilgisini al
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        const currentVersion = event.data.version;
        const storedVersion = localStorage.getItem('sw_version');
        
        // Versiyon değişmişse cache'i temizle
        if (storedVersion && storedVersion !== currentVersion) {
          clearCache().then(() => {
            localStorage.setItem('sw_version', currentVersion);
          });
        } else if (!storedVersion) {
          localStorage.setItem('sw_version', currentVersion);
        }
      };
      
      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    }
  }, 1000);
});

// Sayfa kapanırken cache'i temizle
window.addEventListener('beforeunload', () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
  }
});

// Debug için (geliştiriciler için)
if (process.env.NODE_ENV === 'development') {
  window.clearAppCache = clearCache;
  window.forceUpdate = () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'FORCE_UPDATE' });
    }
  };
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// A2HS (Add to Home Screen) - Custom prompt via popup
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const key = 'a2hs_prompt_shown';
  if (localStorage.getItem(key)) return;
  localStorage.setItem(key, '1');
  import('@/services/popupManagerService').then(({ createPopup, POPUP_TYPES }) => {
    createPopup({
      type: POPUP_TYPES.INFO,
      title: '📱 Uygulamayı Yükle',
      message: 'Ana ekrana ekleyerek daha hızlı erişin.',
      actions: [
        { id: 'install', label: 'Yükle', data: {}, closeOnClick: true },
        { id: 'later', label: 'Daha Sonra', data: {}, closeOnClick: true }
      ],
      onAction: async (id) => {
        if (id === 'install' && deferredPrompt) {
          try {
            const { outcome } = await deferredPrompt.prompt();
            console.log('PWA installation outcome:', outcome);
            deferredPrompt = null;
          } catch (error) {
            console.error('PWA installation error:', error);
            deferredPrompt = null;
          }
        }
      }
    })
  })
})

// Notification strategy weekly summary (local-only)
import('@/services/notificationStrategyService').then(({ scheduleWeeklySummary }) => {
  try { scheduleWeeklySummary(); } catch {}
})