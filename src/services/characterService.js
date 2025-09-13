import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const createCharacter = async (roomId, characterData) => {
  try {
    const character = {
      roomId,
      gender: characterData.gender, // 'male' or 'female'
      name: characterData.name,
      emoji: characterData.emoji,
      color: characterData.color,
      createdAt: serverTimestamp()
    };
    
    console.log('Character oluşturuluyor:', character);
    const docRef = await addDoc(collection(db, 'characters'), character);
    console.log('Character başarıyla oluşturuldu, ID:', docRef.id);
    
    return { id: docRef.id, ...character };
  } catch (error) {
    console.error('Character oluşturma hatası:', error);
    throw error;
  }
};

export const getRoomCharacters = async (roomId) => {
  try {
    const q = query(
      collection(db, 'characters'),
      where('roomId', '==', roomId)
    );
    
    const querySnapshot = await getDocs(q);
    const characters = [];
    
    querySnapshot.forEach((doc) => {
      characters.push({ id: doc.id, ...doc.data() });
    });
    
    // Cinsiyete göre sırala (erkek önce)
    characters.sort((a, b) => {
      if (a.gender === 'male' && b.gender === 'female') return -1;
      if (a.gender === 'female' && b.gender === 'male') return 1;
      return 0;
    });
    
    return characters;
  } catch (error) {
    console.error('Room karakterlerini getirme hatası:', error);
    throw error;
  }
};

// getUserCharacter fonksiyonu artık gerekli değil, kaldırıldı

// Önceden tanımlı karakter renkleri ve emojileri
export const characterPresets = {
  male: {
    colors: ['#4ecdc4', '#45b7b8', '#96ceb4', '#74b9ff', '#0984e3'],
    emojis: ['💙', '🦸', '👨', '🎮', '⚽', '🎯', '🚀', '💪']
  },
  female: {
    colors: ['#ff6b9d', '#e55a8a', '#fd79a8', '#fdcb6e', '#e17055'],
    emojis: ['💖', '🦸‍♀️', '👩', '🌸', '💄', '🎀', '🦋', '💅']
  }
};
