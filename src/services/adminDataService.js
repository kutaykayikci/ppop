import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
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
      
      // Karakter sayısını hesapla
      const charactersRef = collection(db, 'rooms', doc.id, 'characters');
      const charactersSnapshot = await getDocs(charactersRef);
      
      rooms.push({
        id: doc.id,
        name: roomData.name || 'İsimsiz Oda',
        createdAt: roomData.createdAt?.toDate?.() || new Date(),
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
    
    for (const room of rooms) {
      const charactersRef = collection(db, 'rooms', room.id, 'characters');
      const snapshot = await getDocs(charactersRef);
      
      for (const doc of snapshot.docs) {
        const characterData = doc.data();
        
        // Poop sayısını hesapla
        const poopsRef = collection(db, 'rooms', room.id, 'poops');
        const poopsQuery = query(
          poopsRef,
          orderBy('characterId', '==', doc.id)
        );
        const poopsSnapshot = await getDocs(poopsQuery);
        
        allCharacters.push({
          id: doc.id,
          roomId: room.id,
          roomName: room.name,
          name: characterData.name || 'İsimsiz',
          emoji: characterData.emoji || '👤',
          createdAt: characterData.createdAt?.toDate?.() || new Date(),
          poopCount: poopsSnapshot.size,
          ...characterData
        });
      }
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
    const allPoops = [];
    
    for (const room of rooms) {
      const poopsRef = collection(db, 'rooms', room.id, 'poops');
      const poopsQuery = query(poopsRef, orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(poopsQuery);
      
      for (const doc of snapshot.docs) {
        const poopData = doc.data();
        
        // Karakter adını bul
        const charactersRef = collection(db, 'rooms', room.id, 'characters');
        const charactersSnapshot = await getDocs(charactersRef);
        let characterName = 'Bilinmeyen';
        
        for (const charDoc of charactersSnapshot.docs) {
          if (charDoc.id === poopData.characterId) {
            const charData = charDoc.data();
            characterName = charData.name || 'İsimsiz';
            break;
          }
        }
        
        allPoops.push({
          id: doc.id,
          roomId: room.id,
          roomName: room.name,
          characterId: poopData.characterId,
          characterName: characterName,
          timestamp: poopData.timestamp?.toDate?.() || new Date(),
          date: poopData.date || new Date().toISOString().split('T')[0],
          ...poopData
        });
      }
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
