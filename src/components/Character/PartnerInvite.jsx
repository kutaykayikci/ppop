import React, { useState, useEffect } from 'react';
import { checkRoomStatus } from '../../services/roomService';
import PixelButton from '../PixelButton';
import soundService from '../../services/soundService';

const PartnerInvite = ({ room, character, onPartnerJoined }) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [partnerStatus, setPartnerStatus] = useState(null);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);

  const inviteUrl = `${window.location.origin}${window.location.pathname}?room=${room.id}&invite=true`;
  
  // Animasyonlu efektleri başlat
  useEffect(() => {
    // Floating emojiler oluştur
    const emojis = ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '💌'];
    const floatingEmojisArray = [];
    
    for (let i = 0; i < 5; i++) {
      floatingEmojisArray.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6
      });
    }
    
    setFloatingEmojis(floatingEmojisArray);

    // Mouse takip efekti
    const handleMouseMove = (e) => {
      // Rastgele parçacık oluştur
      if (Math.random() < 0.06) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const createParticle = (x, y) => {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: x,
        y: y,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      // Parçacığı 3 saniye sonra temizle
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  const copyToClipboard = async () => {
    try {
      soundService.playClick();
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      soundService.playSuccess();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Kopyalama hatası:', error);
      soundService.playError();
    }
  };

  const checkPartnerStatus = async () => {
    setLoading(true);
    soundService.playClick();
    try {
      const roomStatus = await checkRoomStatus(room.id);
      setPartnerStatus(roomStatus);
      
      if (roomStatus.isComplete) {
        // Partner katıldı, dashboard'a yönlendir
        soundService.playAchievement();
        setTimeout(() => {
          onPartnerJoined();
        }, 1000);
      }
    } catch (error) {
      console.error('Partner durumu kontrol hatası:', error);
      soundService.playError();
      setPartnerStatus({ error: 'Kontrol edilemedi' });
    } finally {
      setLoading(false);
    }
  };

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

      {/* Mouse Takip Parçacıkları */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color
          }}
        />
      ))}

      <div 
        className="tilt-card"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '3px solid #333',
          borderRadius: '8px',
          boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
          padding: '30px',
          width: '100%',
          maxWidth: '500px',
          textAlign: 'center',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}
      >
        <div style={{
          fontSize: '48px',
          marginBottom: '20px'
        }}>
          ✅
        </div>

        <h2 style={{
          fontSize: '24px',
          color: '#333',
          marginBottom: '20px'
        }}>
          Karakterin Tamamlandı!
        </h2>

        <div style={{
          backgroundColor: '#f8f9fa',
          border: '2px solid #333',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '10px'
          }}>
            {character.emoji}
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: character.color,
            marginBottom: '5px'
          }}>
            {character.name}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#666'
          }}>
            {character.gender === 'male' ? 'Erkek' : 'Kadın'} Karakter
          </div>
        </div>

        <h3 style={{
          fontSize: '18px',
          color: '#333',
          marginBottom: '20px'
        }}>
          🎯 Partnerini Davet Et
        </h3>

        <div style={{
          backgroundColor: '#e6f7ff',
          border: '2px solid #4ecdc4',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{
            fontSize: '14px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333'
          }}>
            Room ID:
          </div>
          <div style={{
            fontSize: '16px',
            fontFamily: 'monospace',
            backgroundColor: '#fff',
            padding: '10px',
            borderRadius: '4px',
            border: '2px solid #333',
            wordBreak: 'break-all'
          }}>
            {room.id}
          </div>
        </div>

        <div style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '20px',
          lineHeight: '1.5'
        }}>
          Partnerin bu Room ID'yi kullanarak odaya katılabilir ve kendi karakterini oluşturabilir.
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <PixelButton
            onClick={copyToClipboard}
            variant="secondary"
            size="sm"
            className="glow-effect"
          >
            {copied ? 'Kopyalandı!' : 'Room ID Kopyala'}
          </PixelButton>
          
          <PixelButton
            onClick={checkPartnerStatus}
            variant="primary"
            size="sm"
            disabled={loading}
            className="glow-effect"
          >
            {loading ? 'Kontrol Ediliyor...' : 'Partner Katıldı mı?'}
          </PixelButton>
        </div>

        {/* Partner Durumu */}
        {partnerStatus && (
          <div style={{
            backgroundColor: partnerStatus.isComplete ? '#d4edda' : '#f8d7da',
            border: `2px solid ${partnerStatus.isComplete ? '#28a745' : '#dc3545'}`,
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {partnerStatus.error ? (
              <div style={{ color: '#721c24', fontSize: '14px' }}>
                ❌ {partnerStatus.error}
              </div>
            ) : partnerStatus.isComplete ? (
              <div style={{ color: '#155724', fontSize: '14px' }}>
                ✅ Partner katıldı! Dashboard açılıyor...
              </div>
            ) : (
              <div style={{ color: '#721c24', fontSize: '14px' }}>
                ⏳ Partner henüz katılmadı ({partnerStatus.characterCount}/2 karakter)
              </div>
            )}
          </div>
        )}

        <div style={{
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.4'
        }}>
          💡 İpucu: Partnerin Room ID'yi kopyalayıp "Odaya Gir" bölümünde kullanabilir<br/>
          Her iki karakter de oluşturulduğunda dashboard açılacak
        </div>
        
        {/* Progress indicator - CharacterCreator ile aynı */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          gap: '8px'
        }}>
          {['gender', 'customization', 'profile', 'partner-invite'].map((step, index) => {
            const currentStepIndex = 3; // PartnerInvite = step 3 (0: gender, 1: customization, 2: profile, 3: partner-invite)
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div
                key={step}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isActive ? '#4CAF50' : '#ddd',
                  border: isCurrent ? '2px solid #333' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  transform: isCurrent ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PartnerInvite;
