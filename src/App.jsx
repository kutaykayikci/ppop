import React, { useState, useEffect } from 'react';
import RoomSelector from './components/Room/RoomSelector';
import CharacterCreator from './components/Character/CharacterCreator';
import ProfileSetup from './components/Profile/ProfileSetup';
import PartnerInvite from './components/Character/PartnerInvite';
import RoomDashboard from './components/Dashboard/RoomDashboard';
import { getRoomById } from './services/roomService';
import { getRoomCharacters } from './services/characterService';
import './index.css';

function App() {
  const [currentStep, setCurrentStep] = useState('room-select'); // room-select, character-create, profile-setup, partner-invite, dashboard
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  // URL'den room parametresi kontrol et
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    const isInvite = urlParams.get('invite');
    
    if (roomId) {
      if (isInvite) {
        // Davet linki ile gelindi
        handleJoinRoomFromInvite(roomId);
      } else {
        // Room ID ile direkt erişim
        handleDirectRoomAccess(roomId);
      }
    }
  }, []);

  const handleJoinRoomFromInvite = async (roomId) => {
    try {
      const room = await getRoomById(roomId);
      if (room) {
        setCurrentRoom(room);
        setCurrentStep('character-create');
      }
    } catch (error) {
      console.error('Davet room\'una katılma hatası:', error);
    }
  };

  const handleDirectRoomAccess = async (roomId) => {
    try {
      const room = await getRoomById(roomId);
      if (room) {
        setCurrentRoom(room);
        
        // Room'daki karakterleri kontrol et
        const characters = await getRoomCharacters(roomId);
        
        if (characters.length >= 2) {
          // 2 kişi de karakter oluşturmuş, direkt dashboard'a git
          setCurrentStep('dashboard');
        } else {
          // Henüz karakter oluşturulmamış veya eksik, karakter oluşturma ekranına git
          setCurrentStep('character-create');
        }
      }
    } catch (error) {
      console.error('Room\'a direkt erişim hatası:', error);
    }
  };

  const handleRoomSelected = (room) => {
    setCurrentRoom(room);
    setCurrentStep('character-create');
  };

  const handleCharacterCreated = (character) => {
    setCurrentCharacter(character);
    setCurrentStep('profile-setup');
  };

  const handleProfileCreated = (profile) => {
    setCurrentProfile(profile);
    setCurrentStep('partner-invite');
  };

  const handlePartnerJoined = () => {
    setCurrentStep('dashboard');
  };

  const handleBackToRoomSelect = () => {
    setCurrentRoom(null);
    setCurrentCharacter(null);
    setCurrentProfile(null);
    setCurrentStep('room-select');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'room-select':
        return <RoomSelector onRoomSelected={handleRoomSelected} />;
      case 'character-create':
        return (
          <CharacterCreator 
            roomId={currentRoom.id} 
            onCharacterCreated={handleCharacterCreated} 
          />
        );
      case 'profile-setup':
        return (
          <ProfileSetup 
            roomId={currentRoom.id}
            characterId={currentCharacter.id}
            onProfileCreated={handleProfileCreated} 
          />
        );
      case 'partner-invite':
        return (
          <PartnerInvite 
            room={currentRoom}
            character={currentCharacter}
            onPartnerJoined={handlePartnerJoined}
          />
        );
      case 'dashboard':
        return <RoomDashboard room={currentRoom} />;
      default:
        return <RoomSelector onRoomSelected={handleRoomSelected} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {renderCurrentStep()}
    </div>
  );
}

export default App;
