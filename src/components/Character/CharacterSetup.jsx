import React, { useState } from 'react';
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

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
  ];

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
      <h2>📝 Isim Ver</h2>
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
        <div className="character-preview">
          <div 
            className="character-avatar"
            style={{ backgroundColor: characterData.color }}
          >
            {characterData.gender === 'male' ? '👨' : '👩'}
          </div>
          <span className="character-name">{characterData.name || 'Isim'}</span>
        </div>
      </div>

      <div className="step-actions">
        <PixelButton 
          onClick={() => setStep('gender')} 
          variant="secondary"
        >
          ← Geri
        </PixelButton>
        <PixelButton 
          onClick={() => setStep('color')}
          disabled={!characterData.name.trim()}
        >
          Renk Sec →
        </PixelButton>
      </div>
    </div>
  );

  const renderColorStep = () => (
    <div className="character-step">
      <h2>🎨 Renk Sec</h2>
      <p>Karakterinin rengini sec</p>
      
      <div className="color-palette">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={`color-btn ${characterData.color === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="character-preview-large">
        <div 
          className="character-avatar-large"
          style={{ backgroundColor: characterData.color }}
        >
          {characterData.gender === 'male' ? '👨' : '👩'}
        </div>
        <span className="character-name-large">{characterData.name}</span>
      </div>

      <div className="step-actions">
        <PixelButton 
          onClick={() => setStep('name')} 
          variant="secondary"
        >
          ← Geri
        </PixelButton>
        <PixelButton 
          onClick={handleComplete}
          disabled={loading}
        >
          {loading ? '⏳ Kaydediliyor...' : '✅ Tamamla'}
        </PixelButton>
      </div>
    </div>
  );

  return (
    <div className="character-setup-container">
      <PixelCard className="character-setup-card">
        <div className="setup-header">
          <h1>🎮 Karakter Olustur</h1>
          <p>Oyununa baslamadan once karakterini olustur</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
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
      </PixelCard>
    </div>
  );
};

export default CharacterSetup;
