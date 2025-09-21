import React, { useState, useEffect } from 'react';
import PixelButton from '@/components/PixelButton';
import PixelCard from '@/components/PixelCard';
import AchievementNotification from '@/components/Achievement/AchievementNotification';
import MotivationMessage from '@/components/Motivation/MotivationMessage';
import AnimatedPopup from '@/components/Notification/AnimatedPopup';
import { addPoopEntry, getTodayPoops } from '@/firebase/poopService';
import { checkAchievements, checkStreak } from '@/services/achievementService';
import { getAchievementMotivation, getDailyMotivation } from '@/services/motivationService';
import { POOP_THEMES, CHARACTER_COSTUMES, ROOM_DECORATIONS, COUNTER_THEMES, getUserTheme } from '@/services/themeService';
import { sendAchievementNotification, sendPartnerActivityNotification, sendPushNotification } from '@/services/notificationService';
import soundService from '@/services/soundService';
import { createQueue, processQueue } from '@/services/offlineQueueService';
import { getUnlockedMiniGames, getNextUnlockInfo } from '@/services/miniGamesService';
import TapConfetti from '@/components/Minigames/TapConfetti';
import ReactionTest from '@/components/Minigames/ReactionTest';
import { detectRecentSynergy } from '@/services/partnerSynergyService';
import { showPoopAdded, showAchievementUnlocked, showMotivationMessage } from '@/services/feedbackManager';

