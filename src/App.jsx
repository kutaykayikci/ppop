import React, { useState, useEffect } from 'react';
import RoomSelector from './components/Room/RoomSelector';
import CharacterCreator from './components/Character/CharacterCreator';
import RoomDashboard from './components/Dashboard/RoomDashboard';
import { getRoomById } from './services/roomService';
import { getRoomCharacters } from './services/characterService';

function App() {
  const [currentView, setCurrentView] = useState('room-selector');
  const [room, setRoom] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  // URL'den room parametresini kontrol et
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    const waiting = urlParams.get('waiting');
    
    if (roomId) {
      setIsWaiting(waiting === 'true');
      handleDirectRoomAccess(roomId);
    }
  }, []);

  const handleDirectRoomAccess = async (roomId) => {
    setLoading(true);
    try {
      const roomData = await getRoomById(roomId);
      if (roomData) {
        setRoom(roomData);
        const roomCharacters = await getRoomCharacters(roomId);
        setCharacters(roomCharacters);
        
        console.log('Room erişimi:', {
          roomId,
          isWaiting,
          charactersCount: roomCharacters.length,
          characters: roomCharacters
        });
        
        if (roomCharacters.length >= 2) {
          console.log('2 karakter hazır, dashboard\'a yönlendiriliyor');
          setCurrentView('dashboard');
        } else if (isWaiting) {
          // URL'de waiting=true varsa bekleme ekranını göster
          console.log('Bekleme ekranı gösteriliyor');
          setCurrentView('waiting');
        } else {
          // URL'de waiting parametresi yoksa karakter seçimi ekranını göster
          console.log('Karakter seçimi ekranı gösteriliyor');
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
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`floating-emoji ${i % 2 === 0 ? 'delayed' : ''}`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            {['💩', '🚽', '🧻', '🪠', '💧', '🌟'][i]}
          </div>
        ))}

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
    </div>
  );
}

export default App;