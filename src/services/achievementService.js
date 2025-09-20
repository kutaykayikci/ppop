import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs, query, where, orderBy, updateDoc, arrayUnion } from 'firebase/firestore';
import { getFirebaseErrorMessage, logError } from '../utils/errorUtils';

// Basit achievement definitions
export const SIMPLE_ACHIEVEMENTS = [
  {
    id: 'first_poop',
    title: 'Ilk Adim',
    description: 'Ilk poop\'unu yaptin!',
    icon: '🎉',
    condition: (stats) => stats.totalPoopCount >= 1
  },
  {
    id: 'early_bird',
    title: 'Erken Kus',
    description: '5 poop tamamladin!',
    icon: '🐦',
    condition: (stats) => stats.totalPoopCount >= 5
  },
  {
    id: 'social_butterfly',
    title: 'Sosyal Kelebek',
    description: '3 farkli odaya katildin!',
    icon: '🦋',
    condition: (stats) => (stats.joinedRooms?.length || 0) >= 3
  },
  {
    id: 'team_player',
    title: 'Takim Oyuncusu',
    description: '5 farkli odaya katildin!',
    icon: '👥',
    condition: (stats) => (stats.joinedRooms?.length || 0) >= 5
  },
  {
    id: 'productive',
    title: 'Uretken',
    description: '25 poop tamamladin!',
    icon: '⚡',
    condition: (stats) => stats.totalPoopCount >= 25
  },
  {
    id: 'poop_master',
    title: 'Poop Ustasi',
    description: '100 poop tamamladin!',
    icon: '👑',
    condition: (stats) => stats.totalPoopCount >= 100
  },
  {
    id: 'legend',
    title: 'Efsane',
    description: '500 poop tamamladin!',
    icon: '💎',
    condition: (stats) => stats.totalPoopCount >= 500
  }
];

// Kullanici achievement'larini kontrol et
export const checkUserAchievements = async (userId, userStats) => {
  try {
    const newAchievements = [];
    const currentAchievements = userStats.achievements || [];
    
    for (const achievement of SIMPLE_ACHIEVEMENTS) {
      const hasAchievement = currentAchievements.includes(achievement.id);
      
      if (!hasAchievement && achievement.condition(userStats)) {
        newAchievements.push(achievement);
        
        // Firestore'da achievement ekle
        await updateDoc(doc(db, 'users', userId), {
          achievements: arrayUnion(achievement.id)
        });
        
        console.log(`🏆 Yeni basarim: ${achievement.title}`);
      }
    }
    
    return newAchievements;
  } catch (error) {
    logError(error, 'checkUserAchievements');
    return [];
  }
};

// Basarim bilgilerini getir
export const getAchievementInfo = (achievementId) => {
  return SIMPLE_ACHIEVEMENTS.find(a => a.id === achievementId);
};

// Tum basarimlari getir
export const getAllAchievements = () => {
  return SIMPLE_ACHIEVEMENTS;
};

// ESKİ SYSTEM:
// Başarı türleri ve koşulları
export const ACHIEVEMENT_TYPES = {
  // Günlük hedefler
  DAILY_HERO: {
    id: 'daily_hero',
    name: 'Günlük Kahraman',
    description: 'Günde 3+ poop yap',
    emoji: '🏆',
    target: 3,
    type: 'daily',
    rarity: 'common'
  },
  DAILY_CHAMPION: {
    id: 'daily_champion',
    name: 'Günlük Şampiyon',
    description: 'Günde 5+ poop yap',
    emoji: '👑',
    target: 5,
    type: 'daily',
    rarity: 'rare'
  },
  DAILY_LEGEND: {
    id: 'daily_legend',
    name: 'Günlük Efsane',
    description: 'Günde 7+ poop yap',
    emoji: '💎',
    target: 7,
    type: 'daily',
    rarity: 'legendary'
  },

  // Haftalık şampiyonluk
  WEEKLY_WINNER: {
    id: 'weekly_winner',
    name: 'Haftalık Şampiyon',
    description: 'Haftada en çok poop yapan ol',
    emoji: '🥇',
    type: 'weekly',
    rarity: 'epic'
  },
  WEEKLY_CONSISTENT: {
    id: 'weekly_consistent',
    name: 'Tutarlı Kahraman',
    description: '7 gün boyunca günde en az 2 poop yap',
    emoji: '⭐',
    target: 2,
    type: 'weekly',
    rarity: 'rare'
  },

  // Özel başarılar
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Gece Kuşu',
    description: 'Gece 2\'den sonra poop yap',
    emoji: '🦉',
    type: 'special',
    rarity: 'rare'
  },
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Erken Kalkan',
    description: 'Sabah 6\'dan önce poop yap',
    emoji: '🐦',
    type: 'special',
    rarity: 'rare'
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Hız Şeytanı',
    description: '10 dakika içinde 2 poop yap',
    emoji: '⚡',
    type: 'special',
    rarity: 'epic'
  },
  PERFECT_DAY: {
    id: 'perfect_day',
    name: 'Mükemmel Gün',
    description: 'Günde tam 3 poop yap',
    emoji: '✨',
    target: 3,
    type: 'special',
    rarity: 'rare'
  },

  // Streak başarıları
  STREAK_3: {
    id: 'streak_3',
    name: '3 Günlük Seri',
    description: '3 gün arka arkaya poop yap',
    emoji: '🔥',
    target: 3,
    type: 'streak',
    rarity: 'common'
  },
  STREAK_7: {
    id: 'streak_7',
    name: '1 Haftalık Seri',
    description: '7 gün arka arkaya poop yap',
    emoji: '🚀',
    target: 7,
    type: 'streak',
    rarity: 'rare'
  },
  STREAK_14: {
    id: 'streak_14',
    name: '2 Haftalık Seri',
    description: '14 gün arka arkaya poop yap',
    emoji: '💫',
    target: 14,
    type: 'streak',
    rarity: 'epic'
  },
  STREAK_30: {
    id: 'streak_30',
    name: '1 Aylık Seri',
    description: '30 gün arka arkaya poop yap',
    emoji: '🌟',
    target: 30,
    type: 'streak',
    rarity: 'legendary'
  }
};

