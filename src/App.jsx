import React, { useState, useEffect, Suspense, lazy } from 'react';
import { getRoomById } from './services/roomService';
import { getRoomCharacters } from './services/characterService';
import { initializePushNotifications } from './services/fcmService';
import PermissionPrompt from './components/Notification/PermissionPrompt';
import { debugPushNotifications } from './utils/pushDebug';

// Lazy loading ile bileşenleri yükle
const RoomSelector = lazy(() => import('./components/Room/RoomSelector'));
const CharacterCreator = lazy(() => import('./components/Character/CharacterCreator'));
const RoomDashboard = lazy(() => import('./components/Dashboard/RoomDashboard'));
const AdminPanel = lazy(() => import('./components/Admin/AdminPanel'));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-overlay">
    <div className="loading-container">
      <div className="loading-emoji">💩</div>
      <div className="loading-text">Yükleniyor...</div>
    </div>
  </div>
);

function App() {
  const [currentView, setCurrentView] = useState('room-selector');
  const [room, setRoom] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);

  // URL'den parametreleri kontrol et
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    const waiting = urlParams.get('waiting');
    const admin = urlParams.get('admin');
    
    // Admin sayfası kontrolü
    if (admin === 'true') {
      setCurrentView('admin');
      return;
    }
    
    if (roomId) {
      setIsWaiting(waiting === 'true');
      handleDirectRoomAccess(roomId);
    }
  }, []);

  // FCM Push Notifications başlat
  useEffect(() => {
    const initializeFCM = async () => {
      try {
        // Basit bir user ID oluştur (gerçek uygulamada auth'dan gelecek)
        const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
        localStorage.setItem('userId', userId);
        
        // FCM'i başlat (room ve character bilgisi olmadan)
        const result = await initializePushNotifications(userId, null, null);
        
        if (result.success) {
          console.log('FCM Push Notifications başarıyla başlatıldı');
          setNotificationPermissionGranted(true);
          
          // Debug bilgilerini göster
          setTimeout(() => {
            debugPushNotifications();
          }, 2000);
        } else {
          console.warn('FCM başlatılamadı:', result.error);
          // Permission prompt göster
          setShowPermissionPrompt(true);
        }
      } catch (error) {
        console.error('FCM başlatma hatası:', error);
        setShowPermissionPrompt(true);
      }
    };

    // Sayfa yüklendikten sonra FCM'i başlat
    setTimeout(initializeFCM, 1000);
  }, []);

  const handlePermissionGranted = () => {
    setNotificationPermissionGranted(true);
    setShowPermissionPrompt(false);
    console.log('Notification izni verildi!');
  };

  const handlePermissionDenied = (error) => {
    setShowPermissionPrompt(false);
    console.warn('Notification izni reddedildi:', error);
  };

  const handleDirectRoomAccess = async (roomId) => {
    setLoading(true);
    try {
      const roomData = await getRoomById(roomId);
      if (roomData) {
        setRoom(roomData);
        const roomCharacters = await getRoomCharacters(roomId);
        setCharacters(roomCharacters);
        
        
        if (roomCharacters.length >= 2) {
          setCurrentView('dashboard');
        } else if (isWaiting) {
          // URL'de waiting=true varsa bekleme ekranını göster
          setCurrentView('waiting');
        } else {
          // URL'de waiting parametresi yoksa karakter seçimi ekranını göster
          setCurrentView('character-creator');
        }
      } else {
        alert('Room bulunamadı!');
        setCurrentView('room-selector');
      }
    } catch (error) {
      console.error('Room erişim hatası:', error);
      alert('Room erişim hatası!');
      setCurrentView('room-selector');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelected = (selectedRoom) => {
    setRoom(selectedRoom);
    setCurrentView('character-creator');
  };

  // handleCharacterCreated fonksiyonu artık kullanılmıyor
  // CharacterCreator bileşeni kendi içinde yönlendirme yapıyor

  const handleBackToRoomSelector = () => {
    setRoom(null);
    setCharacters([]);
    setIsWaiting(false);
    setCurrentView('room-selector');
    // URL'yi temizle
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleBackFromAdmin = () => {
    setCurrentView('room-selector');
    // URL'yi temizle
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  if (loading) {
    return (
      <div 
        className="animated-gradient"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Floating Emojiler */}
        {[...Array(15)].map((_, i) => {
          const animationTypes = ['delayed', 'spiral', 'bounce', 'wave'];
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
          return (
            <div
              key={i}
              className={`floating-emoji ${animationTypes[i % 4]}`}
              style={{
                left: `${10 + i * 6}%`,
                top: `${20 + (i % 5) * 15}%`,
                animationDelay: `${i * 0.4}s`
              }}
            >
              {emojis[i % emojis.length]}
            </div>
          );
        })}

        <div 
          className="tilt-card"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '40px',
            borderRadius: '10px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(10px)',
            border: '3px solid #333'
          }}
        >
          <h2 style={{ 
            color: '#333', 
            marginBottom: '20px',
            textShadow: '2px 2px 0px rgba(0, 0, 0, 0.1)'
          }}>
            💩 Poop Count
          </h2>
          <div className="loading-emoji" style={{ fontSize: '32px', marginBottom: '20px' }}>
            💩
          </div>
          <div className="loading-text" style={{ fontSize: '18px', color: '#666' }}>
            Yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="animated-gradient"
      style={{
        minHeight: '100vh',
        fontFamily: 'Arial, sans-serif',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Notification Permission Prompt */}
      {showPermissionPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ maxWidth: '500px', width: '100%' }}>
            <PermissionPrompt 
              onPermissionGranted={handlePermissionGranted}
              onPermissionDenied={handlePermissionDenied}
            />
          </div>
        </div>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        {currentView === 'room-selector' && (
          <RoomSelector onRoomSelected={handleRoomSelected} />
        )}
        
        {currentView === 'character-creator' && room && (
          <CharacterCreator 
            roomId={room.id}
            onBack={handleBackToRoomSelector}
          />
        )}
      
      {currentView === 'waiting' && room && (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
          fontFamily: 'Arial, sans-serif',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            border: '3px solid #333',
            borderRadius: '8px',
            boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '24px' }}>
              💩 Poop Count
            </h1>
            
            <div style={{
              backgroundColor: '#f8f9fa',
              border: '2px solid #333',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>
                👥 Odadaki Karakterler
              </h2>
              {characters.map((char, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '10px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '2px solid #333',
                  borderRadius: '4px'
                }}>
                  <span style={{ fontSize: '24px' }}>{char.emoji}</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: char.color }}>
                    {char.name}
                  </span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {char.gender === 'male' ? '👨 Erkek' : '👩 Kadın'}
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{
              backgroundColor: '#4ecdc4',
              color: '#fff',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
                ⏳ Partner Bekleniyor
              </h3>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '15px',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '5px', fontWeight: 'bold' }}>
                  Room ID:
                </p>
                <p style={{ fontSize: '20px', fontFamily: 'monospace', letterSpacing: '1px' }}>
                  {room.id}
                </p>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.9 }}>
                Partneriniz bu Room ID ile katıldığında oyun başlayacak!
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(room.id);
                  alert('Room ID kopyalandı!');
                }}
                style={{
                  backgroundColor: '#ff6b6b',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#e55a5a';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#ff6b6b';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                📋 Room ID'yi Kopyala
              </button>
              <button
                onClick={handleBackToRoomSelector}
                style={{
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#5a6268';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                🏠 Ana Sayfa
              </button>
            </div>
          </div>
        </div>
      )}
      
        {currentView === 'dashboard' && room && characters.length >= 2 && (
          <RoomDashboard 
            room={room}
            characters={characters}
            onBack={handleBackToRoomSelector}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanel onBack={handleBackFromAdmin} />
        )}
      </Suspense>
    </div>
  );
}

export default App;