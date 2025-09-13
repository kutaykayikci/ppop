import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Tüm odaları getir
export const getRoomsData = async () => {
  try {
    const roomsRef = collection(db, 'rooms');
    const snapshot = await getDocs(roomsRef);
    
    const rooms = [];
    for (const doc of snapshot.docs) {
      const roomData = doc.data();
      
      // Karakter sayısını hesapla - characters ana koleksiyonundan
      const charactersQuery = query(
        collection(db, 'characters'),
        where('roomId', '==', roomData.id) // roomData.id kullanıyoruz çünkü room'un kendi ID'si
      );
      const charactersSnapshot = await getDocs(charactersQuery);
      
      // Tarih bilgisini güvenli şekilde işle
      let createdAt = new Date();
      if (roomData.createdAt) {
        if (roomData.createdAt.toDate) {
          // Firestore Timestamp
          createdAt = roomData.createdAt.toDate();
        } else if (roomData.createdAt instanceof Date) {
          // Date objesi
          createdAt = roomData.createdAt;
        } else if (typeof roomData.createdAt === 'string') {
          // String tarih
          createdAt = new Date(roomData.createdAt);
        } else if (typeof roomData.createdAt === 'number') {
          // Unix timestamp
          createdAt = new Date(roomData.createdAt);
        }
      }
      
      // Geçerli tarih kontrolü
      if (isNaN(createdAt.getTime())) {
        createdAt = new Date();
      }

      rooms.push({
        id: doc.id,
        firestoreId: doc.id, // Firestore document ID
        roomId: roomData.id, // Room'un kendi ID'si
        name: roomData.name || 'İsimsiz Oda',
        createdAt: createdAt,
        characterCount: charactersSnapshot.size,
        ...roomData
      });
    }
    
    return rooms.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Odaları getirme hatası:', error);
    return [];
  }
};

// Tüm karakterleri getir
export const getCharactersData = async () => {
  try {
    const rooms = await getRoomsData();
    const allCharacters = [];
    
    // Tüm karakterleri ana koleksiyondan al
    const charactersRef = collection(db, 'characters');
    const charactersSnapshot = await getDocs(charactersRef);
    
    for (const doc of charactersSnapshot.docs) {
      const characterData = doc.data();
      
      // Room bilgisini bul
      const room = rooms.find(r => r.roomId === characterData.roomId);
      
      // Poop sayısını hesapla - poops ana koleksiyonundan
      const poopsQuery = query(
        collection(db, 'poops'),
        where('characterId', '==', doc.id)
      );
      const poopsSnapshot = await getDocs(poopsQuery);
      
      // Tarih bilgisini güvenli şekilde işle
      let createdAt = new Date();
      if (characterData.createdAt) {
        if (characterData.createdAt.toDate) {
          // Firestore Timestamp
          createdAt = characterData.createdAt.toDate();
        } else if (characterData.createdAt instanceof Date) {
          // Date objesi
          createdAt = characterData.createdAt;
        } else if (typeof characterData.createdAt === 'string') {
          // String tarih
          createdAt = new Date(characterData.createdAt);
        } else if (typeof characterData.createdAt === 'number') {
          // Unix timestamp
          createdAt = new Date(characterData.createdAt);
        }
      }
      
      // Geçerli tarih kontrolü
      if (isNaN(createdAt.getTime())) {
        createdAt = new Date();
      }

      allCharacters.push({
        id: doc.id,
        roomId: characterData.roomId,
        roomName: room?.name || 'Bilinmeyen Oda',
        name: characterData.name || 'İsimsiz',
        emoji: characterData.emoji || '👤',
        gender: characterData.gender || 'unknown',
        color: characterData.color || '#000000',
        createdAt: createdAt,
        poopCount: poopsSnapshot.size,
        ...characterData
      });
    }
    
    return allCharacters.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Karakterleri getirme hatası:', error);
    return [];
  }
};

