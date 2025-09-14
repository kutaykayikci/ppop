import React, { useState, useEffect } from 'react';
import { createRoom, joinRoom, getRoomById } from '../../services/roomService';
import { getRoomCharacters } from '../../services/characterService';
import { validateRoomId } from '../../utils/roomIdGenerator';
import PixelButton from '../PixelButton';
import GlobalLeaderboard from '../Leaderboard/GlobalLeaderboard';

const RoomSelector = ({ onRoomSelected, onNavigateToDashboard }) => {
  const [mode, setMode] = useState('select'); // select, create, join
  const [uniqueName, setUniqueName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);


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
    
    // Çok daha fazla emoji oluştur (25-30 adet)
    for (let i = 0; i < 28; i++) {
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
      
      // Rastgele parçacık oluştur
      if (Math.random() < 0.1) {
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
        alert('Ana sayfaya eklemek için:\n\nChrome: Menü > Ana sayfaya ekle\nSafari: Paylaş > Ana ekrana ekle\nFirefox: Menü > Sayfayı kaydet > Ana ekrana ekle');
      }
    } else {
      alert('Bu tarayıcı ana sayfaya ekleme özelliğini desteklemiyor.');
    }
  };

  // Link kopyalama fonksiyonu
  const copyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      alert('Link kopyalandı! 📋');
    } catch (error) {
      console.error('Link kopyalanamadı:', error);
      // Fallback: Textarea ile kopyalama
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Link kopyalandı! 📋');
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
    e.preventDefault();
    playSound('click');
    
    if (!uniqueName.trim()) {
      setError('Oda adı boş olamaz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const room = await createRoom(uniqueName.trim());
      playSound('success');
      onRoomSelected(room);
    } catch (error) {
      console.error('Room oluşturma hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    playSound('click');
    
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
      // Önce room'un var olup olmadığını kontrol et
      const room = await getRoomById(roomId.trim());
      if (!room) {
        setError('Room ID bulunamadı');
        return;
      }

      // Room'daki karakterleri kontrol et
      const characters = await getRoomCharacters(roomId.trim());
      
      if (characters.length >= 2) {
        // 2 kişi de karakter oluşturmuş, direkt dashboard'a git
        playSound('success');
        onNavigateToDashboard(room, characters);
        return;
      } else {
        // Henüz karakter eksik, standart akışa devam et
        playSound('success');
        onRoomSelected(room);
      }
    } catch (error) {
      console.error('Room\'a katılma hatası:', error);
      setError(error.message || 'Room ID bulunamadı');
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
      <h2 style={{
        fontSize: '20px',
        color: '#333',
        marginBottom: '30px',
        textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)'
      }}>
        🏠 Oda Seçimi
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <PixelButton
          onClick={() => {
            playSound('click');
            setMode('create');
          }}
          variant="primary"
          size="lg"
          style={{ 
            marginBottom: '15px', 
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}
          className="glow-effect"
        >
          🆕 Yeni Oda Oluştur
        </PixelButton>
        
        <PixelButton
          onClick={() => {
            playSound('click');
            setMode('join');
          }}
          variant="secondary"
          size="lg"
          style={{ 
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '15px'
          }}
          className="glow-effect"
        >
          🔑 Room ID ile Gir
        </PixelButton>

        <PixelButton
          onClick={() => {
            playSound('click');
            setShowLeaderboard(true);
          }}
          variant="special"
          size="lg"
          style={{ 
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            color: '#fff',
            border: '2px solid #333'
          }}
          className="glow-effect"
        >
          🏆 Global Liderlik Tablosu
        </PixelButton>
      </div>


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
            Sevgililer için özel olarak tasarlanmış eğlenceli bir poop sayma oyunu! 
            Partnerinizle birlikte günlük poop sayılarınızı takip edin, başarılar kazanın ve 
            birbirinizi motive edin. 💕
          </p>
        </div>
      )}

      {/* Alt Menü */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '20px',
        gap: '10px'
      }}>
        <button
          onClick={() => setShowProjectInfo(!showProjectInfo)}
          style={{
            background: 'none',
            border: '2px solid #333',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s ease'
          }}
          className="glow-effect"
          title="Proje Bilgisi"
        >
          ℹ️
        </button>
        
        <PixelButton
          onClick={addToHomeScreen}
          variant="secondary"
          size="sm"
          style={{ flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="glow-effect"
        >
          📱 Ana Sayfaya Ekle
        </PixelButton>
        
        <PixelButton
          onClick={copyLink}
          variant="primary"
          size="sm"
          style={{ flex: 1, height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          className="glow-effect"
        >
          📋 Linki Kopyala
        </PixelButton>
        
      </div>
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

        <PixelButton
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          style={{ width: '100%' }}
          className="glow-effect"
        >
          {loading ? 'Oluşturuluyor...' : 'Oda Oluştur'}
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
          backgroundColor: '#fff',
          border: '3px solid #333',
          borderRadius: '8px',
          boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
          padding: '30px',
          width: '100%',
          maxWidth: '400px',
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

        {mode === 'select' && renderModeSelector()}
        {mode === 'create' && renderCreateForm()}
        {mode === 'join' && renderJoinForm()}
      </div>

      {/* Global Liderlik Tablosu Modal */}
      {showLeaderboard && (
        <GlobalLeaderboard
          roomId={null}
          characterId={null}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
};

export default RoomSelector;
