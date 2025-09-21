import React, { useState } from 'react';
import PixelCard from '../PixelCard';
import PixelButton from '../PixelButton';
import { adminSignIn } from '../../services/adminAuthService';

const AdminLogin = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminSignIn(email, password);
      
      if (result.success) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
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
      background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)',
      padding: '20px'
    }}>
      <PixelCard style={{
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '16px',
            color: '#333',
            marginBottom: '10px'
          }}>
            🔐 Admin Panel
          </h1>
          <p style={{
            fontSize: '10px',
            color: '#666',
            margin: 0
          }}>
            Poop Hero Admin Paneli
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '8px',
              textAlign: 'left'
            }}>
              📧 Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pixel-input"
              style={{
                width: '100%',
                fontSize: '10px',
                padding: '12px'
              }}
              placeholder="admin@poopcount.com"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '10px',
              color: '#333',
              marginBottom: '8px',
              textAlign: 'left'
            }}>
              🔑 Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pixel-input"
              style={{
                width: '100%',
                fontSize: '10px',
                padding: '12px'
              }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{
              backgroundColor: '#f8d7da',
              color: '#721c24',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '8px',
              marginBottom: '20px',
              border: '2px solid #f5c6cb'
            }}>
              ❌ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <PixelButton
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                fontSize: '12px',
                padding: '15px',
                backgroundColor: loading ? '#6c757d' : '#ff6b6b',
                borderColor: loading ? '#5a6268' : '#e55a5a',
                color: '#fff'
              }}
            >
              {loading ? 'Giriş yapılıyor...' : '🚀 Admin Girişi'}
            </PixelButton>
            
            {onBack && (
              <PixelButton
                type="button"
                onClick={onBack}
                style={{
                  width: '100%',
                  fontSize: '10px',
                  padding: '10px',
                  backgroundColor: '#6c757d',
                  borderColor: '#5a6268',
                  color: '#fff'
                }}
              >
                🏠 Ana Sayfaya Dön
              </PixelButton>
            )}
          </div>
        </form>

        <div style={{
          marginTop: '30px',
          fontSize: '8px',
          color: '#999',
          lineHeight: 1.4
        }}>
          <p>🔒 Güvenli admin girişi</p>
          <p>📊 Tüm verileri yönetin</p>
          <p>📱 Push bildirimleri gönderin</p>
          <p>⚠️ Sadece Firebase'de kayıtlı admin kullanıcılar</p>
        </div>

        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#e8f5e8',
          border: '2px solid #4caf50',
          borderRadius: '4px',
          fontSize: '8px',
          color: '#2e7d32'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
            ✅ Basit Admin Sistemi:
          </div>
          <div>• Firebase Console → Authentication → Users</div>
          <div>• Yeni kullanıcı ekle (email + şifre)</div>
          <div>• Bu email/şifre ile admin paneline giriş yap</div>
          <div>• Kodda email listesi yok, tamamen güvenli!</div>
        </div>
      </PixelCard>
    </div>
  );
};

export default AdminLogin;
