import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoomWithUser, joinRoomWithUser, getRoomById, getUserRooms } from '@/services/roomService';
import { onUserAuthStateChanged, getUserProfile } from '@/services/userAuthService';
import { validateRoomId } from '@/utils/roomIdGenerator';
import { useAppStore } from '@/store/appStore';
import PixelButton from '@/components/PixelButton';
import GlobalLeaderboard from '@/components/Leaderboard/GlobalLeaderboard';
import OnboardingModal from '@/components/Onboarding/OnboardingModal';
import AuthModal from '@/components/Auth/AuthModal';
import UserDashboard from '@/components/Home/UserDashboard';
import HomeHero from '@/components/Home/HomeHero';
import QuickActions from '@/components/Home/QuickActions';
import OfflineBanner from '@/components/Home/OfflineBanner';
import Highlights from '@/components/Home/Highlights';

const RoomSelector = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    userProfile,
    userRooms,
    setUser,
    setUserProfile,
    setUserRooms,
    clearUserData
  } = useAppStore();
  
  // Auth states
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Room states
  const [mode, setMode] = useState('select'); // select, create, join
  const [uniqueName, setUniqueName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomCapacity, setRoomCapacity] = useState(2); // Varsayılan 2 kişi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // UI states
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [lastRoomId, setLastRoomId] = useState(null);


  // Auth state dinleyici
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          // Kullanıcı profilini getir
          const profile = await getUserProfile(firebaseUser.uid);
          setUserProfile(profile);
          
          // Karakter hazır değilse karakter setup'e yönlendir
          if (!profile.character?.ready) {
            navigate('/character-setup');
            return;
          }
          
          // Kullanıcının odalarını getir
          const rooms = await getUserRooms(firebaseUser.uid);
          setUserRooms(rooms);
        } catch (error) {
          // Sessizce hata yakala - kullanıcıya gösterme
        }
      } else {
        clearUserData();
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setUserProfile, setUserRooms, clearUserData]);

  // Onboarding kontrolü - sadece ilk kez gelen kullanıcılara göster
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('poop_count_onboarding_seen');
    const storedLastRoom = localStorage.getItem('last_room_id');
    if (storedLastRoom) setLastRoomId(storedLastRoom);
    if (!hasSeenOnboarding && isAuthenticated) {
      // Kısa bir gecikme ile onboarding'i göster
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
  }, [isAuthenticated]);

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
      '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊', '🎈', '🎊'
    ];
    const animationTypes = ['delayed', 'spiral', 'bounce', 'wave'];
    const floatingEmojisArray = [];
    
    // Performance için emoji sayısını azalt (12 adet)
    for (let i = 0; i < 12; i++) {
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
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Performance için parçacık oluşturma sıklığını azalt
      if (Math.random() < 0.08) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const createParticle = (x, y) => {
      const particleTypes = ['sparkle', 'trail'];
      const newParticle = {
        id: Date.now() + Math.random(),
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


  // Touch gesture handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -50;

    if (isRightSwipe) {
      // Sağa kaydırma - proje bilgisi göster/gizle
      setShowProjectInfo(!showProjectInfo);
    }
  };

  // Onboarding handler'ları
  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    localStorage.setItem('poop_count_onboarding_seen', 'true');
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('poop_count_onboarding_seen', 'true');
    // Onboarding tamamlandıktan sonra kullanıcıyı yönlendir
    // Burada isterseniz belirli bir aksiyon yapabilirsiniz
  };

  // Ana sayfaya ekle fonksiyonu
  const addToHomeScreen = () => {
    if ('serviceWorker' in navigator) {
      // PWA kurulumu için
      if (window.deferredPrompt) {
        window.deferredPrompt.prompt();
        window.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            // PWA kurulumu kabul edildi
          }
          window.deferredPrompt = null;
        });
      } else {
        // Fallback: Manuel talimatlar
        // TODO: Replace with popup notification
        // alert kaldırıldı; Popup ile kullanıcıya yönergeler gösterilebilir
      }
    } else {
      // TODO: Replace with popup notification
    }
  };

  // Link kopyalama fonksiyonu
  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      // TODO: Replace with popup notification
    } catch (error) {
      console.error('Link kopyalanamadı:', error);
      // Fallback: Textarea ile kopyalama
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // TODO: Replace with popup notification
    }
  };

  // Sound effect fonksiyonu
  const playSound = (type = 'click') => {
    // Web Audio API ile basit ses efekti
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'click') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    } else if (type === 'success') {
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
    }
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleCreateRoom = async (e) => {
    if (e) e.preventDefault();
    playSound('click');
    
    // Auth kontrolü
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!uniqueName.trim()) {
      setError('Oda adi bos olamaz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const displayName = userProfile?.displayName || user.displayName || 'Kullanıcı';
      const room = await createRoomWithUser(uniqueName.trim(), user.uid, displayName, roomCapacity);
      playSound('success');
      try { localStorage.setItem('last_room_id', room.id); setLastRoomId(room.id); } catch {}
      
      // Kullanıcının odalarını güncelle
      const updatedRooms = await getUserRooms(user.uid);
      setUserRooms(updatedRooms);
      
      // Oda oluşturduktan sonra dashboard'a git
      navigate(`/dashboard/${room.id}`);
    } catch (error) {
      // Kullanıcı dostu hata mesajı
      const friendlyMessage = error.message.includes('zaten kullanımda') 
        ? 'Bu oda adi zaten kullaniliyor. Farkli bir isim deneyin'
        : error.message.includes('network')
        ? 'Internet baglantinizi kontrol edin'
        : 'Oda olusturulamadi. Lutfen tekrar deneyin';
      
      setError(friendlyMessage);
      
      // Notification göster
      try {
        const { showError } = await import('../../services/simpleNotificationService');
        showError(friendlyMessage);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    if (e) e.preventDefault();
    playSound('click');
    
    // Auth kontrolü
    if (!isAuthenticated || !user) {
      setShowAuthModal(true);
      return;
    }
    
    if (!roomId.trim()) {
      setError('Room ID boş olamaz');
      return;
    }

    if (!validateRoomId(roomId.trim())) {
      setError('Room ID formatı geçersiz. 1905- ile başlamalı ve en az bir karakter içermelidir.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const displayName = userProfile?.displayName || user.displayName || 'Kullanıcı';
      const room = await joinRoomWithUser(roomId.trim(), user.uid, displayName);
      
      playSound('success');
      try { localStorage.setItem('last_room_id', room.id); setLastRoomId(room.id); } catch {}
      
      // Kullanıcının odalarını güncelle
      const updatedRooms = await getUserRooms(user.uid);
      setUserRooms(updatedRooms);
      
      // Odaya katıldıktan sonra dashboard'a git
      navigate(`/dashboard/${room.id}`);
    } catch (error) {
      // Kullanıcı dostu hata mesajı
      const friendlyMessage = error.message.includes('dolu')
        ? 'Oda dolu! Maksimum kisiye ulasti'
        : error.message.includes('bulunamadı')
        ? 'Oda bulunamadi. Room ID\'yi kontrol edin'
        : error.message.includes('network')
        ? 'Internet baglantinizi kontrol edin'
        : 'Odaya katilamadi. Lutfen tekrar deneyin';
      
      setError(friendlyMessage);
      
      // Notification göster
      try {
        const { showError } = await import('../../services/simpleNotificationService');
        showError(friendlyMessage);
      } catch (e) {}
    } finally {
      setLoading(false);
    }
  };

  const renderModeSelector = () => (
    <div 
      style={{ textAlign: 'center' }} 
      className="fade-in-up"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <HomeHero />
      
      {/* Giriş yapmayan kullanıcılar için auth butonu */}
      <div style={{ marginBottom: '20px' }}>
        <PixelButton 
          onClick={() => setShowAuthModal(true)}
          size="large"
          style={{
            background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
            color: '#fff',
            border: '3px solid #333',
            fontSize: '16px',
            padding: '16px 24px',
            marginBottom: '12px'
          }}
        >
          Gırıs Yap / Kayıt Ol
        </PixelButton>
        <div style={{ 
          fontSize: '10px', 
          color: '#666', 
          fontFamily: '"Press Start 2P", monospace',
          lineHeight: '1.4'
        }}>
         
        </div>
      </div>
      
      <QuickActions
        onCreate={() => setMode('create')}
        onJoin={() => setMode('join')}
        onShowLeaderboard={() => setShowLeaderboard(true)}
        onShowOnboarding={() => setShowOnboarding(true)}
        playSound={playSound}
      />

      {/* Proje Bilgisi */}
      {showProjectInfo && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid #4ecdc4',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          animation: 'fade-in-up 0.5s ease-out'
        }}>
          <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '10px' }}>
            💩 Poop Count Hakkında
          </h3>
          <p style={{ fontSize: '12px', color: '#666', lineHeight: '1.4', marginBottom: '10px' }}>
            Arkadaşlar için özel olarak tasarlanmış eğlenceli bir poop sayma oyunu! 
            Arkadaşlarınızla birlikte günlük poop sayılarınızı takip edin, başarılar kazanın ve 
            birbirinizi motive edin. 💕
          </p>
        </div>
      )}

      {/* Alt Menü */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginTop: '20px'
      }}>
        <PixelButton
          onClick={addToHomeScreen}
          variant="secondary"
          size="lg"
          style={{ flex: 1, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', padding: '16px' }}
          className="glow-effect"
        >
          ANA SAYFAYA EKLE
        </PixelButton>
        
        <PixelButton
          onClick={copyLink}
          variant="primary"
          size="lg"
          style={{ flex: 1, height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', padding: '16px' }}
          className="glow-effect"
        >
          LİNKİ KOPYALA
        </PixelButton>
      </div>

      <Highlights onOpenLeaderboard={() => setShowLeaderboard(true)} />
    </div>
  );

  const renderCreateForm = () => (
    <div className="slide-in-right">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <PixelButton
          onClick={() => {
            playSound('click');
            setMode('select');
          }}
          variant="secondary"
          size="sm"
          className="glow-effect"
        >
          ← Geri
        </PixelButton>
      </div>

      <h2 style={{
        fontSize: '20px',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        🆕 Yeni Oda Oluştur
      </h2>

      <form onSubmit={handleCreateRoom}>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Oda Adı (Benzersiz)
          </label>
          <div style={{
            display: 'flex',
            border: '3px solid #333',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid #ddd'
            }}>
              1905-
            </div>
            <input
              type="text"
              value={uniqueName}
              onChange={(e) => setUniqueName(e.target.value)}
              placeholder="jackandelizabeth"
              required
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '5px'
          }}>
            Oluşturulacak Room ID: 1905-{uniqueName.toLowerCase().replace(/[^a-z0-9]/g, '')}
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: '#fff',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        {/* Kapasite Seçimi */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            👥 Oda Kapasitesi
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px'
          }}>
            {[1, 2, 3, 4, 5].map(capacity => (
              <button
                key={capacity}
                type="button"
                onClick={() => {
                  setRoomCapacity(capacity);
                  playSound('click');
                }}
                style={{
                  padding: '12px',
                  border: `3px solid ${roomCapacity === capacity ? '#6c5ce7' : '#333'}`,
                  borderRadius: '6px',
                  backgroundColor: roomCapacity === capacity ? '#6c5ce7' : '#fff',
                  color: roomCapacity === capacity ? '#fff' : '#333',
                  fontFamily: '"Press Start 2P", monospace',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => {
                  if (roomCapacity !== capacity) {
                    e.target.style.backgroundColor = '#f8f9fa';
                    e.target.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (roomCapacity !== capacity) {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                {capacity} 👤
              </button>
            ))}
          </div>
          <p style={{
            fontSize: '10px',
            color: '#666',
            marginTop: '8px',
            textAlign: 'center'
          }}>
            Maksimum {roomCapacity} kişi katılabilir
          </p>
        </div>

        <PixelButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          style={{ width: '100%' }}
          className="glow-effect"
        >
          {loading ? 'Oluşturuluyor...' : `${roomCapacity} Kişilik Oda Oluştur`}
        </PixelButton>
      </form>
    </div>
  );

  const renderJoinForm = () => (
    <div className="slide-in-left">
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <PixelButton
          onClick={() => {
            playSound('click');
            setMode('select');
          }}
          variant="secondary"
          size="sm"
          className="glow-effect"
        >
          ← Geri
        </PixelButton>
      </div>

      <h2 style={{
        fontSize: '20px',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        🔑 Room ID ile Gir
      </h2>

      <form onSubmit={handleJoinRoom}>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Room ID
          </label>
          <div style={{
            display: 'flex',
            border: '3px solid #333',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid #ddd'
            }}>
              1905-
            </div>
            <input
              type="text"
              value={roomId.replace(/^1905-/, '')}
              onChange={(e) => {
                const value = e.target.value;
                setRoomId(`1905-${value}`);
              }}
              placeholder="jackandelizabeth"
              required
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#ff6b6b',
            color: '#fff',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <PixelButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          style={{ width: '100%' }}
          className="glow-effect"
        >
          {loading ? 'Katılıyor...' : 'Odaya Katıl'}
        </PixelButton>
      </form>
    </div>
  );


  // Auth yükleniyor ekranı
  if (authLoading) {
    return (
      <div 
        className="animated-gradient"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
      >
        <div style={{
          backgroundColor: '#fff',
          border: '3px solid #333',
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          fontFamily: '"Press Start 2P", monospace'
        }}>
          <div style={{ fontSize: '12px', color: '#333', marginBottom: '20px' }}>
            🔐 Yükleniyor...
          </div>
          <div className="loading-spinner" />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="animated-gradient"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <OfflineBanner />
      {/* Floating Emojiler */}
      {floatingEmojis.map(emoji => (
        <div
          key={emoji.id}
          className={`floating-emoji ${emoji.animationType}`}
          style={{
            left: `${emoji.left}%`,
            top: `${emoji.top}%`,
            animationDelay: `${emoji.delay}s`
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
            backgroundColor: particle.color
          }}
        />
      ))}

      {/* Ana Kart */}
      <div 
        className="tilt-card"
        style={{
          backgroundColor: 'var(--color-bg)',
          border: `3px solid var(--color-border)`,
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          padding: 'var(--spacing-md)',
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 10,
          backdropFilter: 'blur(10px)'
        }}
      >
        {loading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: '8px'
          }}>
            <div className="loading-emoji" style={{ fontSize: '32px', marginBottom: '20px' }}>
              💩
            </div>
            <div className="loading-text" style={{ fontSize: '14px', color: '#333' }}>
              Yükleniyor...
            </div>
          </div>
        )}

        {/* Auth kontrolü ve mode yönetimi */}
        {isAuthenticated ? (
          <>
            {mode === 'select' && (
              <UserDashboard 
                onCreateRoom={() => setMode('create')}
                onJoinRoom={() => setMode('join')}
              />
            )}
            {mode === 'create' && renderCreateForm()}
            {mode === 'join' && renderJoinForm()}
          </>
        ) : (
          <>
            {mode === 'select' && renderModeSelector()}
            {mode === 'create' && renderCreateForm()}
            {mode === 'join' && renderJoinForm()}
          </>
        )}
      </div>

      {/* Global Liderlik Tablosu Modal */}
      {showLeaderboard && (
        <GlobalLeaderboard
          roomId={userProfile?.activeRoomId || null}
          characterId={userProfile?.activeCharacterId || null}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          onClose={handleOnboardingClose}
          onPrimary={handleOnboardingComplete}
        />
      )}
    </div>
  );
};

export default RoomSelector;
