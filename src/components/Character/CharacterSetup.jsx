import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateUserCharacter } from '../../services/userAuthService';
import { useAppStore } from '../../store/appStore';
import PixelButton from '../PixelButton';
import PixelCard from '../PixelCard';
import './CharacterSetup.css';

const CharacterSetup = () => {
  const navigate = useNavigate();
  const { user, setUserProfile } = useAppStore();
  const [step, setStep] = useState('gender'); // gender, name, color, complete
  const [characterData, setCharacterData] = useState({
    gender: '',
    name: '',
    color: '#ff6b6b'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

  // Animasyonlu efektleri başlat
  useEffect(() => {
    // Floating emojiler oluştur
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
      if (Math.random() < 0.01) {
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
      
      // Parçacığı 3-4 saniye sonra temizle
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 3000 + Math.random() * 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleGenderSelect = (gender) => {
    setCharacterData({ ...characterData, gender });
    setStep('name');
  };

  const handleNameChange = (e) => {
    setCharacterData({ ...characterData, name: e.target.value });
  };

  const handleColorSelect = (color) => {
    setCharacterData({ ...characterData, color });
  };

  const handleComplete = async () => {
    if (!characterData.name.trim()) {
      setError('Karakter ismi bos olamaz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await updateUserCharacter(user.uid, {
        ...characterData,
        ready: true
      });

      if (result.success) {
        // Store'u güncelle
        setUserProfile(prev => ({
          ...prev,
          character: { ...characterData, ready: true }
        }));
        
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Karakter kaydedilirken hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const renderGenderStep = () => (
    <div className="character-step">
      <h2>👤 Cinsiyet Sec</h2>
      <p>Karakterinin cinsiyetini sec</p>
      
      <div className="gender-options">
        <button
          onClick={() => handleGenderSelect('male')}
          className="gender-btn male"
        >
          <span className="gender-icon">👨</span>
          <span className="gender-label">Erkek</span>
        </button>
        <button
          onClick={() => handleGenderSelect('female')}
          className="gender-btn female"
        >
          <span className="gender-icon">👩</span>
          <span className="gender-label">Kadin</span>
        </button>
      </div>
    </div>
  );

  const renderNameStep = () => (
    <div className="character-step">
      <h2>Isim Ver</h2>
      <p>Karakterine bir isim ver</p>
      
      <div className="name-input-container">
        <input
          type="text"
          value={characterData.name}
          onChange={handleNameChange}
          placeholder="Karakter ismi..."
          className="character-name-input"
          maxLength={20}
          autoFocus
        />
        <div className="character-preview" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '3px solid #333',
          borderRadius: '8px',
          marginTop: '15px'
        }}>
          <div style={{
            fontSize: '24px',
            color: characterData.color,
            marginBottom: '5px'
          }}>
            {characterData.gender === 'male' ? '👨' : '👩'}
          </div>
          <span style={{
            fontSize: '12px',
            fontWeight: 'bold',
            color: '#333',
            fontFamily: '"Press Start 2P", monospace'
          }}>
            {characterData.name || 'Isim'}
          </span>
        </div>
      </div>

      <div className="step-actions">
        <PixelButton 
          onClick={() => setStep('gender')} 
          variant="secondary"
          style={{ fontSize: '16px', padding: '16px' }}
        >
          ← Geri
        </PixelButton>
        <PixelButton 
          onClick={() => setStep('color')}
          disabled={!characterData.name.trim()}
          style={{ fontSize: '16px', padding: '16px' }}
        >
          Renk Sec →
        </PixelButton>
      </div>
    </div>
  );

  const renderColorStep = () => (
    <div className="character-step">
      <h2>Renk Sec</h2>
      <p>Karakterinin rengini sec</p>
      
      <div className="color-palette" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '10px',
        justifyContent: 'center',
        maxWidth: '300px',
        margin: '0 auto'
      }}>
        {colors.map(color => (
          <PixelButton
            key={color}
            onClick={() => handleColorSelect(color)}
            variant={characterData.color === color ? 'primary' : 'secondary'}
            size="sm"
            style={{ 
              padding: '15px',
              backgroundColor: characterData.color === color ? color : '#f0f0f0',
              borderColor: color,
              borderWidth: characterData.color === color ? '3px' : '2px'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              backgroundColor: color,
              borderRadius: '50%',
              margin: '0 auto'
            }} />
          </PixelButton>
        ))}
      </div>

      <div style={{ marginTop: '30px' }}></div>

      <div className="character-preview-large" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '3px solid #333',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <div style={{
          fontSize: '32px',
          color: characterData.color,
          marginBottom: '8px'
        }}>
          {characterData.gender === 'male' ? '👨' : '👩'}
        </div>
        <span style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333',
          fontFamily: '"Press Start 2P", monospace'
        }}>
          {characterData.name}
        </span>
      </div>

      <div className="step-actions">
        <PixelButton 
          onClick={() => setStep('name')} 
          variant="secondary"
          style={{ fontSize: '16px', padding: '16px' }}
        >
          ← Geri
        </PixelButton>
        <PixelButton 
          onClick={handleComplete}
          disabled={loading}
          style={{ fontSize: '16px', padding: '16px' }}
        >
          {loading ? 'Kaydediliyor...' : 'Tamamla'}
        </PixelButton>
      </div>
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
        <div className="setup-header">
          <h1>Karakter Olustur</h1>
          <p>Oyununa baslamadan once karakterini olustur</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="setup-content">
          {step === 'gender' && renderGenderStep()}
          {step === 'name' && renderNameStep()}
          {step === 'color' && renderColorStep()}
        </div>

        <div className="setup-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: step === 'gender' ? '33%' : 
                       step === 'name' ? '66%' : '100%' 
              }}
            />
          </div>
          <span className="progress-text">
            {step === 'gender' ? '1/3' : 
             step === 'name' ? '2/3' : '3/3'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CharacterSetup;