// Rarity renkleri
export const RARITY_COLORS = {
  common: '#95A5A6',
  rare: '#3498DB',
  epic: '#9B59B6',
  legendary: '#F39C12'
};

// Başarı kazanma fonksiyonu
export const checkAchievements = async (roomId, characterId, poopData) => {
  const achievements = [];
  const today = new Date().toISOString().split('T')[0];
  const currentHour = new Date().getHours();

  // Günlük başarıları kontrol et
  const todayPoops = await getTodayPoops(roomId, characterId);
  const todayCount = todayPoops.length;

  // Günlük hedefler
  if (todayCount >= ACHIEVEMENT_TYPES.DAILY_HERO.target && todayCount < ACHIEVEMENT_TYPES.DAILY_CHAMPION.target) {
    achievements.push(ACHIEVEMENT_TYPES.DAILY_HERO);
  }
  if (todayCount >= ACHIEVEMENT_TYPES.DAILY_CHAMPION.target && todayCount < ACHIEVEMENT_TYPES.DAILY_LEGEND.target) {
    achievements.push(ACHIEVEMENT_TYPES.DAILY_CHAMPION);
  }
  if (todayCount >= ACHIEVEMENT_TYPES.DAILY_LEGEND.target) {
    achievements.push(ACHIEVEMENT_TYPES.DAILY_LEGEND);
  }

  // Özel başarılar
  if (currentHour >= 2 && currentHour < 6) {
    achievements.push(ACHIEVEMENT_TYPES.NIGHT_OWL);
  }
  if (currentHour >= 4 && currentHour < 6) {
    achievements.push(ACHIEVEMENT_TYPES.EARLY_BIRD);
  }
  if (todayCount === ACHIEVEMENT_TYPES.PERFECT_DAY.target) {
    achievements.push(ACHIEVEMENT_TYPES.PERFECT_DAY);
  }

  // Hız şeytanı kontrolü (son 10 dakika içinde 2 poop)
  if (todayPoops.length >= 2) {
    const lastPoop = todayPoops[todayPoops.length - 1];
    const currentTime = new Date();
    const lastPoopTime = new Date(lastPoop.timestamp);
    const timeDiff = (currentTime - lastPoopTime) / (1000 * 60); // dakika

    if (timeDiff <= 10) {
      achievements.push(ACHIEVEMENT_TYPES.SPEED_DEMON);
    }
  }

  // Başarıları kaydet
  for (const achievement of achievements) {
    await saveAchievement(roomId, characterId, achievement, today);
  }

  return achievements;
};

// Streak kontrolü
export const checkStreak = async (roomId, characterId) => {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayPoops = await getDayPoops(roomId, characterId, dateStr);
    
    if (dayPoops.length > 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  // Streak başarılarını kontrol et
  const streakAchievements = [];
  if (streak >= 3 && streak < 7) {
    streakAchievements.push(ACHIEVEMENT_TYPES.STREAK_3);
  }
  if (streak >= 7 && streak < 14) {
    streakAchievements.push(ACHIEVEMENT_TYPES.STREAK_7);
  }
  if (streak >= 14 && streak < 30) {
    streakAchievements.push(ACHIEVEMENT_TYPES.STREAK_14);
  }
  if (streak >= 30) {
    streakAchievements.push(ACHIEVEMENT_TYPES.STREAK_30);
  }

  // Streak başarılarını kaydet
  for (const achievement of streakAchievements) {
    await saveAchievement(roomId, characterId, achievement, today.toISOString().split('T')[0]);
  }

  return { streak, achievements: streakAchievements };
};

// Başarı kaydetme
const saveAchievement = async (roomId, characterId, achievement, date) => {
  const achievementRef = doc(db, 'rooms', roomId, 'characters', characterId, 'achievements', `${achievement.id}_${date}`);
  
  try {
    await setDoc(achievementRef, {
      achievementId: achievement.id,
      name: achievement.name,
      description: achievement.description,
      emoji: achievement.emoji,
      type: achievement.type,
      rarity: achievement.rarity,
      date: date,
      timestamp: new Date(),
      roomId,
      characterId
    });
  } catch (error) {
    console.error('Başarı kaydetme hatası:', error);
  }
};

// Kullanıcının başarılarını getir
export const getUserAchievements = async (roomId, characterId) => {
  const achievementsRef = collection(db, 'rooms', roomId, 'characters', characterId, 'achievements');
  const q = query(achievementsRef, orderBy('timestamp', 'desc'));
  
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Başarıları getirme hatası:', error);
    return [];
  }
};

// Yardımcı fonksiyonlar
const getTodayPoops = async (roomId, characterId) => {
  const today = new Date().toISOString().split('T')[0];
  return getDayPoops(roomId, characterId, today);
};

const getDayPoops = async (roomId, characterId, date) => {
  const poopsRef = collection(db, 'rooms', roomId, 'poops');
  const q = query(
    poopsRef,
    where('characterId', '==', characterId),
    where('date', '==', date)
  );
  
  try {
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Günlük poops getirme hatası:', error);
    return [];
  }
};
