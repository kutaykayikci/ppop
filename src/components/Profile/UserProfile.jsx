import React, { useState } from 'react';
import { updateProfile } from 'firebase/auth';
import { updateUserProfile } from '../../services/userAuthService';
import { useAppStore } from '../../store/appStore';
import PixelButton from '../PixelButton';
import PixelCard from '../PixelCard';
import './UserProfile.css';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, userProfile, setUserProfile } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || user?.displayName || ''
  });

  const handleSave = async () => {
    if (!formData.displayName.trim()) {
      setError('Isim bos olamaz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Firebase Auth'da display name güncelle
      await updateProfile(user, { displayName: formData.displayName });
      
      // Firestore'da güncelle
      const result = await updateUserProfile(user.uid, {
        displayName: formData.displayName
      });

      if (result.success) {
        // Store'u güncelle
        setUserProfile({
          ...userProfile,
          displayName: formData.displayName
        });
        setEditing(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Profil guncellenirken hata olustu');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || user?.displayName || ''
    });
    setError('');
    setEditing(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString('tr-TR');
  };

  if (!isOpen) return null;

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-container">
        <PixelCard className="user-profile-card">
          <div className="profile-header">
            <h2>👤 Profil</h2>
            <button className="close-button" onClick={onClose}>✕</button>
          </div>

          <div className="profile-content">
            <div className="profile-info">
              <div className="info-group">
                <label>Email</label>
                <div className="info-value">{user?.email}</div>
              </div>

              <div className="info-group">
                <label>Isim</label>
                {editing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="profile-input"
                    placeholder="Adinizi girin"
                  />
                ) : (
                  <div className="info-value">{userProfile?.displayName || user?.displayName || 'Belirtilmemis'}</div>
                )}
              </div>

              <div className="info-group">
                <label>Katilim Tarihi</label>
                <div className="info-value">{formatDate(userProfile?.createdAt)}</div>
              </div>
            </div>

            <div className="profile-stats">
              <h3>Istatistikler</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">💩</span>
                  <div className="stat-info">
                    <span className="stat-value">{userProfile?.totalPoopCount || 0}</span>
                    <span className="stat-label">Toplam Poop</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🏠</span>
                  <div className="stat-info">
                    <span className="stat-value">{userProfile?.joinedRooms?.length || 0}</span>
                    <span className="stat-label">Katildigim Odalar</span>
                  </div>
                </div>
                <div className="stat-card">
                  <span className="stat-icon">🏆</span>
                  <div className="stat-info">
                    <span className="stat-value">{userProfile?.achievements?.length || 0}</span>
                    <span className="stat-label">Basarimlar</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}

            <div className="profile-actions">
              {editing ? (
                <>
                  <PixelButton 
                    onClick={handleSave} 
                    disabled={loading}
                    className="save-btn"
                  >
                    {loading ? '⏳ Kaydediliyor...' : '✅ Kaydet'}
                  </PixelButton>
                  <PixelButton 
                    onClick={handleCancel} 
                    variant="secondary"
                    disabled={loading}
                  >
                    ❌ Iptal
                  </PixelButton>
                </>
              ) : (
                <PixelButton onClick={() => setEditing(true)}>
                  ✏️ Duzenle
                </PixelButton>
              )}
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};

export default UserProfile;
