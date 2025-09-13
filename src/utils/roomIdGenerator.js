// Room ID generator utility
export const generateRoomId = (uniqueName) => {
  // Temizleme: sadece harf, rakam ve tire
  const cleaned = uniqueName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `1905-${cleaned}`;
};

export const validateRoomId = (roomId) => {
  const pattern = /^1905-[a-z0-9-]+$/;
  return pattern.test(roomId) && roomId.length > 5; // En az 1905-x formatında olmalı
};

export const extractUniqueName = (roomId) => {
  if (!roomId.startsWith('1905-')) return null;
  return roomId.substring(5); // "1905-" kısmını çıkar
};

// Örnek room ID'ler
export const exampleRoomIds = [
  '1905-jackandelizabeth',
  '1905-ahmetvefatma',
  '1905-canveayse',
  '1905-mehmetvezehra'
];
