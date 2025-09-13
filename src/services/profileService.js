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
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, 'profiles'), profile);
    
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

// Profil fotoğrafı fonksiyonları kaldırıldı
