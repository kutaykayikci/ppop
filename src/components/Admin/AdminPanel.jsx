import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PushManager from './PushManager';
import { checkAdminAuth } from '../../services/adminAuthService';

const AdminPanel = ({ onBack }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authResult = await checkAdminAuth();
      if (authResult.isAdmin) {
        setUser(authResult.user);
      }
    } catch (error) {
      console.error('Admin auth kontrolü hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    if (onBack) {
      onBack();
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%)'
      }}>
        <div style={{
          padding: '40px',
          backgroundColor: '#fff',
          border: '3px solid #333',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '12px', color: '#333' }}>
            🔐 Admin paneli yükleniyor...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <AdminDashboard user={user} onLogout={handleLogout} onBack={onBack} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} onBack={onBack} />
      )}
    </div>
  );
};

export default AdminPanel;
