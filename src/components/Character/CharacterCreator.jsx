import React, { useState, useEffect } from 'react';
import { createCharacter, characterPresets, getRoomCharacters } from '../../services/characterService';
import { addCharacterToRoom } from '../../services/roomService';
import ProfileSetup from '../Profile/ProfileSetup';
import PartnerInvite from './PartnerInvite';
import PixelButton from '../PixelButton';
import soundService from '../../services/soundService';

const CharacterCreator = ({ roomId, onBack }) => {
  console.log('CharacterCreator roomId:', roomId);
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableGenders, setAvailableGenders] = useState(['male', 'female']);
  const [roomCharacters, setRoomCharacters] = useState([]);
  const [currentStep, setCurrentStep] = useState('gender'); // gender, customization, profile, partner-invite
  const [createdCharacter, setCreatedCharacter] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState('next');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    loadRoomCharacters();
  }, [roomId]);

  // Animasyonlu efektleri başlat
  useEffect(() => {
    // Floating emojiler oluştur
    const emojis = ['👤', '👥', '💕', '🎨', '✨', '🌟', '💫', '🎭'];
    const floatingEmojisArray = [];
    
    for (let i = 0; i < 6; i++) {
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
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Rastgele parçacık oluştur
      if (Math.random() < 0.08) {
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

  const loadRoomCharacters = async () => {
    try {
      const characters = await getRoomCharacters(roomId);
      console.log('Room karakterleri yüklendi:', characters);
      setRoomCharacters(characters);
      
      // Hangi cinsiyetlerin alındığını kontrol et
      const takenGenders = characters.map(char => char.gender);
      const remainingGenders = ['male', 'female'].filter(g => !takenGenders.includes(g));
      console.log('Alınan cinsiyetler:', takenGenders);
      console.log('Kalan cinsiyetler:', remainingGenders);
      setAvailableGenders(remainingGenders);
      
      // Eğer 2 karakter de oluşturulmuşsa, direkt dashboard'a yönlendir
      if (characters.length >= 2) {
        window.location.href = `?room=${roomId}`;
        return;
      }
      
      // availableGenders güncellendi, artık renderGenderSelection içinde otomatik seçim yapılacak
    } catch (error) {
      console.error('Room karakterlerini yükleme hatası:', error);
    }
  };

  // Animasyonlu step geçişi
  const transitionToStep = (newStep, direction = 'next') => {
    setIsAnimating(true);
    setAnimationDirection(direction);
    
    setTimeout(() => {
      setCurrentStep(newStep);
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!gender || !name.trim() || !selectedEmoji || !selectedColor) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('handleSubmit roomId:', roomId);
      
      const characterData = {
        gender,
        name: name.trim(),
        emoji: selectedEmoji,
        color: selectedColor
      };

      console.log('characterData:', characterData);
      const character = await createCharacter(roomId, characterData);
      
      // Karakteri room'a ekle
      await addCharacterToRoom(roomId, character.id);
      
      // Karakteri kaydet ve profil kurulumuna geç
      console.log('Karakter oluşturuldu, profil kurulumuna geçiliyor:', character);
      setCreatedCharacter(character);
      transitionToStep('profile', 'next');
    } catch (error) {
      console.error('Character oluşturma hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderGenderSelection = () => {
    // Mevcut karakterleri göster
    const renderExistingCharacters = () => {
      if (roomCharacters.length === 0) return null;
      
      return (
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{
            fontSize: '16px',
            color: '#333',
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            👥 Odadaki Mevcut Karakterler
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '10px'
          }}>
            {roomCharacters.map((char, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #333',
                  borderRadius: '8px',
                  padding: '15px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                  {char.emoji}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: char.color }}>
                  {char.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {char.gender === 'male' ? '👨 Erkek' : '👩 Kadın'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    // Eğer sadece bir cinsiyet kaldıysa, partner için seçim ekranı göster
    if (availableGenders.length === 1) {
      return (
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <PixelButton
              onClick={() => {
                soundService.playClick();
                onBack();
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
            👤 Karakter Cinsiyeti Seç
          </h2>

          {renderExistingCharacters()}

          <div style={{
            backgroundColor: '#f8f9fa',
            border: '2px solid #333',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '10px' }}>
              {availableGenders[0] === 'male' ? '👨' : '👩'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
              {availableGenders[0] === 'male' ? 'Erkek' : 'Kadın'} Karakter
            </div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
              Bu cinsiyet seçildi
            </div>
          </div>
          
          <PixelButton
            onClick={() => {
              soundService.playClick();
              setGender(availableGenders[0]);
              transitionToStep('customization', 'next');
            }}
            variant="primary"
            size="lg"
            style={{ width: '100%' }}
            className="glow-effect"
          >
            Bu Cinsiyeti Seç →
          </PixelButton>
        </div>
      );
    }

    return (
      <div>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <PixelButton
            onClick={() => {
              soundService.playClick();
              onBack();
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
          👤 Karakter Cinsiyeti Seç
        </h2>

        {renderExistingCharacters()}

        <div style={{
          display: 'grid',
          gridTemplateColumns: availableGenders.length === 1 ? '1fr' : '1fr 1fr',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {availableGenders.map(genderOption => (
            <PixelButton
              key={genderOption}
              onClick={() => {
                soundService.playClick();
                setGender(genderOption);
                transitionToStep('customization', 'next');
              }}
              variant={gender === genderOption ? 'primary' : 'secondary'}
              size="lg"
              style={{ padding: '20px' }}
              className="glow-effect"
            >
              <div style={{ fontSize: '24px', marginBottom: '5px' }}>
                {genderOption === 'male' ? '👨' : '👩'}
              </div>
              <div>{genderOption === 'male' ? 'Erkek' : 'Kadın'}</div>
            </PixelButton>
          ))}
        </div>
      </div>
    );
  };

  const handleProfileCreated = async (createdProfile) => {
    console.log('Profil oluşturuldu, karakterleri kontrol ediliyor:', createdProfile);
    
    // Profil oluşturuldu, room'daki karakterleri kontrol et
    const updatedCharacters = await getRoomCharacters(roomId);
    console.log('Room karakterleri:', updatedCharacters);
    
    setProfile(createdProfile);
    
    if (updatedCharacters.length >= 2) {
      // 2 karakter de oluşturulmuş, direkt dashboard'a yönlendir
      console.log('2 karakter hazır, dashboard\'a yönlendiriliyor');
      window.location.href = `?room=${roomId}`;
    } else {
      // İlk karakter oluşturuldu, partner davet ekranına geç
      console.log('İlk karakter hazır, partner davet ekranına geçiliyor');
      transitionToStep('partner-invite', 'next');
    }
  };

  const renderCharacterCustomization = () => (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <PixelButton
          onClick={() => {
            setGender('');
            setCurrentStep('gender');
          }}
          variant="secondary"
          size="sm"
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
        🎨 Karakterini Özelleştir
      </h2>

      <form onSubmit={handleSubmit}>
        {/* İsim */}
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Karakter İsmi
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="örn: Jack, Elizabeth"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '3px solid #333',
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Emoji Seçimi */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'left'
          }}>
            Emoji Seç
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px'
          }}>
            {characterPresets[gender]?.emojis.map((emoji, index) => (
              <PixelButton
                key={index}
                onClick={() => setSelectedEmoji(emoji)}
                variant={selectedEmoji === emoji ? 'primary' : 'secondary'}
                size="sm"
                style={{ padding: '15px', fontSize: '20px' }}
              >
                {emoji}
              </PixelButton>
            ))}
          </div>
        </div>

        {/* Renk Seçimi */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            textAlign: 'left'
          }}>
            Renk Seç
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px'
          }}>
            {characterPresets[gender]?.colors.map((color, index) => (
              <PixelButton
                key={index}
                onClick={() => setSelectedColor(color)}
                variant={selectedColor === color ? 'primary' : 'secondary'}
                size="sm"
                style={{ 
                  padding: '15px',
                  backgroundColor: selectedColor === color ? color : '#f0f0f0',
                  borderColor: color,
                  borderWidth: selectedColor === color ? '3px' : '2px'
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
        </div>

        {/* Önizleme */}
        {(selectedEmoji && selectedColor && name) && (
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '3px solid #333',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', color: '#666' }}>
              Önizleme:
            </div>
            <div style={{
              fontSize: '32px',
              marginBottom: '10px'
            }}>
              {selectedEmoji}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: selectedColor
            }}>
              {name}
            </div>
          </div>
        )}

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
          disabled={loading || !gender || !name.trim() || !selectedEmoji || !selectedColor}
          style={{ width: '100%' }}
        >
          {loading ? 'Oluşturuluyor...' : 'Karakter Oluştur'}
        </PixelButton>
      </form>
    </div>
  );

  // Profil kurulumu için ProfileSetup bileşenini doğrudan render et
  console.log('CharacterCreator render - currentStep:', currentStep, 'createdCharacter:', createdCharacter);
  
  if (currentStep === 'profile' && createdCharacter) {
    console.log('ProfileSetup render ediliyor');
    return (
      <ProfileSetup
        roomId={roomId}
        characterId={createdCharacter.id}
        onProfileCreated={handleProfileCreated}
      />
    );
  }

  // Partner davet ekranı için PartnerInvite bileşenini render et
  if (currentStep === 'partner-invite' && createdCharacter && profile) {
    console.log('PartnerInvite render ediliyor');
    return (
      <PartnerInvite
        room={{ id: roomId }}
        character={createdCharacter}
        onPartnerJoined={() => {
          console.log('Partner katıldı, dashboard\'a yönlendiriliyor');
          window.location.href = `?room=${roomId}`;
        }}
      />
    );
  }

  // Animasyon stilleri
  const getAnimationStyles = () => {
    const baseStyles = {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isAnimating ? 
        (animationDirection === 'next' ? 'translateX(-100%)' : 'translateX(100%)') : 
        'translateX(0)',
      opacity: isAnimating ? 0 : 1,
      position: 'relative',
      width: '100%'
    };
    
    return baseStyles;
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
        overflow: 'hidden',
        position: 'relative'
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
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
          zIndex: 10
        }}
      >
        <div style={getAnimationStyles()}>
          {currentStep === 'gender' && renderGenderSelection()}
          {currentStep === 'customization' && renderCharacterCustomization()}
        </div>
        
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '20px',
          gap: '8px'
        }}>
          {['gender', 'customization', 'profile', 'partner-invite'].map((step, index) => {
            const stepIndex = ['gender', 'customization', 'profile', 'partner-invite'].indexOf(currentStep);
            const isActive = index <= stepIndex;
            const isCurrent = index === stepIndex;
            
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

export default CharacterCreator;
