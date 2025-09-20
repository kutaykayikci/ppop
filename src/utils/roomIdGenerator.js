// Room ID generator utility
export const generateRoomId = (uniqueName) => {
  // Kullanıcının girdiği ismi olduğu gibi kullan
  return `1905-${uniqueName}`;
};

export const validateRoomId = (roomId) => {
  // 1905- ile başlamalı ve en az bir karakter daha içermeli
  return roomId.startsWith('1905-') && roomId.length > 5;
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
