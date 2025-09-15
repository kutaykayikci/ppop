import React, { useState, useEffect } from 'react';
import EnhancedPopup from './EnhancedPopup';

const PopupManager = () => {
  const [activePopups, setActivePopups] = useState([]);

  useEffect(() => {
    const handleShowPopup = (event) => {
      const popupData = event.detail;
      const id = Date.now() + Math.random();
      
      setActivePopups(prev => [...prev, { id, ...popupData }]);
    };

    window.addEventListener('showPopup', handleShowPopup);
    
    return () => {
      window.removeEventListener('showPopup', handleShowPopup);
    };
  }, []);

  const handlePopupClose = (popupId) => {
    setActivePopups(prev => prev.filter(popup => popup.id !== popupId));
  };

  return (
    <>
      {activePopups.map((popup) => (
        <EnhancedPopup
          key={popup.id}
          {...popup}
          onClose={() => handlePopupClose(popup.id)}
        />
      ))}
    </>
  );
};

export default PopupManager;