const PoopCounter = ({ character, profile, userColor, roomId, onPoopAdded }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState('');
  const [particles, setParticles] = useState([]);
  const [showCountJump, setShowCountJump] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [explosionEffect, setExplosionEffect] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [motivationMessage, setMotivationMessage] = useState(null);
  const [streak, setStreak] = useState(0);

  // Güvenlik kontrolü - eğer gerekli prop'lar eksikse hata göster
  if (!character || !profile || !roomId) {
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#fff3cd',
        border: '2px solid #ffeaa7',
        borderRadius: '8px',
        margin: '10px'
      }}>
        <p style={{ color: '#856404', margin: 0 }}>
          ⚠️ Karakter veya profil bilgisi yükleniyor...
        </p>
      </div>
    );
  }
  const [userThemes, setUserThemes] = useState({
    poop: 'classic',
    costume: 'default',
    room: 'basic',
    counter: 'classic'
  });
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [dailyPopupData, setDailyPopupData] = useState(null);
  const [showMiniGame, setShowMiniGame] = useState(null);

  useEffect(() => {
    loadTodayCount();
    loadStreak();
    loadUserThemes();
    // Offline kuyruk flush
    (async () => {
      await processQueue('poops', async (item) => {
        try {
          await addPoopEntry(item.roomId, item.characterId, item.profileId, new Date(item.createdAt))
          return true
        } catch {
          return false
        }
      }, 20)
    })()
  }, [roomId, character.id]);

  const loadUserThemes = async () => {
    try {
      const [poopTheme, costumeTheme, roomTheme, counterTheme] = await Promise.all([
        getUserTheme(roomId, character.id, 'poop'),
        getUserTheme(roomId, character.id, 'costume'),
        getUserTheme(roomId, character.id, 'room'),
        getUserTheme(roomId, character.id, 'counter')
      ]);

      setUserThemes({
        poop: poopTheme || 'classic',
        costume: costumeTheme || 'default',
        room: roomTheme || 'basic',
        counter: counterTheme || 'classic'
      });
    } catch (error) {
      console.error('Kullanıcı temalarını yükleme hatası:', error);
    }
  };

  

  // Motivasyon mesajı göster
  useEffect(() => {
    if (count > 0 && count % 3 === 0) {
      const motivation = getDailyMotivation();
      setMotivationMessage(motivation);
      setTimeout(() => setMotivationMessage(null), 4000);
    }
  }, [count]);

  const loadTodayCount = async () => {
    try {
      if (!character || !character.id || !roomId) {
        setCount(0);
        return;
      }
      
      const todayPoops = await getTodayPoops(roomId);
      const characterPoops = todayPoops.filter(poop => poop.characterId === character.id);
      setCount(characterPoops.length);
    } catch (error) {
      console.error('Bugünkü poop sayısını yükleme hatası:', error);
      setCount(0);
    }
  };

  const loadStreak = async () => {
    try {
      if (!character || !character.id || !roomId) {
        setStreak(0);
        return;
      }
      
      const streakData = await checkStreak(roomId, character.id);
      setStreak(streakData.streak);
    } catch (error) {
      console.error('Streak yükleme hatası:', error);
      setStreak(0);
    }
  };

  const createParticles = () => {
    const currentPoopTheme = POOP_THEMES[userThemes.poop];
    const particleEmoji = currentPoopTheme ? currentPoopTheme.emoji : '💩';
    
    const newParticles = [];
    // Daha fazla parçacık
    for (let i = 0; i < 12; i++) {
      newParticles.push({
        id: Date.now() + i + Math.random(),
        emoji: particleEmoji,
        left: 50 + (Math.random() - 0.5) * 80,
        top: 50 + (Math.random() - 0.5) * 60,
        delay: Math.random() * 300,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4
        }
      });
    }
    setParticles(newParticles);
    
    // Parçacıkları temizle
    setTimeout(() => setParticles([]), 1500);
  };

  const createScreenShake = () => {
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 500);
  };

  const createExplosionEffect = () => {
    setExplosionEffect(true);
    setTimeout(() => setExplosionEffect(false), 800);
  };

  const createFloatingNumbers = () => {
    const newNumbers = [];
    for (let i = 0; i < 3; i++) {
      newNumbers.push({
        id: Date.now() + i,
        value: ['+1', '💩', '🎉'][i],
        left: 40 + Math.random() * 20,
        top: 30 + Math.random() * 40,
        delay: i * 100
      });
    }
    setFloatingNumbers(newNumbers);
    setTimeout(() => setFloatingNumbers([]), 2000);
  };

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
    const newConfetti = [];
    
    for (let i = 0; i < 20; i++) {
      newConfetti.push({
        id: Date.now() + i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100,
        top: -10,
        delay: Math.random() * 500,
        rotation: Math.random() * 360,
        size: 5 + Math.random() * 10
      });
    }
    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 3000);
  };

  const handlePoopClick = async () => {
    if (loading) return;
    
    // Güvenlik kontrolleri
    if (!character || !character.id) {
      console.warn('Karakter bilgisi bulunamadı.');
      return;
    }
    
    if (!profile || !profile.id) {
      console.warn('Profil bilgisi bulunamadı.');
      return;
    }
    
    if (!roomId) {
      console.warn('Oda bilgisi bulunamadı.');
      return;
    }
    
    setLoading(true);
    setAnimation('poop-explosion');
    soundService.playPoop();
    
    // Tüm havalı efektleri başlat!
    createParticles();
    createScreenShake();
    createExplosionEffect();
    createFloatingNumbers();
    
    // 5'in katlarında konfeti
    if ((count + 1) % 5 === 0) {
      createConfetti();
    }
    
    try {
      const result = await addPoopEntry(roomId, character.id, profile.id);
      
      // Veritabanından güncel sayıyı al
      await loadTodayCount();
      
      // Yeni merkezi feedback sistemi ile poop eklendi bildirimi
      showPoopAdded(count + 1, {
        animation: 'bounce',
        sound: 'poop',
        vibration: [50, 50, 50]
      });
      
      // Sayı zıplama animasyonunu başlat
      setShowCountJump(true);
      setTimeout(() => setShowCountJump(false), 1000);
      
      // Başarıları kontrol et
      const newAchievements = await checkAchievements(roomId, character.id, {
        timestamp: new Date(),
        characterId: character.id,
        profileId: profile.id
      });
      
      if (newAchievements.length > 0) {
        setAchievements(newAchievements);
        soundService.playAchievement();
        
        // Yeni merkezi feedback sistemi ile başarı bildirimi
        showAchievementUnlocked(newAchievements[0], {
          animation: 'bounce',
          sound: 'achievement',
          vibration: [200, 100, 200, 100, 200]
        });
        
        // İlk başarı için motivasyon mesajı göster
        const motivation = getAchievementMotivation(newAchievements[0]);
        setMotivationMessage(motivation);
        setTimeout(() => setMotivationMessage(null), 5000);
        
        // Push bildirim gönder
        await sendPushNotification({
          title: '🏆 Yeni Başarı!',
          body: `${newAchievements[0].name} başarısını kazandın! ${newAchievements[0].emoji}`,
          icon: newAchievements[0].emoji,
          type: 'achievement'
        });
      }

      
      // Streak'i güncelle ve değerini kullan
      let newStreakValue = 0;
      try {
        const streakData = await checkStreak(roomId, character.id);
        newStreakValue = streakData.streak;
        setStreak(newStreakValue);
      } catch {}
      // Mini oyun kilitleri
      const unlocked = getUnlockedMiniGames(newStreakValue);
      if (unlocked.length > 0) {
        const pick = unlocked[0].id;
        setShowMiniGame(pick);
      }
      // Partner sinerjisi tespiti (son 2 dk içinde)
      try {
        const recent = await detectRecentSynergy(roomId, character.id, 120);
        if (recent) {
          await sendPushNotification({
            title: '👫 Partner Sinerjisi!',
            body: 'Aynı anda aktifsiniz! Birlikte hedefe yürüyün!'
              , icon: '💞', type: 'partner_activity'
          }, { roomId, characterId: character.id, partner: recent.characterId });
        }
      } catch {}
      
      // Günlük popup göster (sadece ilk poop'ta)
      if (count === 1) {
        setDailyPopupData({
          title: "🎉 Bugün Poop Yaptık!",
          message: `${character.name} ilk poop'unu yaptı! Harika başlangıç! 🚀`,
          icon: "💩",
          type: "success"
        });
        setShowDailyPopup(true);
      }
      
      // İstatistikleri güncelle
      if (onPoopAdded) {
        onPoopAdded();
      }
      
    } catch (error) {
      console.error('Poop ekleme hatası:', error);
      // Offline fallback: kuyruğa ekle
      try {
        const queue = createQueue('poops');
        queue.enqueue({ roomId, characterId: character.id, profileId: profile.id, createdAt: new Date().toISOString() });
      } catch {}
      soundService.playError();
      setAnimation('shake');
      setTimeout(() => setAnimation(''), 500);
    } finally {
      setLoading(false);
      setTimeout(() => setAnimation(''), 800);
    }
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Oda temasını uygula
  const currentRoomTheme = ROOM_DECORATIONS[userThemes.room];
  const roomStyle = {
    backgroundColor: currentRoomTheme?.backgroundColor || userColor.background,
    borderColor: currentRoomTheme?.borderColor || userColor.border,
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div style={{
      position: 'relative',
      transform: screenShake ? 'translate(2px, 1px) rotate(0.5deg)' : 'translate(0, 0) rotate(0deg)',
      transition: screenShake ? 'none' : 'transform 0.1s ease-out'
    }}>
      {/* Ekran sarsıntısı efekti */}
      {screenShake && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 0, 0.1)',
          pointerEvents: 'none',
          zIndex: 1000,
          animation: 'screen-shake 0.5s ease-in-out'
        }} />
      )}
      
      {/* Patlama efekti */}
      {explosionEffect && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,0,0.8) 0%, rgba(255,165,0,0.6) 30%, rgba(255,0,0,0.4) 60%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 999,
          animation: 'explosion 0.8s ease-out forwards'
        }} />
      )}
      
      {/* Uçan sayılar */}
      {floatingNumbers.map(number => (
        <div
          key={number.id}
          style={{
            position: 'absolute',
            left: `${number.left}%`,
            top: `${number.top}%`,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#FFD700',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            pointerEvents: 'none',
            zIndex: 1001,
            animation: `float-up ${number.delay}ms ease-out forwards`,
            transform: 'translateY(0)',
            opacity: 1
          }}
        >
          {number.value}
        </div>
      ))}
      
      {/* Konfeti */}
      {confetti.map(conf => (
        <div
          key={conf.id}
          style={{
            position: 'absolute',
            left: `${conf.left}%`,
            top: `${conf.top}%`,
            width: `${conf.size}px`,
            height: `${conf.size}px`,
            backgroundColor: conf.color,
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex: 998,
            animation: `confetti-fall ${conf.delay}ms ease-in forwards`,
            transform: `rotate(${conf.rotation}deg)`
          }}
        />
      ))}
      
      <PixelCard 
        style={roomStyle}
      >
      {/* Parçacık efektleri */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="poop-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}ms`,
            fontSize: `${20 * particle.scale}px`,
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 10,
            transform: `translate(-50%, -50%) rotate(${particle.rotation}deg) scale(${particle.scale})`,
            animation: 'enhanced-particle-explosion 1.5s ease-out forwards'
          }}
        >
          {particle.emoji}
        </div>
      ))}
      
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ 
          color: userColor.text,
          marginBottom: '20px',
          fontSize: '14px',
          animation: animation ? `${animation}` : 'none'
        }}>
          {character.name} {CHARACTER_COSTUMES[userThemes.costume]?.emoji || character.emoji}
        </h2>
        
        {profile && (
          <div style={{
            fontSize: '10px',
            color: userColor.text,
            marginBottom: '10px',
            opacity: 0.8
          }}>
            {profile.firstName} {profile.lastName}
          </div>
        )}
        
        <div 
          className={`${userThemes.counter !== 'classic' ? `counter-${userThemes.counter}` : ''}`}
          style={{ 
            fontSize: window.innerWidth < 768 ? '36px' : '48px', 
            marginBottom: '10px',
            position: 'relative',
            animation: showCountJump ? 'count-jump' : 'none',
            padding: window.innerWidth < 768 ? '8px' : '10px',
            borderRadius: '8px',
            border: '2px solid #333',
            minHeight: window.innerWidth < 768 ? '50px' : '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {count}
        </div>

        {/* Streak gösterimi */}
        {streak > 0 && (
          <div style={{
            fontSize: '10px',
            color: '#E74C3C',
            marginBottom: '10px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px'
          }}>
            🔥 {streak} Günlük Seri
          </div>
        )}
        
        <div style={{ 
          fontSize: '10px', 
          color: 'var(--color-text)',
          marginBottom: '20px',
          opacity: 0.7
        }}>
          Bugünkü Sayı
        </div>
        
        <PixelButton
          onClick={handlePoopClick}
          disabled={loading}
          style={{
            backgroundColor: userColor.button,
            borderColor: userColor.buttonBorder,
            color: '#fff',
            fontSize: window.innerWidth < 768 ? '14px' : '12px',
            padding: window.innerWidth < 768 ? '20px 40px' : '15px 30px',
            animation: loading ? 'button-squash' : 'none',
            minWidth: window.innerWidth < 768 ? '120px' : '100px',
            minHeight: window.innerWidth < 768 ? '50px' : '40px'
          }}
          className={`glow-effect ${userThemes.poop !== 'classic' ? `poop-button-${userThemes.poop}` : ''}`}
        >
          {loading ? 'Ekleniyor...' : `${POOP_THEMES[userThemes.poop]?.emoji || '💩'} +1 Poop!`}
        </PixelButton>
        
        <div style={{ 
          fontSize: '8px', 
          color: userColor.text,
          marginTop: '15px',
          opacity: 0.6
        }}>
          Son: {formatTime()}
        </div>

        
      </div>

      {/* Başarı bildirimleri */}
      {achievements.map((achievement, index) => (
        <AchievementNotification
          key={`${achievement.id}_${index}`}
          achievement={achievement}
          onClose={() => setAchievements(prev => prev.filter(a => a !== achievement))}
        />
      ))}

      {/* Motivasyon mesajı */}
      {motivationMessage && (
        <MotivationMessage
          message={motivationMessage}
          type="achievement"
          onClose={() => setMotivationMessage(null)}
        />
      )}

      {/* Günlük Popup */}
      {showDailyPopup && dailyPopupData && (
        <AnimatedPopup
          title={dailyPopupData.title}
          message={dailyPopupData.message}
          icon={dailyPopupData.icon}
          type={dailyPopupData.type}
          duration={5000}
          show={showDailyPopup}
          onClose={() => {
            setShowDailyPopup(false);
            setDailyPopupData(null);
          }}
        />
      )}

      {/* Mini Oyunlar */}
      {showMiniGame === 'tap_confetti' && (
        <TapConfetti onClose={() => setShowMiniGame(null)} />
      )}
      {showMiniGame === 'reaction_test' && (
        <ReactionTest onClose={() => setShowMiniGame(null)} />
      )}

      
    </PixelCard>
    
    {/* CSS Animasyonları */}
    <style>{`
      @keyframes enhanced-particle-explosion {
        0% {
          transform: translate(-50%, -50%) rotate(0deg) scale(1);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -50%) rotate(180deg) scale(1.5);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg) scale(0.2);
          opacity: 0;
        }
      }
      
      @keyframes screen-shake {
        0%, 100% { transform: translate(0, 0) rotate(0deg); }
        10% { transform: translate(-2px, -1px) rotate(-0.5deg); }
        20% { transform: translate(2px, 1px) rotate(0.5deg); }
        30% { transform: translate(-1px, 2px) rotate(-0.3deg); }
        40% { transform: translate(1px, -2px) rotate(0.3deg); }
        50% { transform: translate(-2px, 1px) rotate(-0.5deg); }
        60% { transform: translate(2px, -1px) rotate(0.5deg); }
        70% { transform: translate(-1px, -2px) rotate(-0.3deg); }
        80% { transform: translate(1px, 2px) rotate(0.3deg); }
        90% { transform: translate(-2px, -1px) rotate(-0.5deg); }
      }
      
      @keyframes explosion {
        0% {
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.2);
          opacity: 0.8;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
      
      @keyframes float-up {
        0% {
          transform: translateY(0);
          opacity: 1;
        }
        100% {
          transform: translateY(-100px);
          opacity: 0;
        }
      }
      
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
      
      @keyframes count-jump {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
    `}</style>
    </div>
  );
};

export default PoopCounter;
