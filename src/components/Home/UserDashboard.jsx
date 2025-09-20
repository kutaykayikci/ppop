import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import PixelButton from '../PixelButton';
import PixelCard from '../PixelCard';
import UserProfile from '../Profile/UserProfile';
import { logoutUser } from '../../services/userAuthService';
import './UserDashboard.css';

const UserDashboard = ({ onCreateRoom, onJoinRoom }) => {
  const navigate = useNavigate();
  const { 
    user, 
    userProfile, 
    userRooms, 
    setUserRooms, 
    clearUserData 
  } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUserData();
    } catch (error) {
      console.error('Cikis yapilirken hata:', error);
    }
  };

  const handleRoomNavigation = (roomId) => {
    navigate(`/dashboard/${roomId}`);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date.seconds ? date.seconds * 1000 : date).toLocaleDateString('tr-TR');
  };

  return (
    <div className="user-dashboard">
      {/* Kullanici Profil Karti */}
      <PixelCard className="profile-card">
        <div className="profile-header">
          <div className="profile-info">
            <h2>👋 Hos geldin!</h2>
            <h3 
              onClick={() => setShowProfile(true)}
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              title="Profili duzenlemek icin tikla"
            >
              {userProfile?.displayName || user?.displayName || 'Kullanici'}
            </h3>
            <p className="email">{user?.email}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
            <PixelButton 
              variant="secondary" 
              size="small" 
              onClick={() => setShowProfile(true)}
              className="profile-btn"
            >
              👤 Profil
            </PixelButton>
            <PixelButton 
              variant="secondary" 
              size="small" 
              onClick={handleLogout}
              className="logout-btn"
            >
              🚪 Cikis
            </PixelButton>
          </div>
        </div>
        
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-icon">💩</span>
            <div>
              <span className="stat-value">{userProfile?.totalPoopCount || 0}</span>
              <span className="stat-label">Toplam Poop</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏠</span>
            <div>
              <span className="stat-value">{userRooms.length}</span>
              <span className="stat-label">Odalar</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <div>
              <span className="stat-value">{userProfile?.achievements?.length || 0}</span>
              <span className="stat-label">Basarim</span>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📅</span>
            <div>
              <span className="stat-value">{formatDate(userProfile?.createdAt)}</span>
              <span className="stat-label">Katilim</span>
            </div>
          </div>
        </div>
      </PixelCard>

      {/* Hizli Aksiyonlar */}
      <div className="quick-actions">
        <PixelButton 
          onClick={onCreateRoom} 
          size="large"
          className="create-room-btn"
        >
          🏠 Yeni Oda Olustur
        </PixelButton>
        <PixelButton 
          onClick={onJoinRoom} 
          variant="secondary" 
          size="large"
          className="join-room-btn"
        >
          🚪 Odaya Katil
        </PixelButton>
      </div>

      {/* Kullanicinin Odalari */}
      {userRooms.length > 0 && (
        <PixelCard className="rooms-card">
          <h3>🏠 Odalarim</h3>
          <div className="room-list">
            {userRooms.map(room => (
              <div key={room.id} className="room-item">
                <div className="room-info">
                  <span className="room-name">{room.id}</span>
                  <div className="room-stats">
                    <span className="room-poop">💩 {room.userPoopCount || 0}</span>
                    <span className="room-members">👥 {room.users?.length || 0}/{room.maxUsers || room.capacity || 5}</span>
                    <span className={`room-status ${room.status}`}>
                      {room.status === 'active' ? '🟢 Aktif' : 
                       room.status === 'waiting_for_partner' ? '🟡 Bekliyor' : '⭕ Tamamlandi'}
                    </span>
                  </div>
                </div>
                <PixelButton 
                  size="small" 
                  onClick={() => handleRoomNavigation(room.id)}
                  className="enter-room-btn"
                >
                  Gir
                </PixelButton>
              </div>
            ))}
          </div>
        </PixelCard>
      )}

      {/* Bos durum */}
      {userRooms.length === 0 && (
        <PixelCard className="empty-state">
          <div className="empty-content">
            <span className="empty-icon">🏠</span>
            <h3>Henuz hic odanda yok!</h3>
            <p>Ilk odani olustur veya arkadaslarinin odasina katil</p>
          </div>
        </PixelCard>
      )}

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
};

export default UserDashboard;
