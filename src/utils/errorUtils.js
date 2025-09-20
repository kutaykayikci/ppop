// Firebase hata mesajlarini kullanici dostu mesajlara cevirir
export const getFirebaseErrorMessage = (error) => {
  const errorCode = error?.code || '';
  const errorMessage = error?.message || '';

  // Auth hatalari
  if (errorCode.includes('auth/')) {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Email veya sifre hatali. Lutfen kontrol edin.';
      case 'auth/user-not-found':
        return 'Bu email adresi ile kayitli kullanici bulunamadi.';
      case 'auth/wrong-password':
        return 'Sifre hatali. Lutfen tekrar deneyin.';
      case 'auth/email-already-in-use':
        return 'Bu email adresi zaten kullaniliyor.';
      case 'auth/weak-password':
        return 'Sifre cok zayif. En az 6 karakter olmali.';
      case 'auth/invalid-email':
        return 'Gecersiz email adresi.';
      case 'auth/network-request-failed':
        return 'Baglanti hatasi. Internet baglantisinizi kontrol edin.';
      case 'auth/too-many-requests':
        return 'Cok fazla deneme yapildi. Lutfen daha sonra tekrar deneyin.';
      default:
        return 'Giris yapilirken bir hata olustu. Lutfen tekrar deneyin.';
    }
  }

  // Firestore hatalari
  if (errorCode.includes('firestore/')) {
    switch (errorCode) {
      case 'firestore/permission-denied':
        return 'Bu islemi yapmaya yetkiniz yok.';
      case 'firestore/not-found':
        return 'Aranan veri bulunamadi.';
      case 'firestore/already-exists':
        return 'Bu veri zaten mevcut.';
      case 'firestore/resource-exhausted':
        return 'Cok fazla istek yapildi. Lutfen bekleyin.';
      case 'firestore/cancelled':
        return 'Islem iptal edildi.';
      case 'firestore/data-loss':
        return 'Veri kaybi olustu. Lutfen tekrar deneyin.';
      case 'firestore/deadline-exceeded':
        return 'Islem zaman asimina ugradi. Lutfen tekrar deneyin.';
      case 'firestore/failed-precondition':
        return 'Islem sartlari saglanmiyor.';
      case 'firestore/internal':
        return 'Sunucu hatasi olustu. Lutfen daha sonra tekrar deneyin.';
      case 'firestore/invalid-argument':
        return 'Gecersiz veri girisi.';
      case 'firestore/out-of-range':
        return 'Gecersiz deger araligi.';
      case 'firestore/unauthenticated':
        return 'Once giris yapmaniz gerekiyor.';
      case 'firestore/unavailable':
        return 'Servis suanda kullanilamaz. Lutfen daha sonra tekrar deneyin.';
      case 'firestore/unimplemented':
        return 'Bu ozellik henuz desteklenmiyor.';
      default:
        return 'Veritabani hatasi olustu. Lutfen tekrar deneyin.';
    }
  }

  // Custom app hatalari
  if (errorMessage.includes('Oda dolu')) {
    return 'Bu oda dolu! Maksimum 5 kisi katilabilir.';
  }
  
  if (errorMessage.includes('zaten kullanımda')) {
    return 'Bu oda adi zaten kullaniliyor. Farkli bir isim deneyin.';
  }

  if (errorMessage.includes('Room ID') && errorMessage.includes('bulunamadi')) {
    return 'Oda bulunamadi. Room ID\'yi kontrol edin.';
  }

  if (errorMessage.includes('formatı geçersiz')) {
    return 'Room ID formati gecersiz. 1905- ile baslamali.';
  }

  if (errorMessage.includes('tamamlanmış')) {
    return 'Bu oda tamamlanmis durumda.';
  }

  // Genel hata
  if (errorMessage) {
    return errorMessage.replace(/[ğĞıİöÖüÜşŞçÇ]/g, (char) => {
      const map = {
        'ğ': 'g', 'Ğ': 'G',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ü': 'u', 'Ü': 'U',
        'ş': 's', 'Ş': 'S',
        'ç': 'c', 'Ç': 'C'
      };
      return map[char] || char;
    });
  }

  return 'Bilinmeyen bir hata olustu. Lutfen tekrar deneyin.';
};

// Network hatalarini kontrol eder
export const isNetworkError = (error) => {
  return (
    error?.code === 'auth/network-request-failed' ||
    error?.code === 'firestore/unavailable' ||
    error?.message?.includes('network') ||
    error?.message?.includes('connection') ||
    !navigator.onLine
  );
};

// Kritik hatalari loglar (sadece development modunda)
export const logError = (error, context = '') => {
  // Hiçbir zaman konsola yazma - sadece sessizce logla
  // Gerçek uygulamada burada Sentry, Bugsnag gibi servislere gönderilir
};

// Kullanici dostu hata toast'i
export const showUserFriendlyError = (error, context = '') => {
  logError(error, context);
  const message = getFirebaseErrorMessage(error);
  
  // Burada toast notification sistemi varsa kullanabilirsiniz
  console.warn(`Kullanici Hatasi [${context}]:`, message);
  
  return message;
};
