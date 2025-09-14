// Poop emoji temaları
export const POOP_THEMES = {
  classic: {
    id: 'classic',
    name: 'Klasik',
    emoji: '💩',
    description: 'Klasik poop emoji',
    unlocked: true,
    rarity: 'common',
    effect: 'none'
  },
  rainbow: {
    id: 'rainbow',
    name: 'Gökkuşağı',
    emoji: '🌈💩',
    description: 'Renkli poop emoji',
    unlocked: true,
    rarity: 'rare',
    effect: 'rainbow'
  },
  sparkle: {
    id: 'sparkle',
    name: 'Parlak',
    emoji: '✨💩',
    description: 'Parlayan poop emoji',
    unlocked: true,
    rarity: 'rare',
    effect: 'sparkle'
  },
  fire: {
    id: 'fire',
    name: 'Ateş',
    emoji: '🔥💩',
    description: 'Ateşli poop emoji',
    unlocked: true,
    rarity: 'epic',
    effect: 'fire'
  },
  ice: {
    id: 'ice',
    name: 'Buz',
    emoji: '❄️💩',
    description: 'Buzlu poop emoji',
    unlocked: true,
    rarity: 'epic',
    effect: 'ice'
  },
  golden: {
    id: 'golden',
    name: 'Altın',
    emoji: '🥇💩',
    description: 'Altın poop emoji',
    unlocked: true,
    rarity: 'legendary',
    effect: 'golden'
  },
  diamond: {
    id: 'diamond',
    name: 'Elmas',
    emoji: '💎💩',
    description: 'Elmas poop emoji',
    unlocked: true,
    rarity: 'legendary',
    effect: 'diamond'
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    emoji: '💫💩',
    description: 'Neon ışıklı poop emoji',
    unlocked: true,
    rarity: 'legendary',
    effect: 'neon'
  },
  cosmic: {
    id: 'cosmic',
    name: 'Kozmik',
    emoji: '🌟💩',
    description: 'Kozmik poop emoji',
    unlocked: true,
    rarity: 'legendary',
    effect: 'cosmic'
  }
};

// Karakter kostümleri
export const CHARACTER_COSTUMES = {
  default: {
    id: 'default',
    name: 'Varsayılan',
    emoji: '👤',
    description: 'Klasik görünüm',
    unlocked: true,
    rarity: 'common'
  },
  superhero: {
    id: 'superhero',
    name: 'Süper Kahraman',
    emoji: '🦸‍♀️',
    description: 'Süper güçlü görünüm',
    unlocked: true,
    rarity: 'rare',
    effect: 'superhero'
  },
  wizard: {
    id: 'wizard',
    name: 'Büyücü',
    emoji: '🧙‍♀️',
    description: 'Büyülü görünüm',
    unlocked: true,
    rarity: 'rare',
    effect: 'wizard'
  },
  ninja: {
    id: 'ninja',
    name: 'Ninja',
    emoji: '🥷',
    description: 'Gizli savaşçı',
    unlocked: true,
    rarity: 'epic',
    effect: 'ninja'
  },
  robot: {
    id: 'robot',
    name: 'Robot',
    emoji: '🤖',
    description: 'Gelecekçi görünüm',
    unlocked: true,
    rarity: 'epic',
    effect: 'robot'
  },
  alien: {
    id: 'alien',
    name: 'Uzaylı',
    emoji: '👽',
    description: 'Uzaydan gelme',
    unlocked: true,
    rarity: 'legendary',
    effect: 'alien'
  },
  unicorn: {
    id: 'unicorn',
    name: 'Tek Boynuzlu',
    emoji: '🦄',
    description: 'Efsanevi yaratık',
    unlocked: true,
    rarity: 'legendary',
    effect: 'unicorn'
  }
};

// Oda dekorasyonları
export const ROOM_DECORATIONS = {
  basic: {
    id: 'basic',
    name: 'Temel',
    description: 'Sade ve temiz görünüm',
    backgroundColor: '#f8f9fa',
    borderColor: '#dee2e6',
    unlocked: true,
    rarity: 'common'
  },
  cozy: {
    id: 'cozy',
    name: 'Sıcak',
    description: 'Sıcak ve rahat atmosfer',
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    unlocked: true,
    rarity: 'rare',
    effect: 'cozy'
  },
  ocean: {
    id: 'ocean',
    name: 'Okyanus',
    description: 'Mavi ve serin tema',
    backgroundColor: '#d1ecf1',
    borderColor: '#74b9ff',
    unlocked: true,
    rarity: 'rare',
    effect: 'ocean'
  },
  forest: {
    id: 'forest',
    name: 'Orman',
    description: 'Yeşil ve doğal tema',
    backgroundColor: '#d4edda',
    borderColor: '#00b894',
    unlocked: true,
    rarity: 'epic',
    effect: 'forest'
  },
  sunset: {
    id: 'sunset',
    name: 'Gün Batımı',
    description: 'Turuncu ve pembe tonlar',
    backgroundColor: '#ffeaa7',
    borderColor: '#fd79a8',
    unlocked: true,
    rarity: 'epic',
    effect: 'sunset'
  },
  galaxy: {
    id: 'galaxy',
    name: 'Galaksi',
    description: 'Kozmik ve gizemli',
    backgroundColor: '#2d3436',
    borderColor: '#6c5ce7',
    unlocked: true,
    rarity: 'legendary',
    effect: 'galaxy'
  },
  rainbow: {
    id: 'rainbow',
    name: 'Gökkuşağı',
    description: 'Renkli ve neşeli',
    backgroundColor: '#f8f9fa',
    borderColor: '#00cec9',
    unlocked: true,
    rarity: 'legendary',
    effect: 'rainbow'
  }
};

