import React, { useState } from 'react';
import { createRoom, joinRoom, getRoomById } from '../../services/roomService';
import { getRoomCharacters } from '../../services/characterService';
import { validateRoomId } from '../../utils/roomIdGenerator';
import PixelButton from '../PixelButton';

const RoomSelector = ({ onRoomSelected }) => {
  const [mode, setMode] = useState('select'); // select, create, join
  const [uniqueName, setUniqueName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!uniqueName.trim()) {
      setError('Oda adı boş olamaz');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const room = await createRoom(uniqueName.trim());
      onRoomSelected(room);
    } catch (error) {
      console.error('Room oluşturma hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!roomId.trim()) {
      setError('Room ID boş olamaz');
      return;
    }

    if (!validateRoomId(roomId.trim())) {
      setError('Room ID formatı geçersiz. 1905- ile başlamalı ve en az bir karakter içermelidir.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Önce room'un var olup olmadığını kontrol et
      const room = await getRoomById(roomId.trim());
      if (!room) {
        setError('Room ID bulunamadı');
        return;
      }

      // Room'daki karakterleri kontrol et
      const characters = await getRoomCharacters(roomId.trim());
      
      if (characters.length >= 2) {
        // 2 kişi de karakter oluşturmuş, direkt dashboard'a git
        // Bu durumda App.jsx'teki handleDirectRoomAccess mantığını kullan
        window.location.href = `?room=${roomId.trim()}`;
        return;
      } else {
        // Henüz karakter eksik, standart akışa devam et
        onRoomSelected(room);
      }
    } catch (error) {
      console.error('Room\'a katılma hatası:', error);
      setError(error.message || 'Room ID bulunamadı');
    } finally {
      setLoading(false);
    }
  };

  const renderModeSelector = () => (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{
        fontSize: '20px',
        color: '#333',
        marginBottom: '30px'
      }}>
        🏠 Oda Seçimi
      </h2>
      
      <div style={{ marginBottom: '20px' }}>
        <PixelButton
          onClick={() => setMode('create')}
          variant="primary"
          size="lg"
          style={{ marginBottom: '15px', width: '100%' }}
        >
          🆕 Yeni Oda Oluştur
        </PixelButton>
        
        <PixelButton
          onClick={() => setMode('join')}
          variant="secondary"
          size="lg"
          style={{ width: '100%' }}
        >
          🔑 Room ID ile Gir
        </PixelButton>
      </div>

      <div style={{
        fontSize: '12px',
        color: '#666',
        lineHeight: '1.4',
        marginTop: '20px'
      }}>
        💡 İpucu: Oda adı benzersiz olmalıdır<br/>
        Örnek: kutayverumeysa → 1905-kutayverumeysa
      </div>
    </div>
  );

  const renderCreateForm = () => (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <PixelButton
          onClick={() => setMode('select')}
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
        🆕 Yeni Oda Oluştur
      </h2>

      <form onSubmit={handleCreateRoom}>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Oda Adı (Benzersiz)
          </label>
          <div style={{
            display: 'flex',
            border: '3px solid #333',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid #ddd'
            }}>
              1905-
            </div>
            <input
              type="text"
              value={uniqueName}
              onChange={(e) => setUniqueName(e.target.value)}
              placeholder="kutayverumeysa"
              required
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '5px'
          }}>
            Oluşturulacak Room ID: 1905-{uniqueName.toLowerCase().replace(/[^a-z0-9]/g, '')}
          </div>
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
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Oluşturuluyor...' : 'Oda Oluştur'}
        </PixelButton>
      </form>
    </div>
  );

  const renderJoinForm = () => (
    <div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <PixelButton
          onClick={() => setMode('select')}
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
        🔑 Room ID ile Gir
      </h2>

      <form onSubmit={handleJoinRoom}>
        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333'
          }}>
            Room ID
          </label>
          <div style={{
            display: 'flex',
            border: '3px solid #333',
            borderRadius: '4px',
            overflow: 'hidden',
            backgroundColor: '#fff'
          }}>
            <div style={{
              padding: '12px',
              backgroundColor: '#f8f9fa',
              border: 'none',
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333',
              display: 'flex',
              alignItems: 'center',
              borderRight: '1px solid #ddd'
            }}>
              1905-
            </div>
            <input
              type="text"
              value={roomId.replace(/^1905-/, '')}
              onChange={(e) => {
                const value = e.target.value;
                setRoomId(`1905-${value}`);
              }}
              placeholder="kutayverumeysa"
              required
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
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
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Katılıyor...' : 'Odaya Katıl'}
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
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {mode === 'select' && renderModeSelector()}
        {mode === 'create' && renderCreateForm()}
        {mode === 'join' && renderJoinForm()}
      </div>
    </div>
  );
};

export default RoomSelector;
