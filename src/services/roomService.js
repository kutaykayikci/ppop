import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateRoomId, validateRoomId } from '../utils/roomIdGenerator';

export const createRoom = async (uniqueName) => {
  try {
    const roomId = generateRoomId(uniqueName);
    
    // Room ID'nin benzersiz olduğunu kontrol et
    const existingRoom = await getRoomById(roomId);
    if (existingRoom) {
      throw new Error('Bu oda adı zaten kullanımda. Farklı bir isim deneyin.');
    }

    const roomData = {
      id: roomId,
      name: uniqueName,
      createdAt: serverTimestamp(),
      status: 'waiting_for_partner', // waiting_for_partner, active, completed
      characterCount: 0,
      characters: []
    };
    
    console.log('Room oluşturuluyor:', roomData);
    const docRef = await addDoc(collection(db, 'rooms'), roomData);
    console.log('Room başarıyla oluşturuldu, ID:', docRef.id);
    
    return { 
      firestoreId: docRef.id, // Firestore document ID
      id: roomData.id,       // Room'un kendi ID'si
      ...roomData 
    };
  } catch (error) {
    console.error('Room oluşturma hatası:', error);
    throw error;
  }
};

export const getRoomById = async (roomId) => {
  try {
    if (!validateRoomId(roomId)) {
      throw new Error('Geçersiz room ID formatı');
    }

    const q = query(
      collection(db, 'rooms'),
      where('id', '==', roomId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return { 
      firestoreId: doc.id, // Firestore document ID
      id: doc.data().id,   // Room'un kendi ID'si
      ...doc.data() 
    };
  } catch (error) {
    console.error('Room getirme hatası:', error);
    throw error;
  }
};

export const joinRoom = async (roomId) => {
  try {
    const room = await getRoomById(roomId);
    
    if (!room) {
      throw new Error('Oda bulunamadı. Room ID\'yi kontrol edin.');
    }
    
    // Room durumu kontrolü - waiting_for_partner veya active olabilir
    if (room.status === 'completed') {
      throw new Error('Bu oda tamamlanmış.');
    }
    
    return room;
  } catch (error) {
    console.error('Room\'a katılma hatası:', error);
    throw error;
  }
};

// getUserRooms fonksiyonu artık gerekli değil, kaldırıldı

export const updateRoomStatus = async (roomId, status) => {
  try {
    const room = await getRoomById(roomId);
    if (!room) {
      throw new Error('Room bulunamadı');
    }
    
    const roomRef = doc(db, 'rooms', room.firestoreId);
    await updateDoc(roomRef, { status });
  } catch (error) {
    console.error('Room durumu güncelleme hatası:', error);
    throw error;
  }
};

export const addCharacterToRoom = async (roomId, characterId) => {
  try {
    const room = await getRoomById(roomId);
    if (!room) {
      throw new Error('Room bulunamadı');
    }

    // room.firestoreId Firestore document ID'si
    const roomRef = doc(db, 'rooms', room.firestoreId);
    const updatedCharacters = [...(room.characters || []), characterId];
    const newCharacterCount = updatedCharacters.length;
    
    // 2 karakter olduğunda room'u aktif yap
    const newStatus = newCharacterCount >= 2 ? 'active' : 'waiting_for_partner';
    
    await updateDoc(roomRef, {
      characters: updatedCharacters,
      characterCount: newCharacterCount,
      status: newStatus
    });

    return { ...room, characters: updatedCharacters, characterCount: newCharacterCount, status: newStatus };
  } catch (error) {
    console.error('Room\'a karakter ekleme hatası:', error);
    throw error;
  }
};

export const checkRoomStatus = async (roomId) => {
  try {
    const room = await getRoomById(roomId);
    if (!room) {
      throw new Error('Room bulunamadı');
    }

    return {
      status: room.status,
      characterCount: room.characterCount || 0,
      characters: room.characters || [],
      isComplete: room.characterCount >= 2
    };
  } catch (error) {
    console.error('Room durumu kontrol hatası:', error);
    throw error;
  }
};
