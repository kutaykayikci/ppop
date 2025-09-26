import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import './index.css'
import './styles/themeEffects.css'

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// PWA Install Banner Handler
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

// Notification strategy weekly summary
import('@/services/notificationStrategyService').then(({ scheduleWeeklySummary }) => {
  try { scheduleWeeklySummary(); } catch {}
})