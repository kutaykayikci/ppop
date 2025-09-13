// Push Notification Debug Utility
import { getAllActiveFCMTokens } from '../services/fcmService';
import { checkPushNotificationStatus } from '../services/fcmService';

export const debugPushNotifications = async () => {
  console.log('🔍 Push Notification Debug Başlatılıyor...');
  
  // 1. Browser desteği kontrolü
  console.log('📱 Browser Desteği:');
  console.log('- Notification:', 'Notification' in window);
  console.log('- Service Worker:', 'serviceWorker' in navigator);
  console.log('- Push Manager:', 'PushManager' in window);
  
  // 2. Notification izni kontrolü
  console.log('🔔 Notification İzni:', Notification.permission);
  
  // 3. Service Worker durumu
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('⚙️ Service Worker:', registration);
      console.log('- Active:', registration.active);
      console.log('- Installing:', registration.installing);
      console.log('- Waiting:', registration.waiting);
    } catch (error) {
      console.error('❌ Service Worker hatası:', error);
    }
  }
  
  // 4. FCM Token'ları kontrol et
  try {
    const tokens = await getAllActiveFCMTokens();
    console.log('🎫 FCM Token\'lar:', tokens);
    console.log('- Token sayısı:', tokens.length);
    
    if (tokens.length > 0) {
      tokens.forEach((token, index) => {
        console.log(`Token ${index + 1}:`, {
          id: token.id,
          userId: token.userId,
          roomId: token.roomId,
          characterId: token.characterId,
          createdAt: token.createdAt,
          isActive: token.isActive,
          token: token.token ? `${token.token.substring(0, 20)}...` : 'YOK'
        });
      });
    } else {
      console.warn('⚠️ Hiç FCM token bulunamadı!');
    }
  } catch (error) {
    console.error('❌ FCM Token kontrol hatası:', error);
  }
  
  // 5. Permission status kontrolü
  try {
    const status = checkPushNotificationStatus();
    console.log('📊 Permission Status:', status);
  } catch (error) {
    console.error('❌ Permission status hatası:', error);
  }
  
  // 6. Local Storage kontrolü
  console.log('💾 Local Storage:');
  console.log('- userId:', localStorage.getItem('userId'));
  
  // 7. Test notification gönder
  try {
    if (Notification.permission === 'granted') {
      const testNotification = new Notification('Test Notification', {
        body: 'Bu bir test bildirimidir',
        icon: '/poop-emoji.svg',
        tag: 'test'
      });
      
      setTimeout(() => {
        testNotification.close();
      }, 3000);
      
      console.log('✅ Test notification gönderildi');
    } else {
      console.warn('⚠️ Notification izni verilmemiş, test notification gönderilemedi');
    }
  } catch (error) {
    console.error('❌ Test notification hatası:', error);
  }
  
  console.log('🔍 Push Notification Debug Tamamlandı');
};

// Global olarak erişilebilir yap
window.debugPushNotifications = debugPushNotifications;
