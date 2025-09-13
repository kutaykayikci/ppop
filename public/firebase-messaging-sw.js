// Firebase Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Firebase config - aynı config'i kullanın
const firebaseConfig = {
  apiKey: "AIzaSyB3v0ebnm6HMJTM84vY8IVrSkmfXpZxDw0",
  authDomain: "poopcount-1a556.firebaseapp.com",
  projectId: "poopcount-1a556",
  storageBucket: "poopcount-1a556.firebasestorage.app",
  messagingSenderId: "644753590566",
  appId: "1:644753590566:web:311b83690ceaaa2c9919e7"
};

// Firebase'i initialize et
firebase.initializeApp(firebaseConfig);

// Firebase Messaging instance
const messaging = firebase.messaging();

// Background mesajları dinle
messaging.onBackgroundMessage((payload) => {
  console.log('Background mesaj alındı:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/poop-emoji.svg',
    badge: '/poop-emoji.svg',
    tag: payload.data?.type || 'default',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Aç',
        icon: '/poop-emoji.svg'
      },
      {
        action: 'close',
        title: 'Kapat'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Firebase Messaging Service Worker yüklendi');
