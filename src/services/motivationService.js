// Motivasyon mesajları
export const MOTIVATION_MESSAGES = {
  // Günlük motivasyonlar
  daily: [
    { text: "Güne harika bir başlangıç! 🌅", emoji: "🌅" },
    { text: "Bugün senin günün! 💪", emoji: "💪" },
    { text: "Her poop bir zafer! 🏆", emoji: "🏆" },
    { text: "Sen bir şampiyonsun! ⭐", emoji: "⭐" },
    { text: "Harika gidiyorsun! 🚀", emoji: "🚀" },
    { text: "Mükemmel performans! ✨", emoji: "✨" },
    { text: "Sen gerçek bir kahramansın! 🦸‍♀️", emoji: "🦸‍♀️" },
    { text: "İnanılmaz! 🤩", emoji: "🤩" }
  ],

  // Başarı kutlamaları
  achievement: [
    { text: "Tebrikler! Yeni bir başarı kazandın! 🎉", emoji: "🎉" },
    { text: "Harika! Başarı rozeti kazandın! 🏅", emoji: "🏅" },
    { text: "Muhteşem! Sen gerçek bir şampiyonsun! 👑", emoji: "👑" },
    { text: "İnanılmaz! Yeni başarın için kutluyoruz! 🎊", emoji: "🎊" },
    { text: "Bravo! Başarı koleksiyonuna yeni bir rozet! 🎖️", emoji: "🎖️" },
    { text: "Harika! Sen gerçekten özel birisin! 💎", emoji: "💎" },
    { text: "Tebrikler! Başarı listende yeni bir madalya! 🥇", emoji: "🥇" },
    { text: "Muhteşem performans! 🎆", emoji: "🎆" }
  ],

  // Streak motivasyonları
  streak: [
    { text: "Harika! Streak devam ediyor! 🔥", emoji: "🔥" },
    { text: "İnanılmaz seri! Sen gerçek bir efsanesin! ⚡", emoji: "⚡" },
    { text: "Mükemmel! Streak listesinde zirvedesin! 🏔️", emoji: "🏔️" },
    { text: "Harika! Bu seri böyle devam etsin! 🌟", emoji: "🌟" },
    { text: "İnanılmaz! Streak şampiyonu sensin! 🚀", emoji: "🚀" },
    { text: "Muhteşem! Bu seri çok etkileyici! 💫", emoji: "💫" },
    { text: "Harika! Streak rekoru kırıyorsun! 📈", emoji: "📈" },
    { text: "İnanılmaz! Sen gerçek bir tutarlılık ustasısın! 🎯", emoji: "🎯" }
  ],

  // Özel durumlar
  special: [
    { text: "Gece kuşu! 🌙", emoji: "🦉" },
    { text: "Erken kalkan! 🌅", emoji: "🐦" },
    { text: "Hız şeytanı! ⚡", emoji: "⚡" },
    { text: "Mükemmel gün! ✨", emoji: "✨" },
    { text: "Haftalık şampiyon! 🥇", emoji: "🥇" },
    { text: "Tutarlı kahraman! ⭐", emoji: "⭐" },
    { text: "Günlük efsane! 💎", emoji: "💎" },
    { text: "Günlük şampiyon! 👑", emoji: "👑" }
  ],

  // Partner motivasyonları
  partner: [
    { text: "Partnerin de harika gidiyor! 👫", emoji: "👫" },
    { text: "İkiniz de şampiyonsunuz! 🏆", emoji: "🏆" },
    { text: "Mükemmel takım çalışması! 🤝", emoji: "🤝" },
    { text: "İkiniz de efsanesiniz! 🌟", emoji: "🌟" },
    { text: "Harika rekabet! 💪", emoji: "💪" },
    { text: "İkiniz de kahramansınız! 🦸‍♀️🦸‍♂️", emoji: "🦸‍♀️🦸‍♂️" },
    { text: "Mükemmel partnerlik! 💕", emoji: "💕" },
    { text: "İkiniz de şampiyonluk seviyesinde! 🎯", emoji: "🎯" }
  ],

  // Genel motivasyonlar
  general: [
    { text: "Sen harikasın! 🌟", emoji: "🌟" },
    { text: "Mükemmel gidiyorsun! 💪", emoji: "💪" },
    { text: "Sen bir şampiyonsun! 🏆", emoji: "🏆" },
    { text: "İnanılmaz performans! 🚀", emoji: "🚀" },
    { text: "Harika iş çıkarıyorsun! ✨", emoji: "✨" },
    { text: "Sen gerçek bir kahramansın! 🦸‍♀️", emoji: "🦸‍♀️" },
    { text: "Muhteşem! 🤩", emoji: "🤩" },
    { text: "Sen özelsin! 💎", emoji: "💎" }
  ]
};

// Rastgele motivasyon mesajı seç
export const getRandomMotivation = (type = 'general') => {
  const messages = MOTIVATION_MESSAGES[type] || MOTIVATION_MESSAGES.general;
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
};

// Başarı tipine göre özel motivasyon mesajı
export const getAchievementMotivation = (achievement) => {
  const type = achievement.type;
  const rarity = achievement.rarity;
  
  let message;
  
  if (type === 'streak') {
    message = getRandomMotivation('streak');
  } else if (type === 'daily') {
    message = getRandomMotivation('daily');
  } else if (type === 'special') {
    message = getRandomMotivation('special');
  } else {
    message = getRandomMotivation('achievement');
  }
  
  // Rarity'ye göre mesajı güçlendir
  if (rarity === 'legendary') {
    message.text = `🌟 ${message.text} 🌟 (Efsanevi!)`;
  } else if (rarity === 'epic') {
    message.text = `💎 ${message.text} 💎 (Epik!)`;
  } else if (rarity === 'rare') {
    message.text = `⭐ ${message.text} ⭐ (Nadir!)`;
  }
  
  return message;
};

// Günlük motivasyon mesajı
export const getDailyMotivation = () => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 12) {
    return getRandomMotivation('daily');
  } else if (hour >= 12 && hour < 18) {
    return { text: "Öğleden sonra harika gidiyorsun! ☀️", emoji: "☀️" };
  } else if (hour >= 18 && hour < 22) {
    return { text: "Akşam da mükemmel! 🌅", emoji: "🌅" };
  } else {
    return { text: "Gece de harika gidiyorsun! 🌙", emoji: "🌙" };
  }
};
