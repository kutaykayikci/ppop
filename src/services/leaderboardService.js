import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Global liderlik tablosu - tüm kullanıcılar
export const getGlobalLeaderboard = async (timeframe = 'all') => {
  try {
    // Tüm poop verilerini getir
    const poopSnapshot = await getDocs(collection(db, 'poops'));
    
    // Karakter bilgilerini getir
    const charactersSnapshot = await getDocs(collection(db, 'characters'));
    const charactersMap = {};
    charactersSnapshot.docs.forEach(doc => {
      const charData = doc.data();
      // Firestore document ID'sini kullan (doc.id)
      charactersMap[doc.id] = {
        id: doc.id,
        ...charData
      };
    });

    // Kullanıcı başına poop sayısını hesapla
    const userStats = {};
    const now = new Date();
    
    poopSnapshot.docs.forEach(doc => {
      const poopData = doc.data();
      const characterId = poopData.characterId;
      
      if (charactersMap[characterId]) {
        const character = charactersMap[characterId];
        const userId = `${character.roomId}_${characterId}`; // Unique user identifier
        
        // Tarih filtresi uygula
        let includePoop = true;
        if (timeframe !== 'all') {
          // Date field'ını kullan (daha güvenilir)
          const poopDate = poopData.date; // YYYY-MM-DD formatında
          const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatında
          
          switch (timeframe) {
            case 'today':
              includePoop = poopDate === today;
              break;
            case 'week':
              // Bu haftanın başlangıcını hesapla
              const weekStart = new Date(now);
              weekStart.setDate(now.getDate() - now.getDay());
              weekStart.setHours(0, 0, 0, 0);
              const weekStartStr = weekStart.toISOString().split('T')[0];
              includePoop = poopDate >= weekStartStr;
              break;
            case 'month':
              // Bu ayın başlangıcını hesapla
              const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
              const monthStartStr = monthStart.toISOString().split('T')[0];
              includePoop = poopDate >= monthStartStr;
              break;
          }
        }
        
        if (includePoop) {
          if (!userStats[userId]) {
            userStats[userId] = {
              characterId,
              characterName: character.name,
              characterEmoji: character.emoji,
              characterColor: character.color,
              roomId: character.roomId,
              poopCount: 0,
              lastPoopTime: null,
              level: 1
            };
          }
          
          userStats[userId].poopCount++;
          
          // Son poop zamanını güncelle
          let poopTime;
          if (poopData.timestamp) {
            if (poopData.timestamp.toDate) {
              poopTime = poopData.timestamp.toDate();
            } else if (poopData.timestamp instanceof Date) {
              poopTime = poopData.timestamp;
            } else if (typeof poopData.timestamp === 'string') {
              poopTime = new Date(poopData.timestamp);
            } else if (typeof poopData.timestamp === 'number') {
              poopTime = new Date(poopData.timestamp);
            } else {
              poopTime = new Date();
            }
          } else {
            poopTime = new Date();
          }
          
          if (!userStats[userId].lastPoopTime || poopTime > userStats[userId].lastPoopTime) {
            userStats[userId].lastPoopTime = poopTime;
          }
        }
      }
    });

    // Seviye hesaplama (her 10 poop = 1 seviye)
    Object.values(userStats).forEach(user => {
      user.level = Math.floor(user.poopCount / 10) + 1;
    });

    // Poop sayısına göre sırala
    const leaderboard = Object.values(userStats)
      .sort((a, b) => b.poopCount - a.poopCount)
      .slice(0, 100); // Top 100

    return {
      success: true,
      leaderboard,
      timeframe,
      totalUsers: leaderboard.length
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message,
      leaderboard: []
    };
  }
};

// Room bazında liderlik tablosu
export const getRoomLeaderboard = async (roomId, timeframe = 'all') => {
  try {
    let dateFilter = null;
    const now = new Date();
    
    switch (timeframe) {
      case 'today':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        dateFilter = weekStart;
        break;
      case 'month':
        dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    // Room'daki poop verilerini getir
    let poopQuery = query(
      collection(db, 'poops'),
      where('roomId', '==', roomId)
    );
    
    if (dateFilter) {
      poopQuery = query(
        collection(db, 'poops'),
        where('roomId', '==', roomId),
        where('timestamp', '>=', dateFilter)
      );
    }
    
    const poopSnapshot = await getDocs(poopQuery);
    
    // Room'daki karakterleri getir
    const charactersQuery = query(
      collection(db, 'characters'),
      where('roomId', '==', roomId)
    );
    const charactersSnapshot = await getDocs(charactersQuery);
    const charactersMap = {};
    charactersSnapshot.docs.forEach(doc => {
      const charData = doc.data();
      // Firestore document ID'sini kullan (doc.id)
      charactersMap[doc.id] = {
        id: doc.id,
        ...charData
      };
    });

    // Karakter başına poop sayısını hesapla
    const characterStats = {};
    
    poopSnapshot.docs.forEach(doc => {
      const poopData = doc.data();
      const characterId = poopData.characterId;
      
      if (charactersMap[characterId]) {
        const character = charactersMap[characterId];
        
        if (!characterStats[characterId]) {
          characterStats[characterId] = {
            characterId,
            characterName: character.name,
            characterEmoji: character.emoji,
            characterColor: character.color,
            poopCount: 0,
            lastPoopTime: null,
            level: 1
          };
        }
        
        characterStats[characterId].poopCount++;
        
        const poopTime = poopData.timestamp?.toDate ? poopData.timestamp.toDate() : new Date(poopData.timestamp);
        if (!characterStats[characterId].lastPoopTime || poopTime > characterStats[characterId].lastPoopTime) {
          characterStats[characterId].lastPoopTime = poopTime;
        }
      }
    });

    // Seviye hesaplama
    Object.values(characterStats).forEach(character => {
      character.level = Math.floor(character.poopCount / 10) + 1;
    });

    const leaderboard = Object.values(characterStats)
      .sort((a, b) => b.poopCount - a.poopCount);

    return {
      success: true,
      leaderboard,
      timeframe,
      roomId
    };
    
  } catch (error) {
    console.error('Room liderlik tablosu hatası:', error);
    return {
      success: false,
      error: error.message,
      leaderboard: []
    };
  }
};

// Kullanıcının global sıralamasını getir
export const getUserGlobalRank = async (roomId, characterId) => {
  try {
    const globalLeaderboard = await getGlobalLeaderboard('all');
    
    if (!globalLeaderboard.success) {
      return { success: false, rank: null };
    }

    const userIdentifier = `${roomId}_${characterId}`;
    const rank = globalLeaderboard.leaderboard.findIndex(
      user => user.characterId === characterId && user.roomId === roomId
    );

    return {
      success: true,
      rank: rank >= 0 ? rank + 1 : null,
      totalUsers: globalLeaderboard.totalUsers
    };
    
  } catch (error) {
    console.error('Kullanıcı sıralaması hatası:', error);
    return { success: false, rank: null };
  }
};
