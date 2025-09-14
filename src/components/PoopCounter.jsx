import React, { useState, useEffect } from 'react';
import PixelButton from './PixelButton';
import PixelCard from './PixelCard';
import AchievementNotification from './Achievement/AchievementNotification';
import MotivationMessage from './Motivation/MotivationMessage';
import ThemeSelector from './Theme/ThemeSelector';
import NotificationSettings from './Notification/NotificationSettings';
import AnimatedPopup from './Notification/AnimatedPopup';
import { addPoopEntry, getTodayPoops } from '../firebase/poopService';
import { checkAchievements, checkStreak } from '../services/achievementService';
import { getAchievementMotivation, getDailyMotivation } from '../services/motivationService';
import { POOP_THEMES, CHARACTER_COSTUMES, ROOM_DECORATIONS, COUNTER_THEMES, getUserTheme } from '../services/themeService';
import { sendAchievementNotification, sendPartnerActivityNotification, sendPushNotification } from '../services/notificationService';
import { sendPartnerActivityNotification as sendSmartPartnerNotification } from '../services/smartPushService';
import { checkAndSaveNotificationPermission, savePermissionToLocalStorage } from '../services/permissionService';
import soundService from '../services/soundService';

const PoopCounter = ({ character, profile, userColor, roomId, onPoopAdded }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animation, setAnimation] = useState('');
  const [particles, setParticles] = useState([]);
  const [showCountJump, setShowCountJump] = useState(false);
  const [achievements, setAchievements] = useState([]);
  const [motivationMessage, setMotivationMessage] = useState(null);
  const [streak, setStreak] = useState(0);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [userThemes, setUserThemes] = useState({
    poop: 'classic',
    costume: 'default',
    room: 'basic',
    counter: 'classic'
  });
  const [showDailyPopup, setShowDailyPopup] = useState(false);
  const [dailyPopupData, setDailyPopupData] = useState(null);

  useEffect(() => {
    loadTodayCount();
    loadStreak();
    loadUserThemes();
    initializeNotificationPermission();
  }, [roomId, character.id]);

  // Bildirim iznini kalıcı olarak kaydet
  const initializeNotificationPermission = async () => {
    try {
      const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
      localStorage.setItem('userId', userId);
      
      const result = await checkAndSaveNotificationPermission(userId, character.id, roomId);
      
      if (result.success) {
        savePermissionToLocalStorage(userId, result.permission);
        console.log('Bildirim izni kalıcı olarak kaydedildi:', result.permission);
      }
    } catch (error) {
      console.error('Bildirim izni kaydetme hatası:', error);
    }
  };

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

  const handleThemeChange = (themeType, themeId) => {
    setUserThemes(prev => ({
      ...prev,
      [themeType]: themeId
    }));
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
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: Date.now() + i,
        emoji: particleEmoji,
        left: 50 + (Math.random() - 0.5) * 60,
        top: 50 + (Math.random() - 0.5) * 40,
        delay: Math.random() * 200
      });
    }
    setParticles(newParticles);
    
    // Parçacıkları temizle
    setTimeout(() => setParticles([]), 1200);
  };

  const handlePoopClick = async () => {
    if (loading) return;
    
    setLoading(true);
    setAnimation('poop-explosion');
    soundService.playPoop();
    
    // Parçacık efektini başlat
    createParticles();
    
    try {
      const result = await addPoopEntry(roomId, character.id, profile.id);
      
      // Veritabanından güncel sayıyı al
      await loadTodayCount();
      
      // Sayı zıplama animasyonunu başlat
      setShowCountJump(true);
      setTimeout(() => setShowCountJump(false), 1000);
      
      // Başarıları kontrol et
      const newAchievements = await checkAchievements(roomId, character.id, {
        timestamp: new Date(),
        characterId: character.id
      });
      
      if (newAchievements.length > 0) {
        setAchievements(newAchievements);
        soundService.playAchievement();
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

      // Partner aktivitesi bildirimi gönder (akıllı push)
      try {
        const partnerNotification = await sendSmartPartnerNotification(
          roomId, 
          character.id, 
          character.name, 
          character.emoji
        );
        
        if (partnerNotification.success) {
          console.log(`Partner bildirimi gönderildi: ${partnerNotification.sent}/${partnerNotification.total} başarılı`);
        }
      } catch (error) {
        console.error('Partner bildirimi hatası:', error);
      }
      
      // Streak'i güncelle
      await loadStreak();
      
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
      soundService.playError();
      alert(`Hata: ${error.message || 'Poop eklenemedi!'}`);
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
            animationDelay: `${particle.delay}ms`
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
            fontSize: '48px', 
            marginBottom: '10px',
            position: 'relative',
            animation: showCountJump ? 'count-jump' : 'none',
            padding: '10px',
            borderRadius: '8px',
            border: '2px solid #333'
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
          color: userColor.text,
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
            fontSize: '12px',
            padding: '15px 30px',
            animation: loading ? 'button-squash' : 'none'
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

        {/* Ayarlar butonları */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '5px'
        }}>
          <button
            onClick={() => {
              soundService.playClick();
              setShowNotificationSettings(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              transition: 'all 0.2s ease'
            }}
            className="glow-effect"
            title="Bildirim Ayarları"
          >
            🔔
          </button>
          <button
            onClick={() => {
              soundService.playClick();
              setShowThemeSelector(true);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '30px',
              height: '30px',
              transition: 'all 0.2s ease'
            }}
            className="glow-effect"
            title="Tema Seç"
          >
            🎨
          </button>
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

      {/* Tema seçici */}
      {showThemeSelector && (
        <ThemeSelector
          roomId={roomId}
          characterId={character.id}
          currentThemes={userThemes}
          onThemeChange={handleThemeChange}
          onClose={() => setShowThemeSelector(false)}
        />
      )}

      {/* Bildirim ayarları */}
      {showNotificationSettings && (
        <NotificationSettings
          roomId={roomId}
          characterId={character.id}
          onClose={() => setShowNotificationSettings(false)}
        />
      )}
    </PixelCard>
  );
};

export default PoopCounter;
