import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/appStore';
import { getRoomCharacters } from '@/services/characterService';
import { getRoomProfiles } from '@/services/profileService';
import { getPoopsByDateRange } from '@/firebase/poopService';
import { calculateRoomStatistics, getComparativeStatistics } from '@/services/roomStatisticsService';
import { getRoomById } from '@/services/roomService';
import PoopCounter from '@/components/PoopCounter';
import LeagueWidget from '@/components/Dashboard/LeagueWidget';
import OnboardingModal from '@/components/Onboarding/OnboardingModal';
import PixelButton from '@/components/PixelButton';
import NotFound from '@/components/common/NotFound';
import soundService from '@/services/soundService';
import { getCurrentUser } from '@/services/userAuthService';
import { incrementRoomPoopForUser } from '@/services/roomService';
import './SimpleRoomDashboard.css';

// UserCard bileşeni - Multi-user sistemine uygun
const UserCard = ({ user, isCurrentUser, roomId, onPoopAdded }) => {
  const [poopLoading, setPoopLoading] = useState(false);

  const handleAddPoop = async () => {
    if (poopLoading) return;
    
    try {
      setPoopLoading(true);
      await incrementRoomPoopForUser(roomId, user.uid);
      onPoopAdded(user);
      soundService.playPoop();
    } catch (error) {
      // Sessiz hata
    } finally {
      setPoopLoading(false);
    }
  };

  // Kullanıcı karakteri varsa emoji ve renk bilgisini al
  const getUserDisplay = () => {
    // Room'daki characterReady durumunu kontrol et (odaya özel karakter durumu)
    if (user.characterReady && user.character) {
      // Gerçek karakter verilerini kullan
      const genderEmoji = user.character.gender === 'male' ? '👨' : '👩';
      return {
        emoji: genderEmoji,
        color: user.character.color || '#6c5ce7',
        name: user.character.name || user.displayName,
        isReady: true
      };
    }
    // Karakter hazır değilse varsayılan
    return {
      emoji: '👤',
      color: '#999',
      name: user.displayName,
      isReady: false
    };
  };

  const display = getUserDisplay();

  return (
    <div style={{
      backgroundColor: '#fff',
      border: `3px solid ${display.isReady ? display.color : '#ddd'}`,
      borderRadius: '8px',
      padding: '20px',
      textAlign: 'center',
      boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
      position: 'relative',
      opacity: display.isReady ? 1 : 0.8
    }}>
      {/* Creator badge */}
      {user.isCreator && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '16px'
        }}>
          👑
        </div>
      )}

      {/* User Avatar */}
      <div style={{
        fontSize: '48px',
        marginBottom: '10px',
        color: display.color,
        opacity: display.isReady ? 1 : 0.5,
        filter: display.isReady ? 'none' : 'grayscale(50%)'
      }}>
        {display.emoji}
      </div>

      {/* User Name */}
      <h3 style={{
        margin: '0 0 15px 0',
        fontSize: '14px',
        color: '#333',
        fontWeight: 'bold'
      }}>
        {display.name}
        {isCurrentUser && ' (Sen)'}
      </h3>

      {/* Poop Count */}
      <div style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: display.color,
        marginBottom: '15px'
      }}>
        {user.poopCount || 0}
      </div>

      {/* Add Poop Button - Only for current user */}
      {isCurrentUser && (
        <PixelButton
          onClick={handleAddPoop}
          disabled={poopLoading}
          variant="primary"
          size="lg"
          style={{
            width: '100%',
            backgroundColor: display.color,
            borderColor: display.color
          }}
        >
          {poopLoading ? 'Ekleniyor...' : '💩 Poop Ekle'}
        </PixelButton>
      )}

      {/* Character status */}
      <div style={{
        marginTop: '10px',
        fontSize: '10px',
        color: display.isReady ? '#4caf50' : '#ff9800',
        fontWeight: 'bold'
      }}>
        {display.isReady ? '✅ Karakter Hazır' : '⏳ Karakter Seçimi Bekliyor'}
      </div>
    </div>
  );
};

