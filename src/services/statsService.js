import { 
  collection, 
  getDocs, 
  query,
  where,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Global istatistikleri getir
export const getGlobalStats = async () => {
  try {
    console.log('Global istatistikler yükleniyor...');
    
    // Önce sadece public verileri çek (authentication gerektirmeyen)
    let totalRooms = 0;
    let activeRooms = 0;
    let totalPoops = 0;
    let totalUsers = 0;
    let totalRoomPoops = 0;
    
    let poopsSnapshot = null;
    
    try {
      // Poop verilerini getir (public)
      poopsSnapshot = await getDocs(collection(db, 'poops'));
      totalPoops = poopsSnapshot.docs.length;
      console.log('Poop verileri yüklendi:', totalPoops);
    } catch (poopError) {
      console.warn('Poop verileri yüklenemedi:', poopError.message);
    }
    
    try {
      // Karakter verilerini getir (public) - leaderboard ile aynı yöntem
      const charactersSnapshot = await getDocs(collection(db, 'characters'));
      totalUsers = charactersSnapshot.docs.length;
      console.log('Karakter verileri yüklendi:', totalUsers);
    } catch (characterError) {
      console.warn('Karakter verileri yüklenemedi:', characterError.message);
    }
    
    // Oda verileri authentication gerektirdiği için poop verilerinden hesapla
    if (poopsSnapshot) {
      try {
        // Poop verilerinden unique room sayısını hesapla
        const uniqueRooms = new Set();
        poopsSnapshot.docs.forEach(doc => {
          const poopData = doc.data();
          if (poopData.roomId) {
            uniqueRooms.add(poopData.roomId);
          }
        });
        
        totalRooms = uniqueRooms.size;
        activeRooms = uniqueRooms.size; // Aktif oda = poop'u olan oda
        
        console.log('Oda verileri (poop tabanlı) yüklendi:', { totalRooms, activeRooms });
      } catch (roomError) {
        console.warn('Oda verileri hesaplanamadı:', roomError.message);
      }
    }
    
    console.log('Global istatistikler yüklendi:', {
      totalRooms,
      activeRooms,
      totalPoops,
      totalUsers,
      totalRoomPoops
    });
    
    return {
      success: true,
      totalRooms,
      activeRooms,
      totalPoops,
      totalUsers,
      totalRoomPoops
    };
    
  } catch (error) {
    console.error('Global istatistikler yüklenirken hata:', error);
    return {
      success: false,
      error: error.message,
      totalRooms: 0,
      activeRooms: 0,
      totalPoops: 0,
      totalUsers: 0,
      totalRoomPoops: 0
    };
  }
};

// Oda istatistiklerini getir
export const getRoomStats = async (roomId) => {
  try {
    console.log(`Oda ${roomId} istatistikleri yükleniyor...`);
    
    // Oda bilgilerini getir
    const roomsQuery = query(
      collection(db, 'rooms'),
      where('id', '==', roomId)
    );
    const roomsSnapshot = await getDocs(roomsQuery);
    
    if (roomsSnapshot.empty) {
      return {
        success: false,
        error: 'Oda bulunamadı'
      };
    }
    
    const roomData = roomsSnapshot.docs[0].data();
    
    // Odadaki poop verilerini getir
    const poopsQuery = query(
      collection(db, 'poops'),
      where('roomId', '==', roomId)
    );
    const poopsSnapshot = await getDocs(poopsQuery);
    
    return {
      success: true,
      roomId,
      totalPoops: poopsSnapshot.docs.length,
      roomPoopCount: roomData.totalPoopCount || 0,
      userCount: roomData.users?.length || 0,
      status: roomData.status
    };
    
  } catch (error) {
    console.error('Oda istatistikleri yüklenirken hata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Kullanıcı istatistiklerini getir
export const getUserStats = async (userId) => {
  try {
    console.log(`Kullanıcı ${userId} istatistikleri yükleniyor...`);
    
    // Kullanıcı bilgilerini getir
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'Kullanıcı bulunamadı'
      };
    }
    
    const userData = userDoc.data();
    
    // Kullanıcının poop verilerini getir
    const poopsQuery = query(
      collection(db, 'poops'),
      where('userId', '==', userId)
    );
    const poopsSnapshot = await getDocs(poopsQuery);
    
    return {
      success: true,
      userId,
      totalPoops: poopsSnapshot.docs.length,
      userPoopCount: userData.totalPoopCount || 0,
      joinedRooms: userData.joinedRooms || []
    };
    
  } catch (error) {
    console.error('Kullanıcı istatistikleri yüklenirken hata:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
