// Cache temizleme script'i
console.log('🧹 Cache temizleniyor...');

// Service Worker'ı yeniden kaydet
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker kaldırıldı:', registration);
    }
  });
}

// LocalStorage temizle
try {
  const keysToKeep = ['userId', 'roomId', 'characterId'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
      localStorage.removeItem(key);
      console.log('LocalStorage temizlendi:', key);
    }
  });
} catch (error) {
  console.error('LocalStorage temizleme hatası:', error);
}

// SessionStorage temizle
try {
  sessionStorage.clear();
  console.log('SessionStorage temizlendi');
} catch (error) {
  console.error('SessionStorage temizleme hatası:', error);
}

// IndexedDB temizle (varsa)
if ('indexedDB' in window) {
  try {
    indexedDB.databases().then(databases => {
      databases.forEach(db => {
        indexedDB.deleteDatabase(db.name);
        console.log('IndexedDB temizlendi:', db.name);
      });
    });
  } catch (error) {
    console.error('IndexedDB temizleme hatası:', error);
  }
}

console.log('✅ Cache temizleme tamamlandı! Sayfayı yenileyin.');
