import { 
  collection, 
  addDoc, 
  getDocs, 
  doc,
  updateDoc,
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const createProfile = async (profileData, roomId, characterId) => {
  try {
    const profile = {
      roomId,
      characterId,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      age: profileData.age,
      profilePhoto: profileData.profilePhoto, // base64 string or URL
      createdAt: serverTimestamp()
    };
    
    console.log('Profile oluşturuluyor:', profile);
    const docRef = await addDoc(collection(db, 'profiles'), profile);
    console.log('Profile başarıyla oluşturuldu, ID:', docRef.id);
    
    return { id: docRef.id, ...profile };
  } catch (error) {
    console.error('Profile oluşturma hatası:', error);
    throw error;
  }
};

// getUserProfile fonksiyonu artık gerekli değil, kaldırıldı

export const getRoomProfiles = async (roomId) => {
  try {
    const q = query(
      collection(db, 'profiles'),
      where('roomId', '==', roomId)
    );
    
    const querySnapshot = await getDocs(q);
    const profiles = [];
    
    querySnapshot.forEach((doc) => {
      profiles.push({ id: doc.id, ...doc.data() });
    });
    
    return profiles;
  } catch (error) {
    console.error('Room profillerini getirme hatası:', error);
    throw error;
  }
};

export const updateProfile = async (profileId, updateData) => {
  try {
    const profileRef = doc(db, 'profiles', profileId);
    await updateDoc(profileRef, {
      ...updateData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Profile güncelleme hatası:', error);
    throw error;
  }
};

// Profil fotoğrafı için yardımcı fonksiyonlar
export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

export const validateProfilePhoto = (file) => {
  const maxSize = 2 * 1024 * 1024; // 2MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Sadece JPEG, PNG ve GIF formatları desteklenir');
  }
  
  if (file.size > maxSize) {
    throw new Error('Dosya boyutu 2MB\'dan küçük olmalıdır');
  }
  
  return true;
};
