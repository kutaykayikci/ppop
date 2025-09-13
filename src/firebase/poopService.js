import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

export const addPoopEntry = async (roomId, characterId, profileId, timestamp = null) => {
  try {
    const poopData = {
      roomId,
      characterId,
      profileId,
      timestamp: timestamp || serverTimestamp(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      createdAt: new Date().toISOString()
    };
    
    console.log('Poop verisi ekleniyor:', poopData);
    const docRef = await addDoc(collection(db, 'poops'), poopData);
    console.log('Poop başarıyla eklendi, ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Poop ekleme hatası:', error);
    console.error('Hata detayları:', {
      code: error.code,
      message: error.message,
      roomId,
      characterId
    });
    
    // Daha açıklayıcı hata mesajı
    if (error.code === 'permission-denied') {
      throw new Error('Firestore güvenlik kuralları izin vermiyor. Lütfen Firebase Console\'da kuralları kontrol edin.');
    } else if (error.code === 'unavailable') {
      throw new Error('Firebase bağlantısı kurulamadı. İnternet bağlantınızı kontrol edin.');
    } else {
      throw new Error(`Poop eklenemedi: ${error.message}`);
    }
  }
};

export const getPoopsByDate = async (roomId, date) => {
  try {
    const q = query(
      collection(db, 'poops'),
      where('roomId', '==', roomId),
      where('date', '==', date)
    );
    
    const querySnapshot = await getDocs(q);
    const poops = [];
    
    querySnapshot.forEach((doc) => {
      poops.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Client-side sorting (timestamp'a göre sırala)
    poops.sort((a, b) => {
      const timeA = a.timestamp?.seconds || new Date(a.createdAt).getTime() / 1000;
      const timeB = b.timestamp?.seconds || new Date(b.createdAt).getTime() / 1000;
      return timeA - timeB;
    });
    
    return poops;
  } catch (error) {
    console.error('Poop verilerini alma hatası:', error);
    throw error;
  }
};

export const getPoopsByDateRange = async (roomId, startDate, endDate) => {
  try {
    const q = query(
      collection(db, 'poops'),
      where('roomId', '==', roomId),
      where('date', '>=', startDate),
      where('date', '<=', endDate)
    );
    
    const querySnapshot = await getDocs(q);
    const poops = [];
    
    querySnapshot.forEach((doc) => {
      poops.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Client-side sorting (tarih ve timestamp'a göre sırala)
    poops.sort((a, b) => {
      // Önce tarihe göre sırala
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date); // Yeni tarihler önce
      }
      // Aynı tarihte ise timestamp'a göre sırala
      const timeA = a.timestamp?.seconds || new Date(a.createdAt).getTime() / 1000;
      const timeB = b.timestamp?.seconds || new Date(b.createdAt).getTime() / 1000;
      return timeB - timeA; // Yeni zamanlar önce
    });
    
    return poops;
  } catch (error) {
    console.error('Tarih aralığı poop verilerini alma hatası:', error);
    throw error;
  }
};

export const getTodayPoops = async (roomId) => {
  const today = new Date().toISOString().split('T')[0];
  return await getPoopsByDate(roomId, today);
};
