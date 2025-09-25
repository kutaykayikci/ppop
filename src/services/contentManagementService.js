import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// İçerik yönetimi koleksiyonu
const CONTENT_COLLECTION = 'app_content';

// Varsayılan içerik şablonu
const DEFAULT_CONTENT = {
  // Uygulama genel metinleri
  app: {
    title: "Poop Hero",
    subtitle: "Kaka sayma oyunu",
    description: "Arkadaşlarınla birlikte kaka sayma yarışına katıl!",
    welcomeMessage: "Hoş geldin! Kaka sayma macerasına hazır mısın?",
    loadingText: "Yükleniyor...",
    errorText: "Bir hata oluştu, lütfen tekrar deneyin."
  },
  
  // Karakter oluşturma
  character: {
    createTitle: "Karakter Oluştur",
    namePlaceholder: "Karakter adını gir",
    genderLabel: "Cinsiyet seç",
    colorLabel: "Renk seç",
    createButton: "Karakter Oluştur",
    male: "Erkek",
    female: "Kadın"
  },
  
  // Oda yönetimi
  room: {
    createTitle: "Oda Oluştur",
    joinTitle: "Odaya Katıl",
    roomNamePlaceholder: "Oda adını gir",
    roomIdPlaceholder: "Oda ID'sini gir",
    createButton: "Oda Oluştur",
    joinButton: "Odaya Katıl",
    roomNotFound: "Oda bulunamadı",
    roomFull: "Oda dolu"
  },
  
  // Poop sayma
  poop: {
    countTitle: "Kaka Sayısı",
    addPoop: "Kaka Ekle",
    poopAdded: "Kaka eklendi!",
    totalPoops: "Toplam Kaka",
    todayPoops: "Bugünkü Kaka"
  },
  
  // Bildirimler
  notifications: {
    poopAdded: "Yeni kaka eklendi!",
    characterJoined: "Yeni karakter katıldı!",
    roomCreated: "Yeni oda oluşturuldu!",
    achievement: "Başarı kazanıldı!"
  },
  
  // Başarılar
  achievements: {
    firstPoop: "İlk Kaka",
    firstPoopDesc: "İlk kakanı ekledin!",
    tenPoops: "Kaka Ustası",
    tenPoopsDesc: "10 kaka ekledin!",
    hundredPoops: "Kaka Kralı",
    hundredPoopsDesc: "100 kaka ekledin!"
  },
  
  // Ayarlar
  settings: {
    title: "Ayarlar",
    sound: "Ses",
    notifications: "Bildirimler",
    theme: "Tema",
    language: "Dil",
    save: "Kaydet",
    reset: "Sıfırla"
  },
  
  // Hata mesajları
  errors: {
    networkError: "İnternet bağlantısı hatası",
    authError: "Giriş hatası",
    dataError: "Veri yükleme hatası",
    unknownError: "Bilinmeyen hata"
  }
};

// İçerik getir
export const getContent = async (contentKey = null) => {
  try {
    const contentRef = doc(db, CONTENT_COLLECTION, 'main');
    const contentSnap = await getDoc(contentRef);
    
    if (contentSnap.exists()) {
      const content = contentSnap.data();
      return contentKey ? content[contentKey] : content;
    } else {
      // İlk kez çalışıyorsa varsayılan içeriği kaydet
      await setDoc(contentRef, DEFAULT_CONTENT);
      return contentKey ? DEFAULT_CONTENT[contentKey] : DEFAULT_CONTENT;
    }
  } catch (error) {
    console.error('İçerik getirme hatası:', error);
    return contentKey ? DEFAULT_CONTENT[contentKey] : DEFAULT_CONTENT;
  }
};

// İçerik güncelle
export const updateContent = async (contentKey, newContent) => {
  try {
    const contentRef = doc(db, CONTENT_COLLECTION, 'main');
    const contentSnap = await getDoc(contentRef);
    
    if (contentSnap.exists()) {
      const currentContent = contentSnap.data();
      const updatedContent = {
        ...currentContent,
        [contentKey]: {
          ...currentContent[contentKey],
          ...newContent
        }
      };
      
      await updateDoc(contentRef, updatedContent);
      return { success: true };
    } else {
      // İlk kez çalışıyorsa varsayılan içeriği kaydet
      const updatedContent = {
        ...DEFAULT_CONTENT,
        [contentKey]: {
          ...DEFAULT_CONTENT[contentKey],
          ...newContent
        }
      };
      
      await setDoc(contentRef, updatedContent);
      return { success: true };
    }
  } catch (error) {
    console.error('İçerik güncelleme hatası:', error);
    return { success: false, error: error.message };
  }
};

// Tüm içerikleri getir
export const getAllContent = async () => {
  try {
    const contentRef = doc(db, CONTENT_COLLECTION, 'main');
    const contentSnap = await getDoc(contentRef);
    
    if (contentSnap.exists()) {
      return contentSnap.data();
    } else {
      // İlk kez çalışıyorsa varsayılan içeriği kaydet
      await setDoc(contentRef, DEFAULT_CONTENT);
      return DEFAULT_CONTENT;
    }
  } catch (error) {
    console.error('Tüm içerikleri getirme hatası:', error);
    return DEFAULT_CONTENT;
  }
};

// İçerik sıfırla
export const resetContent = async () => {
  try {
    const contentRef = doc(db, CONTENT_COLLECTION, 'main');
    await setDoc(contentRef, DEFAULT_CONTENT);
    return { success: true };
  } catch (error) {
    console.error('İçerik sıfırlama hatası:', error);
    return { success: false, error: error.message };
  }
};

// Belirli bir anahtarın içeriğini getir
export const getContentByKey = async (key) => {
  try {
    const content = await getContent();
    return content[key] || null;
  } catch (error) {
    console.error('Anahtar içerik getirme hatası:', error);
    return null;
  }
};

// İçerik anahtarlarını listele
export const getContentKeys = () => {
  return Object.keys(DEFAULT_CONTENT);
};

// İçerik geçmişini getir (gelecekte versiyonlama için)
export const getContentHistory = async () => {
  try {
    const historyRef = collection(db, CONTENT_COLLECTION + '_history');
    const historyQuery = query(historyRef);
    const historySnap = await getDocs(historyQuery);
    
    const history = [];
    historySnap.forEach(doc => {
      history.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return history.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('İçerik geçmişi getirme hatası:', error);
    return [];
  }
};
