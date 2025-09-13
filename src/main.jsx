import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Ana service worker'ı kaydet
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully');
        
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
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)