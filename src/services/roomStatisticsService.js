import { getPoopsByDateRange } from '../firebase/poopService';

// Son 7 günü hesapla (bugün dahil)
const getLast7Days = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
};

// Tarih aralığı hesapla
const getDateRange = (period) => {
  const today = new Date().toISOString().split('T')[0];
  let startDate, endDate;

  switch (period) {
    case 'today':
      startDate = endDate = today;
      break;
    case 'yesterday':
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = endDate = yesterday.toISOString().split('T')[0];
      break;
    case 'week':
      // Son 7 gün (bugün dahil)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 6);
      startDate = weekStart.toISOString().split('T')[0];
      endDate = today;
      break;
    case 'month':
      const monthStart = new Date();
      monthStart.setDate(1); // Ayın ilk günü
      startDate = monthStart.toISOString().split('T')[0];
      endDate = today;
      break;
    case 'total':
      startDate = '2024-01-01'; // Başlangıç tarihi
      endDate = today;
      break;
    default:
      startDate = endDate = today;
  }

  return { startDate, endDate };
};

// Room istatistiklerini hesapla
export const calculateRoomStatistics = async (roomId, characters, period = 'today') => {
  try {
    const { startDate, endDate } = getDateRange(period);
    
    // Veritabanından poop verilerini al
    const poops = await getPoopsByDateRange(roomId, startDate, endDate);
    
    // Karakter bazında istatistik hesapla
    const characterStats = {};
    const totalPoops = poops.length;
    
    characters.forEach(character => {
      const characterPoops = poops.filter(poop => poop.characterId === character.id);
      characterStats[character.id] = {
        count: characterPoops.length,
        percentage: totalPoops > 0 ? Math.round((characterPoops.length / totalPoops) * 100) : 0
      };
    });

    // Ekstra istatistikler hesapla
    const extraStats = await calculateExtraStatistics(roomId, characters, period);

    return {
      period,
      startDate,
      endDate,
      characterStats,
      totalPoops,
      extraStats
    };

  } catch (error) {
    console.error('Room istatistik hesaplama hatası:', error);
    return {
      period,
      startDate: null,
      endDate: null,
      characterStats: {},
      totalPoops: 0,
      extraStats: {}
    };
  }
};

// Belirli tarih aralığı için ekstra istatistikleri hesapla
const calculateExtraStatisticsForPeriod = async (roomId, characters, startDate, endDate) => {
  try {
    const poops = await getPoopsByDateRange(roomId, startDate, endDate);
    
    // Günlük ortalama hesapla
    const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const dailyAverage = daysDiff > 0 ? Math.round((poops.length / daysDiff) * 10) / 10 : 0;

    // En aktif karakter
    const characterCounts = {};
    characters.forEach(character => {
      const count = poops.filter(poop => poop.characterId === character.id).length;
      characterCounts[character.id] = { count, name: character.name, emoji: character.emoji };
    });

    const mostActiveCharacter = Object.values(characterCounts)
      .sort((a, b) => b.count - a.count)[0] || { name: 'Henüz yok', emoji: '😴', count: 0 };

    return {
      dailyAverage,
      mostActiveCharacter,
      totalDays: daysDiff
    };

  } catch (error) {
    console.error('Dönem ekstra istatistik hesaplama hatası:', error);
    return {
      dailyAverage: 0,
      mostActiveCharacter: { name: 'Hata', emoji: '❌', count: 0 },
      totalDays: 0
    };
  }
};

// Ekstra istatistikleri hesapla
const calculateExtraStatistics = async (roomId, characters, period) => {
  try {
    const { startDate, endDate } = getDateRange(period);
    const poops = await getPoopsByDateRange(roomId, startDate, endDate);
    
    // Günlük ortalama hesapla
    const daysDiff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const dailyAverage = daysDiff > 0 ? Math.round((poops.length / daysDiff) * 10) / 10 : 0;

    // En aktif karakter
    const characterCounts = {};
    characters.forEach(character => {
      const count = poops.filter(poop => poop.characterId === character.id).length;
      characterCounts[character.id] = { count, name: character.name, emoji: character.emoji };
    });

    const mostActiveCharacter = Object.values(characterCounts)
      .sort((a, b) => b.count - a.count)[0] || { name: 'Henüz yok', emoji: '😴', count: 0 };

    // Günlük dağılım (son 7 gün için)
    const dailyDistribution = {};
    if (period === 'week' || period === 'total') {
      const last7Days = getLast7Days();
      last7Days.forEach(date => {
        const dayPoops = poops.filter(poop => poop.date === date);
        dailyDistribution[date] = dayPoops.length;
      });
    }

    // En aktif gün
    const mostActiveDay = Object.entries(dailyDistribution)
      .sort(([,a], [,b]) => b - a)[0] || ['Henüz yok', 0];

    // Streak bilgisi (arka arkaya günler)
    const streakInfo = calculateStreak(poops);

    // Saatlik dağılım kaldırıldı

    return {
      dailyAverage,
      mostActiveCharacter,
      dailyDistribution,
      mostActiveDay,
      streakInfo,
      totalDays: daysDiff,
      activeDays: Object.keys(dailyDistribution).filter(date => dailyDistribution[date] > 0).length
    };

  } catch (error) {
    console.error('Ekstra istatistik hesaplama hatası:', error);
    return {
      dailyAverage: 0,
      mostActiveCharacter: { name: 'Hata', emoji: '❌', count: 0 },
      dailyDistribution: {},
      mostActiveDay: ['Hata', 0],
      streakInfo: { current: 0, longest: 0 },
      totalDays: 0,
      activeDays: 0
    };
  }
};