// Renkli poop sayaçları
export const COUNTER_THEMES = {
  classic: {
    id: 'classic',
    name: 'Klasik',
    backgroundColor: '#ffffff',
    textColor: '#333333',
    borderColor: '#333333',
    unlocked: true,
    rarity: 'common'
  },
  neon: {
    id: 'neon',
    name: 'Neon',
    backgroundColor: '#000000',
    textColor: '#00ff00',
    borderColor: '#00ff00',
    unlocked: true,
    rarity: 'rare',
    effect: 'neon'
  },
  sunset: {
    id: 'sunset',
    name: 'Gün Batımı',
    backgroundColor: '#ff6b6b',
    textColor: '#ffffff',
    borderColor: '#ff4757',
    unlocked: true,
    rarity: 'rare',
    effect: 'sunset'
  },
  ocean: {
    id: 'ocean',
    name: 'Okyanus',
    backgroundColor: '#74b9ff',
    textColor: '#ffffff',
    borderColor: '#0984e3',
    unlocked: true,
    rarity: 'epic',
    effect: 'ocean'
  },
  forest: {
    id: 'forest',
    name: 'Orman',
    backgroundColor: '#00b894',
    textColor: '#ffffff',
    borderColor: '#00a085',
    unlocked: true,
    rarity: 'epic',
    effect: 'forest'
  },
  gold: {
    id: 'gold',
    name: 'Altın',
    backgroundColor: '#fdcb6e',
    textColor: '#2d3436',
    borderColor: '#e17055',
    unlocked: true,
    rarity: 'legendary',
    effect: 'gold'
  },
  diamond: {
    id: 'diamond',
    name: 'Elmas',
    backgroundColor: '#ddd6fe',
    textColor: '#4c1d95',
    borderColor: '#8b5cf6',
    unlocked: true,
    rarity: 'legendary',
    effect: 'diamond'
  }
};

// Tema kilidi açma koşulları
export const UNLOCK_CONDITIONS = {
  // Poop temaları
  rainbow: { type: 'achievement', condition: 'weekly_winner' },
  sparkle: { type: 'achievement', condition: 'daily_champion' },
  fire: { type: 'streak', condition: 7 },
  ice: { type: 'streak', condition: 14 },
  golden: { type: 'achievement', condition: 'streak_30' },
  diamond: { type: 'achievement', condition: 'daily_legend' },

  // Karakter kostümleri
  superhero: { type: 'achievement', condition: 'daily_hero' },
  wizard: { type: 'achievement', condition: 'night_owl' },
  ninja: { type: 'achievement', condition: 'early_bird' },
  robot: { type: 'achievement', condition: 'speed_demon' },
  alien: { type: 'achievement', condition: 'weekly_consistent' },
  unicorn: { type: 'achievement', condition: 'perfect_day' },

  // Oda dekorasyonları
  cozy: { type: 'streak', condition: 3 },
  ocean: { type: 'achievement', condition: 'weekly_winner' },
  forest: { type: 'streak', condition: 14 },
  sunset: { type: 'achievement', condition: 'daily_champion' },
  galaxy: { type: 'achievement', condition: 'streak_30' },
  rainbow: { type: 'achievement', condition: 'daily_legend' },

  // Sayaç temaları
  neon: { type: 'achievement', condition: 'daily_hero' },
  sunset: { type: 'achievement', condition: 'weekly_winner' },
  ocean: { type: 'streak', condition: 7 },
  forest: { type: 'achievement', condition: 'weekly_consistent' },
  gold: { type: 'achievement', condition: 'streak_30' },
  diamond: { type: 'achievement', condition: 'daily_legend' }
};

// Kullanıcı temasını kaydet
export const saveUserTheme = async (roomId, characterId, themeType, themeId) => {
  try {
    const { db } = await import('../firebase/config');
    const { doc, setDoc } = await import('firebase/firestore');
    
    const themeRef = doc(db, 'rooms', roomId, 'characters', characterId, 'themes', themeType);
    
    await setDoc(themeRef, {
      themeType,
      themeId,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Tema kaydetme hatası:', error);
  }
};

// Kullanıcı temasını getir
export const getUserTheme = async (roomId, characterId, themeType) => {
  try {
    const { db } = await import('../firebase/config');
    const { doc, getDoc } = await import('firebase/firestore');
    
    const themeRef = doc(db, 'rooms', roomId, 'characters', characterId, 'themes', themeType);
    const themeSnap = await getDoc(themeRef);
    
    if (themeSnap.exists()) {
      return themeSnap.data().themeId;
    }
    return 'default'; // Varsayılan tema
  } catch (error) {
    console.error('Tema getirme hatası:', error);
    return 'default';
  }
};

// Tema kilidini aç
export const unlockTheme = async (roomId, characterId, themeId) => {
  try {
    const { db } = await import('../firebase/config');
    const { doc, setDoc } = await import('firebase/firestore');
    
    const unlockRef = doc(db, 'rooms', roomId, 'characters', characterId, 'unlocks', themeId);
    
    await setDoc(unlockRef, {
      themeId,
      unlockedAt: new Date(),
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Tema kilidi açma hatası:', error);
  }
};

// Açılmış temaları getir
export const getUnlockedThemes = async (roomId, characterId) => {
  try {
    const { db } = await import('../firebase/config');
    const { collection, getDocs } = await import('firebase/firestore');
    
    const unlocksRef = collection(db, 'rooms', roomId, 'characters', characterId, 'unlocks');
    const snapshot = await getDocs(unlocksRef);
    
    return snapshot.docs.map(doc => doc.data().themeId);
  } catch (error) {
    console.error('Açılmış temalar getirme hatası:', error);
    return ['default', 'classic', 'basic']; // Varsayılan açık temalar
  }
};
