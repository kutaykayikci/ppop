import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  where,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Test fonksiyonu - Firestore bağlantısını kontrol et
export const testFirestoreConnection = async () => {
  try {
    console.log('Firestore bağlantısı test ediliyor...');
    
    // Poop koleksiyonunu test et
    const poopSnapshot = await getDocs(collection(db, 'poops'));
    console.log('Poop koleksiyonu:', poopSnapshot.docs.length, 'doküman');
    
    // Karakter koleksiyonunu test et
    const characterSnapshot = await getDocs(collection(db, 'characters'));
    console.log('Karakter koleksiyonu:', characterSnapshot.docs.length, 'doküman');
    
    // İlk birkaç dokümanı incele
    if (poopSnapshot.docs.length > 0) {
      const firstPoop = poopSnapshot.docs[0].data();
      console.log('İlk poop verisi:', firstPoop);
    }
    
    if (characterSnapshot.docs.length > 0) {
      const firstCharacter = characterSnapshot.docs[0].data();
      console.log('İlk karakter verisi:', firstCharacter);
    }
    
    return {
      success: true,
      poopCount: poopSnapshot.docs.length,
      characterCount: characterSnapshot.docs.length
    };
  } catch (error) {
    console.error('Firestore bağlantı testi hatası:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Global liderlik tablosu - tüm kullanıcılar
export const getGlobalLeaderboard = async (timeframe = 'all') => {
  try {
    console.log('Firestore verileri yükleniyor...');
    
    // Tüm poop verilerini getir
    const poopSnapshot = await getDocs(collection(db, 'poops'));
    console.log('Poop verileri yüklendi:', poopSnapshot.docs.length, 'adet');
    
    // Karakter bilgilerini getir
    const charactersSnapshot = await getDocs(collection(db, 'characters'));
    console.log('Karakter verileri yüklendi:', charactersSnapshot.docs.length, 'adet');
    
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
    
    // Debug: Tarih aralıklarını hesapla (Türkiye saati UTC+3)
    const turkeyOffset = 3 * 60; // 3 saat = 180 dakika
    const turkeyNow = new Date(now.getTime() + (turkeyOffset * 60 * 1000));
    
    const todayStart = new Date(turkeyNow.getFullYear(), turkeyNow.getMonth(), turkeyNow.getDate());
    todayStart.setHours(0, 0, 0, 0);
    todayStart.setTime(todayStart.getTime() - (turkeyOffset * 60 * 1000)); // UTC'ye çevir
    
    const weekStart = new Date(turkeyNow);
    const dayOfWeek = turkeyNow.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(turkeyNow.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    weekStart.setTime(weekStart.getTime() - (turkeyOffset * 60 * 1000)); // UTC'ye çevir
    
    const monthStart = new Date(turkeyNow.getFullYear(), turkeyNow.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    monthStart.setTime(monthStart.getTime() - (turkeyOffset * 60 * 1000)); // UTC'ye çevir
    
    console.log('Tarih filtreleme bilgileri:', {
      timeframe,
      now: now.toISOString(),
      turkeyNow: turkeyNow.toISOString(),
      todayStart: todayStart.toISOString(),
      weekStart: weekStart.toISOString(),
      monthStart: monthStart.toISOString()
    });
    
    let totalPoops = 0;
    let todayPoops = 0;
    let weekPoops = 0;
    let monthPoops = 0;
    
    poopSnapshot.docs.forEach(doc => {
      const poopData = doc.data();
      const characterId = poopData.characterId;
      totalPoops++;
      
      if (charactersMap[characterId]) {
        const character = charactersMap[characterId];
        const userId = `${character.roomId}_${characterId}`; // Unique user identifier
        
        // Tarih filtresi uygula
        let includePoop = true;
        if (timeframe !== 'all') {
          // Timestamp'ten doğru tarih bilgisini çıkar
          let poopTime;
          try {
            if (poopData.timestamp) {
              if (poopData.timestamp.toDate && typeof poopData.timestamp.toDate === 'function') {
                // Firestore Timestamp
                poopTime = poopData.timestamp.toDate();
              } else if (poopData.timestamp instanceof Date) {
                // Zaten Date objesi
                poopTime = poopData.timestamp;
              } else if (typeof poopData.timestamp === 'string') {
                // String timestamp
                poopTime = new Date(poopData.timestamp);
              } else if (typeof poopData.timestamp === 'number') {
                // Unix timestamp (milisaniye cinsinden)
                poopTime = new Date(poopData.timestamp);
              } else {
                // Fallback: bugün
                poopTime = new Date();
              }
            } else if (poopData.date) {
              // Date field varsa onu kullan (YYYY-MM-DD formatında)
              poopTime = new Date(poopData.date + 'T00:00:00.000Z');
            } else if (poopData.createdAt) {
              // createdAt field'ını kullan
              if (typeof poopData.createdAt === 'string') {
                poopTime = new Date(poopData.createdAt);
              } else {
                poopTime = new Date();
              }
            } else {
              // Hiçbir tarih bilgisi yoksa bugün olarak kabul et
              poopTime = new Date();
            }
          } catch (error) {
            console.warn('Tarih işleme hatası:', error);
            poopTime = new Date();
          }
          
          // Tarih karşılaştırması için timestamp'leri kullan
          const poopTimestamp = poopTime.getTime();
          const nowTimestamp = now.getTime();
          
          // Debug: İlk birkaç poop için detaylı bilgi
          if (totalPoops <= 3) {
            console.log('Poop debug:', {
              poopTime: poopTime.toISOString(),
              poopTimestamp,
              todayStart: todayStart.getTime(),
              todayEnd: new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).getTime(),
              timeframe,
              characterId,
              isToday: poopTimestamp >= todayStart.getTime() && poopTimestamp < new Date(todayStart.getTime() + 24 * 60 * 60 * 1000).getTime()
            });
          }
          
          switch (timeframe) {
            case 'today':
              // Bugünün başlangıcı (00:00:00)
              const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
              includePoop = poopTimestamp >= todayStart.getTime() && poopTimestamp < todayEnd.getTime();
              if (includePoop) todayPoops++;
              break;
            case 'week':
              // Bu haftanın başlangıcı (Pazartesi 00:00:00)
              includePoop = poopTimestamp >= weekStart.getTime();
              if (includePoop) weekPoops++;
              break;
            case 'month':
              // Bu ayın başlangıcı (1. gün 00:00:00)
              includePoop = poopTimestamp >= monthStart.getTime();
              if (includePoop) monthPoops++;
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
          try {
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
          } catch (error) {
            console.warn('Timestamp işleme hatası:', error);
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

    console.log('Liderlik tablosu oluşturuldu:', {
      totalUsers: leaderboard.length,
      timeframe,
      sampleUser: leaderboard[0],
      filteredPoops: Object.keys(userStats).length,
      totalPoops,
      todayPoops,
      weekPoops,
      monthPoops
    });

    return {
      success: true,
      leaderboard,
      timeframe,
      totalUsers: leaderboard.length
    };
    
  } catch (error) {
    console.error('Global liderlik tablosu hatası:', error);
    return {
      success: false,
      error: error.message || 'Liderlik tablosu yüklenirken bir hata oluştu',
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
