import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/themeEffects.css'

// Service Worker Registration with Cache Busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ana service worker'ı kaydet
    navigator.serviceWorker.register('/sw.js', {
      updateViaCache: 'none' // SW dosyasını cache'leme
    })
      .then((registration) => {
        console.log('Service Worker registered successfully');
        
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
        
        // Firebase messaging service worker'ı kaydet
        return navigator.serviceWorker.register('/firebase-messaging-sw.js');
      })
      .then((registration) => {
        console.log('Firebase Messaging Service Worker registered successfully');
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });

  // SW mesajlarını dinle
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data.type === 'SW_UPDATED') {
      console.log('Service Worker updated to version:', event.data.version);
      // Cache'i temizle
      clearCache();
    }
    
    if (event.data.type === 'FORCE_RELOAD') {
      console.log('Force reload requested by Service Worker');
      window.location.reload(true);
    }
  });
}

// Otomatik güncelleme - kullanıcıya sormadan
function showUpdateNotification() {
  // Arka planda otomatik cache temizleme ve güncelleme
  clearCache().then(() => {
    console.log('Cache temizlendi, sayfa yenileniyor...');
    window.location.reload(true);
  });
}

// Cache temizleme fonksiyonu
function clearCache() {
  return new Promise((resolve) => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        console.log('Cache cleared successfully');
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
          console.log('Yeni SW versiyonu tespit edildi, cache temizleniyor...');
          clearCache().then(() => {
            localStorage.setItem('sw_version', currentVersion);
            console.log('Cache temizlendi, versiyon güncellendi');
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