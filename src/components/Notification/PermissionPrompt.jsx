import React, { useState, useEffect } from 'react';
import { initializePushNotifications } from '../../services/fcmService';
import { checkNotificationPermission } from '../../services/notificationService';

const PermissionPrompt = ({ onPermissionGranted, onPermissionDenied }) => {
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      const hasPermission = await checkNotificationPermission();
      if (hasPermission) {
        setPermissionStatus('granted');
        onPermissionGranted?.();
      } else {
        setPermissionStatus('denied');
      }
    } catch (error) {
      console.error('Permission check hatası:', error);
      setPermissionStatus('error');
    }
  };

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
      localStorage.setItem('userId', userId);
      
      const result = await initializePushNotifications(userId, null, null);
      
      if (result.success) {
        setPermissionStatus('granted');
        onPermissionGranted?.();
      } else {
        setPermissionStatus('denied');
        onPermissionDenied?.(result.error);
      }
    } catch (error) {
      console.error('Permission request hatası:', error);
      setPermissionStatus('error');
      onPermissionDenied?.(error.message);
    } finally {
      setIsRequesting(false);
    }
  };

  if (permissionStatus === 'granted') {
    return (
      <div style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0',
        textAlign: 'center',
        border: '2px solid #333'
      }}>
        ✅ Notification izni verildi! Push notification'ları alabilirsiniz.
      </div>
    );
  }

  if (permissionStatus === 'checking') {
    return (
      <div style={{
        backgroundColor: '#FFC107',
        color: '#333',
        padding: '15px',
        borderRadius: '8px',
        margin: '10px 0',
        textAlign: 'center',
        border: '2px solid #333'
      }}>
        🔍 Notification izni kontrol ediliyor...
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      border: '3px solid #333',
      borderRadius: '8px',
      padding: '20px',
      margin: '20px 0',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '15px' }}>🔔</div>
      
      <h3 style={{ 
        color: '#333', 
        marginBottom: '15px',
        fontSize: '18px'
      }}>
        Push Notification İzni
      </h3>
      
      <p style={{ 
        color: '#666', 
        marginBottom: '20px',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        Uygulamadan push notification'ları alabilmek için izin vermeniz gerekiyor. 
        Bu sayede önemli güncellemeleri kaçırmazsınız!
      </p>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={requestPermission}
          disabled={isRequesting}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: isRequesting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            opacity: isRequesting ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isRequesting) {
              e.target.style.backgroundColor = '#45a049';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isRequesting) {
              e.target.style.backgroundColor = '#4CAF50';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          {isRequesting ? '⏳ İzin Veriliyor...' : '✅ İzin Ver'}
        </button>
        
        <button
          onClick={() => {
            setPermissionStatus('denied');
            onPermissionDenied?.('Kullanıcı izni reddetti');
          }}
          disabled={isRequesting}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            cursor: isRequesting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transition: 'all 0.2s ease',
            opacity: isRequesting ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!isRequesting) {
              e.target.style.backgroundColor = '#da190b';
              e.target.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (!isRequesting) {
              e.target.style.backgroundColor = '#f44336';
              e.target.style.transform = 'translateY(0)';
            }
          }}
        >
          ❌ Reddet
        </button>
      </div>
      
      <div style={{ 
        marginTop: '15px',
        fontSize: '12px',
        color: '#999'
      }}>
        💡 İzin verdikten sonra uygulamayı ana ekrana ekleyebilirsiniz
      </div>
    </div>
  );
};

export default PermissionPrompt;