// Tüm poops'ları getir
export const getPoopsData = async () => {
  try {
    const rooms = await getRoomsData();
    const characters = await getCharactersData();
    const allPoops = [];
    
    // Tüm poops'ları ana koleksiyondan al
    const poopsRef = collection(db, 'poops');
    const poopsQuery = query(poopsRef, orderBy('timestamp', 'desc'));
    const snapshot = await getDocs(poopsQuery);
    
    for (const doc of snapshot.docs) {
      const poopData = doc.data();
      
      // Karakter bilgilerini bul
      const character = characters.find(char => char.id === poopData.characterId);
      const room = rooms.find(r => r.roomId === poopData.roomId);
      
      // Tarih bilgisini güvenli şekilde işle
      let timestamp = new Date();
      let date = new Date().toISOString().split('T')[0];
      
      if (poopData.timestamp) {
        if (poopData.timestamp.toDate) {
          // Firestore Timestamp
          timestamp = poopData.timestamp.toDate();
        } else if (poopData.timestamp instanceof Date) {
          // Date objesi
          timestamp = poopData.timestamp;
        } else if (typeof poopData.timestamp === 'string') {
          // String tarih
          timestamp = new Date(poopData.timestamp);
        } else if (typeof poopData.timestamp === 'number') {
          // Unix timestamp
          timestamp = new Date(poopData.timestamp);
        }
      }
      
      // Geçerli tarih kontrolü
      if (isNaN(timestamp.getTime())) {
        timestamp = new Date();
      }
      
      // Date string'i timestamp'ten al
      if (poopData.date) {
        date = poopData.date;
      } else {
        date = timestamp.toISOString().split('T')[0];
      }

      allPoops.push({
        id: doc.id,
        roomId: poopData.roomId,
        roomName: room?.name || 'Bilinmeyen Oda',
        characterId: poopData.characterId,
        characterName: character?.name || 'Bilinmeyen Karakter',
        characterEmoji: character?.emoji || '👤',
        characterGender: character?.gender || 'unknown',
        characterColor: character?.color || '#000000',
        timestamp: timestamp,
        date: date,
        ...poopData
      });
    }
    
    return allPoops.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Poops getirme hatası:', error);
    return [];
  }
};

// Günlük istatistikler
export const getDailyStats = async (date) => {
  try {
    const poops = await getPoopsData();
    const targetDate = date || new Date().toISOString().split('T')[0];
    
    const dailyPoops = poops.filter(poop => poop.date === targetDate);
    
    const stats = {
      totalPoops: dailyPoops.length,
      uniqueRooms: new Set(dailyPoops.map(p => p.roomId)).size,
      uniqueCharacters: new Set(dailyPoops.map(p => p.characterId)).size,
      roomStats: {},
      characterStats: {}
    };
    
    // Oda istatistikleri
    dailyPoops.forEach(poop => {
      if (!stats.roomStats[poop.roomId]) {
        stats.roomStats[poop.roomId] = {
          roomName: poop.roomName,
          count: 0,
          characters: new Set()
        };
      }
      stats.roomStats[poop.roomId].count++;
      stats.roomStats[poop.roomId].characters.add(poop.characterId);
    });
    
    // Karakter istatistikleri
    dailyPoops.forEach(poop => {
      if (!stats.characterStats[poop.characterId]) {
        stats.characterStats[poop.characterId] = {
          characterName: poop.characterName,
          roomName: poop.roomName,
          count: 0
        };
      }
      stats.characterStats[poop.characterId].count++;
    });
    
    return stats;
  } catch (error) {
    console.error('Günlük istatistikler getirme hatası:', error);
    return {
      totalPoops: 0,
      uniqueRooms: 0,
      uniqueCharacters: 0,
      roomStats: {},
      characterStats: {}
    };
  }
};

// Haftalık istatistikler
export const getWeeklyStats = async () => {
  try {
    const poops = await getPoopsData();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyPoops = poops.filter(poop => poop.timestamp >= oneWeekAgo);
    
    const dailyBreakdown = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyBreakdown[dateStr] = 0;
    }
    
    weeklyPoops.forEach(poop => {
      if (dailyBreakdown[poop.date] !== undefined) {
        dailyBreakdown[poop.date]++;
      }
    });
    
    return {
      totalPoops: weeklyPoops.length,
      dailyBreakdown,
      uniqueRooms: new Set(weeklyPoops.map(p => p.roomId)).size,
      uniqueCharacters: new Set(weeklyPoops.map(p => p.characterId)).size
    };
  } catch (error) {
    console.error('Haftalık istatistikler getirme hatası:', error);
    return {
      totalPoops: 0,
      dailyBreakdown: {},
      uniqueRooms: 0,
      uniqueCharacters: 0
    };
  }
};