// Streak hesapla (arka arkaya günler)
const calculateStreak = (poops) => {
  try {
    const dates = [...new Set(poops.map(poop => poop.date))].sort();
    
    if (dates.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;

    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);

    // Bugünden geriye doğru streak hesapla
    for (let i = 0; i < 30; i++) { // Max 30 gün kontrol et
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (dates.includes(dateStr)) {
        currentStreak++;
      } else {
        break;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // En uzun streak'i hesapla
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i-1]);
      const currDate = new Date(dates[i]);
      const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      current: currentStreak,
      longest: longestStreak
    };

  } catch (error) {
    console.error('Streak hesaplama hatası:', error);
    return { current: 0, longest: 0 };
  }
};

// Karşılaştırmalı istatistikler (önceki dönemle karşılaştırma)
export const getComparativeStatistics = async (roomId, characters, period = 'week') => {
  try {
    const currentStats = await calculateRoomStatistics(roomId, characters, period);
    
    // Önceki dönem için tarih aralığı hesapla
    let previousStartDate, previousEndDate;
    const today = new Date().toISOString().split('T')[0];
    
    switch (period) {
      case 'week':
        // Önceki 7 gün (geçen hafta)
        const previousWeekEnd = new Date();
        previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);
        previousEndDate = previousWeekEnd.toISOString().split('T')[0];
        
        const previousWeekStart = new Date();
        previousWeekStart.setDate(previousWeekStart.getDate() - 13);
        previousStartDate = previousWeekStart.toISOString().split('T')[0];
        break;
        
      case 'month':
        // Önceki ay
        const previousMonthEnd = new Date();
        previousMonthEnd.setMonth(previousMonthEnd.getMonth() - 1);
        previousMonthEnd.setDate(0); // Önceki ayın son günü
        previousEndDate = previousMonthEnd.toISOString().split('T')[0];
        
        const previousMonthStart = new Date();
        previousMonthStart.setMonth(previousMonthStart.getMonth() - 1);
        previousMonthStart.setDate(1); // Önceki ayın ilk günü
        previousStartDate = previousMonthStart.toISOString().split('T')[0];
        break;
        
      default:
        return null;
    }

    // Önceki dönem istatistiklerini hesapla
    const previousPoops = await getPoopsByDateRange(roomId, previousStartDate, previousEndDate);
    const previousCharacterStats = {};
    const previousTotalPoops = previousPoops.length;
    
    characters.forEach(character => {
      const characterPoops = previousPoops.filter(poop => poop.characterId === character.id);
      previousCharacterStats[character.id] = {
        count: characterPoops.length,
        percentage: previousTotalPoops > 0 ? Math.round((characterPoops.length / previousTotalPoops) * 100) : 0
      };
    });

    const previousExtraStats = await calculateExtraStatisticsForPeriod(roomId, characters, previousStartDate, previousEndDate);
    
    const previousStats = {
      period: 'previous',
      startDate: previousStartDate,
      endDate: previousEndDate,
      characterStats: previousCharacterStats,
      totalPoops: previousTotalPoops,
      extraStats: previousExtraStats
    };

    // Karşılaştırma hesapla
    const comparison = {
      totalChange: currentStats.totalPoops - previousStats.totalPoops,
      totalChangePercent: previousStats.totalPoops > 0 
        ? Math.round(((currentStats.totalPoops - previousStats.totalPoops) / previousStats.totalPoops) * 100)
        : currentStats.totalPoops > 0 ? 100 : 0,
      dailyAverageChange: currentStats.extraStats.dailyAverage - previousStats.extraStats.dailyAverage
    };

    return {
      current: currentStats,
      previous: previousStats,
      comparison
    };

  } catch (error) {
    console.error('Karşılaştırmalı istatistik hatası:', error);
    return null;
  }
};
