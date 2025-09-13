import React, { useState } from 'react';
import { createProfile } from '../../services/profileService';
import PixelButton from '../PixelButton';

const ProfileSetup = ({ roomId, characterId, onProfileCreated }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  // Profil fotoğrafı kaldırıldı
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fotoğraf işleme fonksiyonu kaldırıldı

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!firstName.trim() || !lastName.trim() || !age) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    const ageNum = parseInt(age);
    if (ageNum < 1 || ageNum > 120) {
      setError('Yaş 1-120 arasında olmalıdır');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const profileData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        age: ageNum
      };

      const profile = await createProfile(profileData, roomId, characterId);
      onProfileCreated(profile);
    } catch (error) {
      console.error('Profile oluşturma hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2 style={{
          fontSize: '20px',
          color: '#333',
          marginBottom: '30px'
        }}>
          📝 Profil Bilgilerini Doldur
        </h2>

        <form onSubmit={handleSubmit}>

          {/* Ad */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Ad
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Adınız"
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

          {/* Soyad */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Soyad
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Soyadınız"
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

          {/* Yaş */}
          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Yaş
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Yaşınız"
              min="1"
              max="120"
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
            disabled={loading || !firstName.trim() || !lastName.trim() || !age}
            style={{ width: '100%' }}
          >
            {loading ? 'Kaydediliyor...' : 'Profili Tamamla'}
          </PixelButton>
        </form>

        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#666',
          lineHeight: '1.4'
        }}>
          💡 İpucu: Profil bilgileriniz güvenli bir şekilde saklanır
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
