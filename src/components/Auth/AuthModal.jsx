import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { registerUser, loginUser } from '../../services/userAuthService';
import { useAppStore } from '../../store/appStore';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user } = useAppStore();
  const [mode, setMode] = useState('login'); // login, register, character-setup
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    confirmPassword: ''
  });
  const [characterData, setCharacterData] = useState({
    gender: '',
    name: '',
    color: '#ff6b6b'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (mode === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError('Sifreler eslesmiyor');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Sifre en az 6 karakter olmali');
          setLoading(false);
          return;
        }
        if (!formData.displayName.trim()) {
          setError('Isim alani bos olamaz');
          setLoading(false);
          return;
        }
        result = await registerUser(formData.email, formData.password, formData.displayName);
        if (result.success) {
          // Kayıt başarılı, karakter setup'e yönlendir
          onClose();
          navigate('/character-setup');
          return;
        }
      } else {
        result = await loginUser(formData.email, formData.password);
        if (result.success) {
          onSuccess(result.user);
          onClose();
          return;
        }
      }

      if (result.success) {
        onSuccess(result.user);
        onClose();
        // Form temizle
        setFormData({
          email: '',
          password: '',
          displayName: '',
          confirmPassword: ''
        });
      } else {
        // Kullanıcı dostu hata mesajı göster
        const friendlyMessage = result.error.includes('invalid-credential') 
          ? 'Gecersiz email veya sifre' 
          : result.error.includes('user-not-found')
          ? 'Bu email ile kayitli kullanici bulunamadi'
          : result.error.includes('wrong-password')
          ? 'Yanlis sifre'
          : result.error.includes('too-many-requests')
          ? 'Cok fazla deneme yapildi. Lutfen bekleyin'
          : 'Giris yapilamadi. Lutfen tekrar deneyin';
        setError(friendlyMessage);
      }
    } catch (error) {
      setError('Bir hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Hata mesajini temizle
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
    setFormData({
      email: '',
      password: '',
      displayName: '',
      confirmPassword: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <PixelCard className="auth-modal-card">
          <div className="auth-modal-header">
            <h2>{mode === 'login' ? '🔐 Giris Yap' : '📝 Kayit Ol'}</h2>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="displayName">Isim</label>
                <input
                  id="displayName"
                  type="text"
                  placeholder="Adiniz"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  required
                  className="pixel-input"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                className="pixel-input"
              />
            </div>
            
            <div className="form-group">
                <label htmlFor="password">Sifre</label>
              <input
                id="password"
                type="password"
                placeholder="En az 6 karakter"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                className="pixel-input"
              />
            </div>
            
            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Sifre Tekrar</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Sifrenizi tekrar girin"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  required
                  className="pixel-input"
                />
              </div>
            )}
            
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}
            
            <div className="auth-actions">
              <PixelButton 
                type="submit" 
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? '⏳ Yukleniyor...' : (mode === 'login' ? 'Giris Yap' : 'Kayit Ol')}
              </PixelButton>
              
              <PixelButton 
                type="button"
                variant="secondary" 
                onClick={switchMode}
                disabled={loading}
                className="auth-switch-btn"
              >
                {mode === 'login' ? 'Hesabin yok mu? Kayit ol' : 'Zaten hesabin var mi? Giris yap'}
              </PixelButton>
            </div>
          </form>
        </PixelCard>
      </div>
    </div>
  );
};

export default AuthModal;
