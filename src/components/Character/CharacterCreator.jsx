import React, { useState, useEffect } from 'react';
import { createCharacter, characterPresets, getRoomCharacters } from '../../services/characterService';
import { addCharacterToRoom } from '../../services/roomService';
import PixelButton from '../PixelButton';

const CharacterCreator = ({ roomId, onCharacterCreated }) => {
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [availableGenders, setAvailableGenders] = useState(['male', 'female']);
  const [roomCharacters, setRoomCharacters] = useState([]);

  useEffect(() => {
    loadRoomCharacters();
  }, [roomId]);

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
      
      // availableGenders güncellendi, artık renderGenderSelection içinde otomatik seçim yapılacak
    } catch (error) {
      console.error('Room karakterlerini yükleme hatası:', error);
    }
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
      const characterData = {
        gender,
        name: name.trim(),
        emoji: selectedEmoji,
        color: selectedColor
      };

      const character = await createCharacter(roomId, characterData);
      
      // Karakteri room'a ekle
      await addCharacterToRoom(roomId, character.id);
      
      onCharacterCreated(character);
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
            onClick={() => setGender(availableGenders[0])}
            variant="primary"
            size="lg"
            style={{ width: '100%' }}
          >
            Bu Cinsiyeti Seç →
          </PixelButton>
        </div>
      );
    }

    return (
      <div>
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
              onClick={() => setGender(genderOption)}
              variant={gender === genderOption ? 'primary' : 'secondary'}
              size="lg"
              style={{ padding: '20px' }}
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

  const renderCharacterCustomization = () => (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <PixelButton
          onClick={() => setGender('')}
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
            placeholder="örn: Kutay, Rümeysa"
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f0f0',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        border: '3px solid #333',
        borderRadius: '8px',
        boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)',
        padding: '30px',
        width: '100%',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        {!gender ? renderGenderSelection() : renderCharacterCustomization()}
      </div>
    </div>
  );
};

export default CharacterCreator;