const SimpleRoomDashboard = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useAppStore();
  const [room, setRoom] = useState({ id: roomId, name: roomId });
  const [characters, setCharacters] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [roomUsers, setRoomUsers] = useState([]); // Yeni: Oda kullanıcıları
  const [stats, setStats] = useState({
    today: {},
    yesterday: {},
    week: {},
    month: {},
    total: {}
  });
  const [extraStats, setExtraStats] = useState({});
  const [comparativeStats, setComparativeStats] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [loading, setLoading] = useState(true);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [globalConfetti, setGlobalConfetti] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Kullanıcıları karakter verileriyle birleştiren fonksiyon
  const enrichUsersWithCharacters = async (users, roomId) => {
    try {
      console.log('🔍 DEBUG - enrichUsersWithCharacters:');
      console.log('users:', users);
      console.log('roomId:', roomId);
      
      // Sadece kullanıcıları döndür, karakter verilerini ayrı tut
      return users.map((user, index) => {
          // ÖZEL: Current user için global karakter durumunu kontrol et
          const isCurrentUser = user.uid === userProfile?.uid;
          if (isCurrentUser && userProfile?.character?.ready && !user.characterReady) {
            // Global karakteri room'a taşı
            return {
              ...user,
              characterReady: true,
              characterId: userProfile.character.id || `global-${user.uid}`,
              character: {
                id: userProfile.character.id || `global-${user.uid}`,
                name: userProfile.character.name,
                gender: userProfile.character.gender,
                color: userProfile.character.color,
                emoji: userProfile.character.gender === 'male' ? '👨' : '👩'
              }
            };
          }

          // Eğer characterReady=false ise, kullanıcıyı olduğu gibi bırak
          // (Karakter seçimi yapması gerekiyor)
          if (!user.characterReady) {
            return {
              ...user,
              characterReady: false, // Açıkça false yap
              character: null,
              characterId: null
            };
          }
          
          // Normal flow: characterId ile eşleştir
          if (user.characterReady && user.characterId) {
            // Karakter verilerini ayrı yükle
            return {
              ...user,
              character: user.character || null
            };
          }
          
          return user;
        });
      } catch (error) {
        // Sessizce hata logla
        return users; // Hata durumında orijinal kullanıcıları döndür
      }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const r = await getRoomById(roomId);
        if (r) {
          setRoom(r);
          
          // Kullanıcıları karakter verileriyle birleştir
          const usersWithCharacters = await enrichUsersWithCharacters(r.users || [], r.id);
          setRoomUsers(usersWithCharacters);
          
          await loadRoomData();
          const seen = localStorage.getItem('onboarding_seen');
          if (!seen) setShowOnboarding(true);
        } else {
          // Oda bulunamadı
          setRoomNotFound(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Room yükleme hatası:', error);
        setRoomNotFound(true);
        setLoading(false);
      }
    };
    init();
  }, [roomId]);

  useEffect(() => {
    if (roomUsers.length > 0) {
      loadStatistics();
    }
  }, [roomUsers, selectedPeriod]);

  // Animasyonlu efektleri başlat
  useEffect(() => {
    // Floating emojiler oluştur - çok daha fazla emoji ve çeşitlilik ile
    const emojis = [
      '💩', '🚽', '🧻', '🪠', '💧', '🌟', '✨', '🎉', '💫', '🌈', '🎊', '🎈',
      '🎭', '🎨', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🎼', '🎵', '🎶',
      '🏆', '🏅', '🏆', '🥇', '🥈', '🥉', '🏅', '🏆', '🎖️', '🏅', '🏆', '🏅',
      '💎', '💍', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎', '💎',
      '🌺', '🌻', '🌼', '🌷', '🌸', '🌹', '🌻', '🌺', '🌼', '🌷', '🌸', '🌹',
      '🦋', '🐝', '🦋', '🐝', '🦋', '🐝', '🦋', '🐝', '🦋', '🐝', '🦋', '🐝',
      '🍀', '🌿', '🍀', '🌿', '🍀', '🌿', '🍀', '🌿', '🍀', '🌿', '🍀', '🌿',
      '⭐', '🌟', '⭐', '🌟', '⭐', '🌟', '⭐', '🌟', '⭐', '🌟', '⭐', '🌟',
      '💖', '💕', '💖', '💕', '💖', '💕', '💖', '💕', '💖', '💕', '💖', '💕',
      '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊',
      '🔥', '💪', '🏃', '💨', '⚡', '🌪️', '🔥', '💪', '🏃', '💨', '⚡', '🌪️',
      '🎊', '🎉', '🎊', '🎉', '🎊', '🎉', '🎊', '🎉', '🎊', '🎉', '🎊', '🎉'
    ];
    const animationTypes = ['delayed', 'spiral', 'bounce', 'wave'];
    const floatingEmojisArray = [];
    
    // Performance için emoji sayısını azalt (8 adet)
    for (let i = 0; i < 8; i++) {
      floatingEmojisArray.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 10,
        animationType: animationTypes[Math.floor(Math.random() * animationTypes.length)]
      });
    }
    
    setFloatingEmojis(floatingEmojisArray);

    // Mouse takip efekti
    const handleMouseMove = (e) => {
      // Performance için parçacık oluşturma sıklığını azalt
      if (Math.random() < 0.02) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const createParticle = (x, y) => {
      const particleTypes = ['sparkle', 'trail'];
      const newParticle = {
        id: `particle-${Date.now()}-${Math.random()}`,
        x: x,
        y: y,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        type: particleTypes[Math.floor(Math.random() * particleTypes.length)]
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Parçacığı 4-5 saniye sonra temizle
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 4000 + Math.random() * 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (roomUsers.length > 0) {
      loadAllStatistics();
    }
  }, [roomUsers, room.id]);

  useEffect(() => {
    if (roomUsers.length > 0) {
      loadStatistics();
    }
  }, [selectedPeriod, roomUsers, room.id]);

  const loadRoomData = async () => {
    try {
      setLoading(true);
      
      // Eski verileri de yükle (geriye uyumluluk için)
      const [charactersData, profilesData] = await Promise.all([
        getRoomCharacters(room.id),
        getRoomProfiles(room.id)
      ]);
      
      setCharacters(charactersData);
      setProfiles(profilesData);
    } catch (error) {
      console.error('Room verilerini yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStatistics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Bugün için verileri yükle
      const todayPoops = await getPoopsByDateRange(room.id, today, today);
      
      // Bugün için istatistik hesapla
      const todayStats = {};
      roomUsers.forEach(user => {
        // Kullanıcı bazında poop sayısını hesapla
        // Eğer characterId varsa ona göre, yoksa userId'ye göre filtrele
        const userPoops = todayPoops.filter(poop => 
          poop.characterId === user.characterId || poop.userId === user.uid
        );
        todayStats[user.uid] = userPoops.length;
      });
      
      setStats(prev => ({
        ...prev,
        today: todayStats
      }));
    } catch (error) {
      console.error('Tüm istatistik yükleme hatası:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      if (roomUsers.length === 0) {
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      let startDate, endDate;
      
      // Period'a göre tarih aralığını belirle
      switch (selectedPeriod) {
        case 'today':
          startDate = endDate = today;
          break;
        case 'yesterday':
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          startDate = endDate = yesterday.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - 6);
          startDate = weekStart.toISOString().split('T')[0];
          endDate = today;
          break;
        case 'month':
          const monthStart = new Date();
          monthStart.setDate(monthStart.getDate() - 29);
          startDate = monthStart.toISOString().split('T')[0];
          endDate = today;
          break;
        case 'total':
          startDate = '2024-01-01';
          endDate = today;
          break;
        default:
          startDate = endDate = today;
      }
      
      // Poop verilerini çek
      const poops = await getPoopsByDateRange(room.id, startDate, endDate);
      
      // Kullanıcı bazında istatistik hesapla
      const userStats = {};
      roomUsers.forEach(user => {
        const userPoops = poops.filter(poop => 
          poop.userId === user.uid || poop.characterId === user.uid
        );
        userStats[user.uid] = userPoops.length;
      });

      setStats(prev => ({
        ...prev,
        [selectedPeriod]: userStats
      }));

      // Ekstra istatistikleri hesapla
      const totalPoops = Object.values(userStats).reduce((sum, count) => sum + count, 0);
      const activeUsers = Object.values(userStats).filter(count => count > 0).length;
      
      // En aktif kullanıcıyı bul
      let mostActiveUser = null;
      let maxCount = 0;
      roomUsers.forEach(user => {
        const userCount = userStats[user.uid] || 0;
        if (userCount > maxCount) {
          maxCount = userCount;
          mostActiveUser = {
            name: user.characterReady && user.character ? (user.character.name || user.displayName) : user.displayName,
            emoji: user.characterReady && user.character ? (user.character.gender === 'male' ? '👨' : '👩') : '👤',
            count: userCount
          };
        }
      });
      
      setExtraStats({
        totalPoops,
        activeUsers,
        averagePerUser: roomUsers.length > 0 ? Math.round(totalPoops / roomUsers.length) : 0,
        dailyAverage: roomUsers.length > 0 ? Math.round(totalPoops / roomUsers.length) : 0,
        mostActiveCharacter: mostActiveUser,
        mostActiveDay: ['Henüz yok', 0], // Basit versiyon
        streakInfo: { current: 0, longest: 0 } // Basit versiyon
      });

    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
      // Hata durumunda 0 değerleri ata
      const errorStats = {};
      roomUsers.forEach(user => {
        errorStats[user.uid] = 0;
      });
      setStats(prev => ({
        ...prev,
        [selectedPeriod]: errorStats
      }));
      setExtraStats({});
    }
  };

  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case 'today': return 'Bugün';
      case 'yesterday': return 'Dün';
      case 'week': return 'Bu Hafta';
      case 'month': 
        const monthNames = [
          'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
          'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ];
        const currentMonth = monthNames[new Date().getMonth()];
        return currentMonth;
      case 'total': return 'Toplam';
      default: return 'Bugün';
    }
  };

  const getWinner = () => {
    const currentStats = stats[selectedPeriod];
    if (!currentStats || Object.keys(currentStats).length === 0) {
      return { name: 'Henüz veri yok', count: 0, emoji: '📊' };
    }

    const userStats = roomUsers.map(user => ({
      user,
      count: currentStats[user.uid] || 0
    }));

    userStats.sort((a, b) => b.count - a.count);
    
    if (userStats.length === 0) {
      return { name: 'Henüz veri yok', count: 0, emoji: '📊' };
    }
    
    if (userStats.length === 1) {
      const user = userStats[0].user;
      return { 
        name: user.characterReady && user.character ? (user.character.name || user.displayName) : user.displayName, 
        count: userStats[0].count, 
        emoji: user.characterReady && user.character
          ? (user.character.gender === 'male' ? '👨' : '👩')
          : '👤'
      };
    }
    
    if (userStats[0].count === userStats[1].count && userStats[0].count > 0) {
      return { name: 'Berabere', count: userStats[0].count, emoji: '🤝' };
    }
    
    const winnerUser = userStats[0].user;
    return { 
      name: winnerUser.characterReady && winnerUser.character ? (winnerUser.character.name || winnerUser.displayName) : winnerUser.displayName, 
      count: userStats[0].count, 
      emoji: winnerUser.characterReady && winnerUser.character
        ? (winnerUser.character.gender === 'male' ? '👨' : '👩')
        : '👤'
    };
  };


  const getUserProfile = (characterId) => {
    const profile = profiles.find(profile => profile.characterId === characterId);
    if (!profile) {
      // Varsayılan profile oluştur
      return {
        id: `temp_${characterId}`,
        characterId: characterId,
        name: 'Geçici Kullanıcı',
        createdAt: new Date().toISOString()
      };
    }
    return profile;
  };

  // Oda ismini mobil için kısaltma fonksiyonu
  const getDisplayRoomName = () => {
    const maxLength = isMobile ? 15 : 25;
    
    if (room.name.length <= maxLength) {
      return room.name;
    }
    
    // Uzun isimleri kısalt
    return room.name.substring(0, maxLength - 3) + '...';
  };

  // Window resize dinleyicisi
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePoopAdded = async (currentUser) => {
    try {
      // Optimistic update: UI'ı hemen güncelle
      setRoomUsers(prevUsers => 
        prevUsers.map(u => 
          u.uid === currentUser.uid 
            ? { ...u, poopCount: (u.poopCount || 0) + 1 }
            : u
        )
      );
      
      // İstatistikleri de optimistic güncelle
      setStats(prev => ({
        ...prev,
        today: {
          ...prev.today,
          [currentUser.uid]: (prev.today?.[currentUser.uid] || 0) + 1
        }
      }));
      
      // Sonra gerçek verileri yükle (background'da)
      setTimeout(async () => {
        const updatedRoom = await getRoomById(roomId);
        if (updatedRoom) {
          setRoom(updatedRoom);
          const usersWithCharacters = await enrichUsersWithCharacters(updatedRoom.users || [], updatedRoom.id);
          setRoomUsers(usersWithCharacters);
          await loadStatistics();
        }
      }, 200);
      
      // Performance için konfeti sayısını azalt
      const burst = [];
      for (let i=0;i<8;i++) {
        burst.push({ id: `confetti-${Date.now()}-${i}-${Math.random()}`, left: Math.random()*100, top: -10, color: `hsl(${Math.random()*360},70%,60%)`, size: 4+Math.random()*6, rot: Math.random()*360, delay: Math.random()*300 })
      }
      setGlobalConfetti(prev => [...prev, ...burst])
      setTimeout(()=> setGlobalConfetti(prev => prev.slice(burst.length)), 1800)
    } catch (error) {
      // Sessiz hata
    }
  };

  // 404 durumu - oda bulunamadı
  if (roomNotFound) {
    return <NotFound roomId={roomId} type="room" />;
  }

  if (loading) {
    return (
      <div 
        className="animated-gradient"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating Emojiler */}
        {floatingEmojis.map(emoji => (
          <div
            key={emoji.id}
            className={`floating-emoji ${emoji.delay > 3 ? 'delayed' : ''}`}
            style={{
              left: `${emoji.left}%`,
              top: `${emoji.top}%`,
              animationDelay: `${emoji.delay}s`
            }}
          >
            {emoji.emoji}
          </div>
        ))}

        {/* Fancy Loader */}
        <div 
          className="tilt-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '3px solid #333',
            borderRadius: '12px',
            padding: '32px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            zIndex: 10,
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 16px' }}>
            {/* Dış halka */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '3px dashed #333',
              animation: 'spin 4s linear infinite',
              opacity: 0.3
            }} />

            {/* Emoji yörüngeleri */}
            <div style={{ position: 'absolute', inset: 0, animation: 'spin 6s linear infinite' }}>
              <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)' }}>💩</div>
              <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)' }}>✨</div>
              <div style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)' }}>🎉</div>
              <div style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)' }}>⭐</div>
            </div>

            {/* İç parlama efekti */}
            <div style={{
              position: 'absolute', inset: 12, borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,215,0,0.25), transparent 60%)',
              filter: 'blur(6px)',
              animation: 'pulse 1.6s ease-in-out infinite'
            }} />

            {/* Merkez ikon */}
            <div style={{
              position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '12px',
                border: '3px solid #333', backgroundColor: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '4px 4px 0 #333',
                animation: 'pop 1.2s ease-in-out infinite'
              }}>
                💩
              </div>
            </div>
          </div>

          <div className="loading-text" style={{ fontWeight: 'bold', color: '#333', marginBottom: 10 }}>
            Room verileri yükleniyor...
          </div>
          {/* İlerleme çubuğu */}
          <div style={{
            height: 8, border: '2px solid #333', borderRadius: 8, overflow: 'hidden',
            background: '#f2f2f2', width: 220, margin: '0 auto'
          }}>
            <div style={{
              height: '100%', width: '40%', background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)',
              animation: 'progress 1.8s ease-in-out infinite'
            }} />
          </div>

          {/* Keyframes */}
          <style>{`
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 1; } }
            @keyframes pop { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
            @keyframes progress {
              0% { transform: translateX(-100%); }
              50% { transform: translateX(10%); }
              100% { transform: translateX(120%); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Empty state: no users in room
  const isEmpty = roomUsers.length === 0

  return (
    <div 
      className="animated-gradient"
      style={{ 
        minHeight: '100vh', 
        padding: '0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating Emojiler */}
      {floatingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className={`floating-emoji ${emoji.animationType}`}
          style={{
            left: `${emoji.left}%`,
            top: `${emoji.top}%`,
            animationDelay: `${emoji.delay}s`,
            zIndex: 1
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Mouse Takip Parçacıkları */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle ${particle.type}`}
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            zIndex: 2
          }}
        />
      ))}
      {/* Global Konfeti */}
      <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex: 3 }}>
        {globalConfetti.map(c => (
          <div key={c.id} style={{ position:'absolute', left:`${c.left}%`, top:`${c.top}%`, width:c.size, height:c.size, backgroundColor:c.color, transform:`rotate(${c.rot}deg)`, borderRadius:2, animation:'global-fall 1.6s ease-in forwards', animationDelay:`${c.delay}ms` }} />
        ))}
      </div>
      <style>{`@keyframes global-fall { 0% { transform: translateY(0) rotate(0); opacity:1 } 100% { transform: translateY(100vh) rotate(360deg); opacity:0 } }`}</style>
      {/* Header */}
      <header style={{
        backgroundColor: 'var(--color-bg)',
        borderBottom: `3px solid var(--color-border)`,
        padding: '15px 20px',
        textAlign: 'center',
        boxShadow: '0 4px 0px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Ana Sayfa Butonu - Mobil Uyumlu */}
        <div style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 10
        }}>
          <PixelButton
            onClick={() => {
              soundService.playClick();
              navigate('/');
            }}
            variant="secondary"
            size="sm"
            className="glow-effect"
            style={{
              fontSize: '10px',
              padding: '6px 10px',
              minWidth: 'auto'
            }}
          >
            🏠
          </PixelButton>
        </div>

        {/* Başlık ve Room ID - Mobil Uyumlu */}
        <div style={{
          paddingLeft: '50px',
          paddingRight: '20px',
          maxWidth: 'calc(100vw - 100px)',
          width: '100%'
        }}>
          <h1 
            style={{
              fontSize: isMobile ? '12px' : '18px',
              color: 'var(--color-text)',
              margin: '0',
              textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)',
              lineHeight: '1.2',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              cursor: room.name.length > (isMobile ? 15 : 25) ? 'help' : 'default'
            }}
            title={room.name.length > (isMobile ? 15 : 25) ? `Tam oda ismi: ${room.name}` : ''}
          >
            💩 Poop Count - {getDisplayRoomName()} 💩
          </h1>
          <div style={{
            fontSize: isMobile ? '9px' : '12px',
            color: 'var(--color-text-muted)',
            marginTop: '3px',
            fontWeight: 'bold',
            backgroundColor: '#f8f8f8',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            display: 'inline-block',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            ID: {room.id}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0', flex: 1 }}>
        {/* Empty State */}
        {isEmpty && (
          <div style={{ maxWidth: 720, margin: '30px auto 0' }}>
            <div style={{
              background:'#fff', border:'3px solid #333', borderRadius:12,
              padding:20, textAlign:'center', boxShadow:'6px 6px 0 rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize:28, marginBottom:8 }}>👋</div>
              <div style={{ fontWeight:'bold', marginBottom:6 }}>Hadi başlayalım!</div>
              <div style={{ fontSize:12, opacity:0.8, marginBottom:12 }}>Odanıza bir karakter ekleyin ve ilk hedefinizi belirleyin.</div>
              <div style={{ display:'flex', gap:8, justifyContent:'center' }}>
                <PixelButton onClick={()=>navigate('/')}>Oda Seç</PixelButton>
                <PixelButton variant="secondary" onClick={()=>navigate('/')}>Hedef Belirle</PixelButton>
              </div>
            </div>
          </div>
        )}
        {showOnboarding && (
          <OnboardingModal 
            onClose={()=>{ setShowOnboarding(false); localStorage.setItem('onboarding_seen','1') }}
            onPrimary={()=>{ localStorage.setItem('onboarding_seen','1'); navigate('/') }}
          />
        )}
        {/* User Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: roomUsers.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {roomUsers.map(user => {
            const currentUser = getCurrentUser();
            const isCurrentUser = currentUser && currentUser.uid === user.uid;
            
            return (
              <UserCard 
                key={user.uid}
                user={user}
                isCurrentUser={isCurrentUser}
                roomId={room.id}
                onPoopAdded={handlePoopAdded}
              />
            );
          })}
        </div>

        {/* Statistics */}
        <div style={{ 
          backgroundColor: 'var(--color-bg)',
          border: `3px solid var(--color-border)`,
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          margin: '20px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            color: '#333',
            marginBottom: '20px',
            fontSize: '16px'
          }}>
            📊 İstatistikler
          </h2>

          <div style={{ marginBottom: '20px' }}>
            {['today', 'yesterday', 'week', 'month', 'total'].map(period => (
              <PixelButton
                key={period}
                onClick={() => {
                  soundService.playClick();
                  setSelectedPeriod(period);
                }}
                variant={selectedPeriod === period ? 'primary' : 'secondary'}
                size="sm"
                style={{ margin: '0 5px' }}
                className="glow-effect"
              >
                {period === 'today' ? 'Bugün' : 
                 period === 'yesterday' ? 'Dün' :
                 period === 'week' ? 'Hafta' : 
                 period === 'month' ? (() => {
                   const monthNames = [
                     'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                     'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
                   ];
                   return monthNames[new Date().getMonth()];
                 })() : 'Toplam'}
              </PixelButton>
            ))}
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: roomUsers.length === 1 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            {roomUsers.map(user => {
              const currentStats = stats[selectedPeriod] || {};
              const count = currentStats[user.uid] || 0;
              const display = {
                emoji: user.characterReady && user.character
                  ? (user.character.gender === 'male' ? '👨' : '👩')
                  : '👤',
                color: user.characterReady && user.character
                  ? (user.character.color || '#6c5ce7')
                  : '#999',
                name: user.characterReady && user.character
                  ? (user.character.name || user.displayName)
                  : user.displayName,
                isReady: user.characterReady || false
              };
              
              return (
                <div key={user.uid} style={{
                  backgroundColor: display.color,
                  color: '#fff',
                  padding: '15px',
                  borderRadius: '8px',
                  border: `3px solid ${display.color}`,
                  position: 'relative'
                }}>
                  {user.isCreator && (
                    <div style={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      fontSize: '12px'
                    }}>
                      👑
                    </div>
                  )}
                  <div style={{ fontSize: '12px', marginBottom: '5px' }}>
                    {display.name} {display.emoji}
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '5px' }}>
                    {display.isReady ? 'Karakter Hazır' : 'Karakter Seçimi Bekliyor'}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '15px',
            borderRadius: '8px',
            border: '3px solid #ddd',
            marginBottom: '15px'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '5px' }}>
              {getPeriodTitle()} Kazananı:
            </div>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {getWinner().emoji} {getWinner().name}
            </div>
            {getWinner().name !== 'Berabere' && getWinner().count > 0 && (
              <div style={{ fontSize: '12px', opacity: 0.7, marginTop: '5px' }}>
                {getWinner().count} poop ile! 🏆
              </div>
            )}
          </div>

          {/* Ekstra İstatistikler */}
          {extraStats && Object.keys(extraStats).length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '10px',
              marginBottom: '15px'
            }}>
              {/* Günlük Ortalama */}
              {extraStats.dailyAverage !== undefined && (
                <div style={{
                  backgroundColor: '#e8f5e8',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #4caf50',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#2e7d32', marginBottom: '3px' }}>
                    📊 Günlük Ortalama
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1b5e20' }}>
                    {extraStats.dailyAverage}
                  </div>
                </div>
              )}

              {/* En Aktif Karakter */}
              {extraStats.mostActiveCharacter && (
                <div style={{
                  backgroundColor: '#fff3e0',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #ff9800',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#e65100', marginBottom: '3px' }}>
                    🏆 En Aktif
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#bf360c' }}>
                    {extraStats.mostActiveCharacter.emoji} {extraStats.mostActiveCharacter.name}
                  </div>
                  <div style={{ fontSize: '10px', color: '#d84315' }}>
                    {extraStats.mostActiveCharacter.count} poop
                  </div>
                </div>
              )}

              {/* En Aktif Gün */}
              {extraStats.mostActiveDay && extraStats.mostActiveDay[0] !== 'Henüz yok' && (
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #2196f3',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#1565c0', marginBottom: '3px' }}>
                    📅 En Aktif Gün
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0d47a1' }}>
                    {new Date(extraStats.mostActiveDay[0]).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}
                  </div>
                  <div style={{ fontSize: '10px', color: '#1976d2' }}>
                    {extraStats.mostActiveDay[1]} poop
                  </div>
                </div>
              )}

              {/* Streak Bilgisi */}
              {extraStats.streakInfo && (extraStats.streakInfo.current > 0 || extraStats.streakInfo.longest > 0) && (
                <div style={{
                  backgroundColor: '#fce4ec',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #e91e63',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#c2185b', marginBottom: '3px' }}>
                    🔥 Streak
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#880e4f' }}>
                    Mevcut: {extraStats.streakInfo.current} gün
                  </div>
                  <div style={{ fontSize: '10px', color: '#ad1457' }}>
                    En uzun: {extraStats.streakInfo.longest} gün
                  </div>
                </div>
              )}


              {/* Aktif Gün Sayısı */}
              {extraStats.activeDays !== undefined && extraStats.totalDays !== undefined && (
                <div style={{
                  backgroundColor: '#e0f2f1',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '2px solid #009688',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: '#00695c', marginBottom: '3px' }}>
                    📈 Aktivite Oranı
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#004d40' }}>
                    {Math.round((extraStats.activeDays / extraStats.totalDays) * 100)}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#00796b' }}>
                    {extraStats.activeDays}/{extraStats.totalDays} gün
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Karşılaştırmalı İstatistikler */}
          {comparativeStats && comparativeStats.comparison && (
            <div style={{
              backgroundColor: '#fff8e1',
              padding: '15px',
              borderRadius: '8px',
              border: '3px solid #ffc107'
            }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', color: '#f57f17' }}>
                📊 Önceki Dönemle Karşılaştırma
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#e65100', marginBottom: '3px' }}>
                    Toplam Değişim
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: comparativeStats.comparison.totalChange >= 0 ? '#2e7d32' : '#d32f2f'
                  }}>
                    {comparativeStats.comparison.totalChange >= 0 ? '+' : ''}{comparativeStats.comparison.totalChange}
                  </div>
                  <div style={{ fontSize: '10px', color: '#bf360c' }}>
                    ({comparativeStats.comparison.totalChangePercent >= 0 ? '+' : ''}{comparativeStats.comparison.totalChangePercent}%)
                  </div>
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#e65100', marginBottom: '3px' }}>
                    Günlük Ortalama Değişim
                  </div>
                  <div style={{ 
                    fontSize: '16px', 
                    fontWeight: 'bold',
                    color: comparativeStats.comparison.dailyAverageChange >= 0 ? '#2e7d32' : '#d32f2f'
                  }}>
                    {comparativeStats.comparison.dailyAverageChange >= 0 ? '+' : ''}{comparativeStats.comparison.dailyAverageChange}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Haftalık Oda Ligi */}
        {roomUsers.length > 0 && (
          <LeagueWidget roomId={room.id} characters={roomUsers.map(user => ({
            id: user.uid,
            name: user.characterReady && user.character ? (user.character.name || user.displayName) : user.displayName,
            emoji: user.characterReady && user.character
              ? (user.character.gender === 'male' ? '👨' : '👩')
              : '👤',
            color: user.characterReady && user.character
              ? (user.character.color || '#6c5ce7')
              : '#999'
          }))} />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        padding: '10px',
        fontSize: '8px',
        borderTop: '3px solid #000'
      }}>
        <div>💕 Sevgililer için özel olarak tasarlandı 💕</div>
        <div style={{ marginTop: '5px', opacity: 0.7 }}>
          Her poop anı değerlidir! 🎉
        </div>
      </footer>
    </div>
  );
};

export default SimpleRoomDashboard;