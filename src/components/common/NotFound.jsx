import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelButton from '@/components/PixelButton';
import soundService from '@/services/soundService';

const NotFound = ({ roomId = null, type = 'room' }) => {
  const navigate = useNavigate();
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [glitchText, setGlitchText] = useState('404');

  useEffect(() => {
    // Floating emojiler oluştur
    const emojis = ['💩', '🚽', '❌', '🔍', '🤔', '😵', '💀', '👻', '🎭', '🎪', '🎨', '🎯'];
    const floatingEmojisArray = [];
    
    for (let i = 0; i < 15; i++) {
      floatingEmojisArray.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 5,
        animationType: ['float', 'bounce', 'spin', 'wiggle'][Math.floor(Math.random() * 4)]
      });
    }
    
    setFloatingEmojis(floatingEmojisArray);

    // Glitch efekti için interval
    const glitchInterval = setInterval(() => {
      const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      setGlitchText(`40${randomChar}`);
      
      setTimeout(() => setGlitchText('404'), 100);
    }, 2000);

    // Mouse takip efekti
    const handleMouseMove = (e) => {
      if (Math.random() < 0.03) {
        createParticle(e.clientX, e.clientY);
      }
    };

    const createParticle = (x, y) => {
      const newParticle = {
        id: Date.now() + Math.random(),
        x: x,
        y: y,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        size: 3 + Math.random() * 4
      };
      
      setParticles(prev => [...prev, newParticle]);
      
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(glitchInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const getTitle = () => {
    if (type === 'room') {
      return roomId ? `Oda "${roomId}" Bulunamadı` : 'Oda Bulunamadı';
    }
    return 'Sayfa Bulunamadı';
  };

  const getDescription = () => {
    if (type === 'room') {
      return roomId 
        ? `"${roomId}" ID'li oda mevcut değil veya silinmiş olabilir.`
        : 'Aradığınız oda bulunamadı.';
    }
    return 'Aradığınız sayfa mevcut değil.';
  };

  const getSuggestions = () => {
    if (type === 'room') {
      return [
        'Oda ID\'sini kontrol edin',
        'Yeni bir oda oluşturun',
        'Ana sayfaya dönün'
      ];
    }
    return [
      'URL\'yi kontrol edin',
      'Ana sayfaya dönün',
      'Arama yapın'
    ];
  };

  return (
    <div 
      className="animated-gradient"
      style={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '20px'
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
            zIndex: 1,
            fontSize: '24px',
            position: 'absolute',
            pointerEvents: 'none'
          }}
        >
          {emoji.emoji}
        </div>
      ))}

      {/* Mouse Takip Parçacıkları */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle sparkle"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            borderRadius: '50%',
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: 2,
            animation: 'sparkle-fade 3s ease-out forwards'
          }}
        />
      ))}

      {/* Ana 404 Kartı */}
      <div 
        className="tilt-card"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '4px solid #333',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          maxWidth: '600px',
          width: '100%',
          position: 'relative',
          zIndex: 10
        }}
      >
        {/* Glitch 404 */}
        <div style={{ 
          fontSize: '120px', 
          fontWeight: 'bold', 
          color: '#ff4757',
          textShadow: '4px 4px 0px #333',
          marginBottom: '20px',
          fontFamily: 'monospace',
          position: 'relative'
        }}>
          {glitchText}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, transparent 30%, rgba(255,71,87,0.1) 50%, transparent 70%)',
            animation: 'glitch-sweep 3s ease-in-out infinite'
          }} />
        </div>

        {/* Başlık */}
        <h1 style={{
          fontSize: '28px',
          color: '#333',
          marginBottom: '15px',
          fontWeight: 'bold',
          textShadow: '2px 2px 0px rgba(0,0,0,0.1)'
        }}>
          {getTitle()} 😵
        </h1>

        {/* Açıklama */}
        <p style={{
          fontSize: '16px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.5'
        }}>
          {getDescription()}
        </p>

        {/* Öneriler */}
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '2px solid #dee2e6',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'left'
        }}>
          <h3 style={{
            fontSize: '16px',
            color: '#495057',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            💡 Öneriler:
          </h3>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {getSuggestions().map((suggestion, index) => (
              <li key={index} style={{
                fontSize: '14px',
                color: '#6c757d',
                marginBottom: '8px',
                paddingLeft: '20px',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: 0,
                  color: '#ffc107'
                }}>
                  {index === 0 ? '🔍' : index === 1 ? '✨' : '🏠'}
                </span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Butonlar */}
        <div style={{
          display: 'flex',
          gap: '15px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <PixelButton
            onClick={() => {
              soundService.playClick();
              navigate('/');
            }}
            variant="primary"
            className="glow-effect"
            style={{
              fontSize: '14px',
              padding: '12px 24px'
            }}
          >
            🏠 Ana Sayfa
          </PixelButton>
          
          {type === 'room' && (
            <PixelButton
              onClick={() => {
                soundService.playClick();
                navigate('/');
              }}
              variant="secondary"
              className="glow-effect"
              style={{
                fontSize: '14px',
                padding: '12px 24px'
              }}
            >
              🆕 Yeni Oda
            </PixelButton>
          )}
          
          <PixelButton
            onClick={() => {
              soundService.playClick();
              window.history.back();
            }}
            variant="outline"
            className="glow-effect"
            style={{
              fontSize: '14px',
              padding: '12px 24px'
            }}
          >
            ⬅️ Geri Dön
          </PixelButton>
        </div>

        {/* Alt Bilgi */}
        <div style={{
          marginTop: '30px',
          fontSize: '12px',
          color: '#999',
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <div style={{ marginBottom: '5px' }}>
            🎮 Poop Hero - Oyun Hatası
          </div>
          <div style={{ opacity: 0.7 }}>
            Bu sayfa bulunamadı, ama poop sayma oyunu devam ediyor! 💩
          </div>
        </div>
      </div>

      {/* CSS Animasyonları */}
      <style>{`
        @keyframes glitch-sweep {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        @keyframes sparkle-fade {
          0% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
          100% { 
            opacity: 0; 
            transform: scale(0.3) rotate(180deg); 
          }
        }
        
        .floating-emoji.float {
          animation: float 6s ease-in-out infinite;
        }
        
        .floating-emoji.bounce {
          animation: bounce 4s ease-in-out infinite;
        }
        
        .floating-emoji.spin {
          animation: spin 8s linear infinite;
        }
        
        .floating-emoji.wiggle {
          animation: wiggle 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        
        .tilt-card {
          transition: transform 0.3s ease;
        }
        
        .tilt-card:hover {
          transform: rotate(2deg) scale(1.02);
        }
        
        .glow-effect {
          transition: all 0.3s ease;
        }
        
        .glow-effect:hover {
          box-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default NotFound;
