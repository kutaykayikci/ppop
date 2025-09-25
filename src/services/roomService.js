import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  query, 
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { generateRoomId, validateRoomId } from '../utils/roomIdGenerator';
import { getFirebaseErrorMessage, logError } from '../utils/errorUtils';

// Kullanıcı ile oda oluştur (YENİ)
export const createRoomWithUser = async (uniqueName, userId, userDisplayName, maxUsers = 5) => {
  try {
    const roomId = generateRoomId(uniqueName);
    
    const existingRoom = await getRoomById(roomId);
    if (existingRoom) {
      throw new Error('Bu oda adı zaten kullanımda. Farklı bir isim deneyin.');
    }

    const roomData = {
      id: roomId,
      name: uniqueName,
      createdAt: serverTimestamp(),
      createdBy: userId,
      status: 'waiting_for_partner', // waiting_for_partner, active, completed
      characterCount: 0,
      maxUsers: maxUsers, // Seçilen kapasite
      // YENİ: Kullanıcı yönetimi
      users: [{
        uid: userId,
        displayName: userDisplayName,
        joinedAt: new Date(),
        poopCount: 0,
        isCreator: true,
        characterId: null,
      }],
      totalPoopCount: 0,
    };
    
    const docRef = await addDoc(collection(db, 'rooms'), roomData);
    
    // Kullanıcının profline oda ekle (hata durumunda sessizce devam et)
    try {
      await updateDoc(doc(db, 'users', userId), {
        joinedRooms: arrayUnion(roomId)
      });
    } catch (userUpdateError) {
      // Kullanıcı dokümanı yoksa veya güncellenemezse sessizce devam et
      console.warn('Kullanıcı dokümanı güncellenemedi:', userUpdateError);
    }
    
    return { 
      firestoreId: docRef.id,
      id: roomData.id,
      ...roomData 
    };
  } catch (error) {
    logError(error, 'createRoomWithUser');
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// Eski fonksiyon - geriye uyumluluk için
export const createRoom = async (uniqueName) => {
  throw new Error('createRoom deprecated. Use createRoomWithUser instead.');
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

// Odaya kullanıcı katıl (YENİ)
export const joinRoomWithUser = async (roomId, userId, userDisplayName) => {
  try {
    const room = await getRoomById(roomId);
    if (!room) {
      throw new Error('Oda bulunamadı');
    }

    // Oda dolu mu?
    if (room.users && room.users.length >= room.maxUsers) {
      const currentUsers = room.users.length;
      const maxUsers = room.maxUsers;
      throw new Error(`Oda dolu! Maksimum ${maxUsers} kişi katılabilir. (${currentUsers}/${maxUsers})`);
    }

    // Kullanıcı zaten bu odada mı?
    const isUserInRoom = room.users?.some(user => user.uid === userId);
    if (isUserInRoom) {
      console.log('Kullanıcı zaten bu odada, mevcut oda bilgisi döndürülüyor');
      return room; // Zaten odada, başarılı dön
    }

    const newUser = {
      uid: userId,
      displayName: userDisplayName,
      joinedAt: new Date(),
      poopCount: 0,
      isCreator: false,
      characterId: null
    };

    // Kullanıcıyı odaya ekle
    await updateDoc(doc(db, 'rooms', room.firestoreId), {
      users: arrayUnion(newUser)
    });

    // Oda durumunu güncelle
    const newUserCount = (room.users?.length || 0) + 1;
    let newStatus = room.status;
    if (newUserCount >= 2 && room.status === 'waiting_for_partner') {
      newStatus = 'active';
      await updateDoc(doc(db, 'rooms', room.firestoreId), {
        status: newStatus
      });
    }

    // Kullanıcının profline oda ekle
    await updateDoc(doc(db, 'users', userId), {
      joinedRooms: arrayUnion(roomId)
    });

    return await getRoomById(roomId);
  } catch (error) {
    logError(error, 'joinRoomWithUser');
    throw new Error(getFirebaseErrorMessage(error));
  }
};

// Eski fonksiyon - geriye uyumluluk için
export const joinRoom = async (roomId) => {
  throw new Error('joinRoom deprecated. Use joinRoomWithUser instead.');
};

// Kullanıcının odalarını getir (YENİ)
export const getUserRooms = async (userId) => {
  try {
    // Firestore'da array içinde object arama yapmak zor olduğu için
    // Tüm odaları çek ve client-side'da filtrele
    const allRoomsQuery = query(collection(db, 'rooms'));
    const querySnapshot = await getDocs(allRoomsQuery);
    const rooms = [];
    
    querySnapshot.forEach((doc) => {
      const roomData = doc.data();
      const userInRoom = roomData.users?.find(user => user.uid === userId);
      
      if (userInRoom) {
        rooms.push({
          firestoreId: doc.id,
          ...roomData,
          userPoopCount: userInRoom?.poopCount || 0,
        });
      }
    });
    
    return rooms;
  } catch (error) {
    logError(error, 'getUserRooms');
    return [];
  }
};

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
    const newCharacterCount = (room.characterCount || 0) + 1;
    
    // 2 karakter olduğunda room'u aktif yap
    const newStatus = newCharacterCount >= 2 ? 'active' : 'waiting_for_partner';
    
    await updateDoc(roomRef, {
      characterCount: newCharacterCount,
      status: newStatus
    });

    return { ...room, characterCount: newCharacterCount, status: newStatus };
  } catch (error) {
    console.error('Room\'a karakter ekleme hatası:', error);
    throw error;
  }
};

// Oda poop sayısını artır (hem odada hem kullanıcıda) (YENİ)
export const incrementRoomPoopForUser = async (roomId, userId) => {
  try {
    const room = await getRoomById(roomId);
    if (!room) throw new Error('Oda bulunamadı');

    // Kullanıcının odada olup olmadığını kontrol et
    const userInRoom = room.users?.find(user => user.uid === userId);
    if (!userInRoom) throw new Error('Kullanıcı bu odada değil');

    // Oda toplam poop sayısını artır
    await updateDoc(doc(db, 'rooms', room.firestoreId), {
      totalPoopCount: (room.totalPoopCount || 0) + 1
    });

    // Kullanıcının oda içindeki poop sayısını artır
    const updatedUsers = room.users.map(user => 
      user.uid === userId 
        ? { ...user, poopCount: (user.poopCount || 0) + 1 }
        : user
    );

    await updateDoc(doc(db, 'rooms', room.firestoreId), {
      users: updatedUsers
    });

    // Kullanıcının global poop sayısını artır
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const newTotalCount = (userDoc.data().totalPoopCount || 0) + 1;
      await updateDoc(doc(db, 'users', userId), {
        totalPoopCount: newTotalCount
      });

      // Achievement kontrolü yap
      try {
        const { checkUserAchievements } = await import('./achievementService');
        const { showAchievement, notifyPoopAdded } = await import('./simpleNotificationService');
        
        const updatedUserData = { ...userDoc.data(), totalPoopCount: newTotalCount };
        const newAchievements = await checkUserAchievements(userId, updatedUserData);
        
        // Poop notification
        notifyPoopAdded(newTotalCount);
        
        // Achievement notifications
        for (const achievement of newAchievements) {
          showAchievement(achievement);
        }
      } catch (error) {
        console.error('Achievement/Notification kontrol hatasi:', error);
      }
    }

    // İstatistikler için poops collection'una da entry ekle
    try {
      await addDoc(collection(db, 'poops'), {
        roomId: room.id,
        characterId: userId, // Multi-user sistemde characterId = userId
        userId: userId,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Poop collection entry hatası:', error);
      // Poop collection hatası istatistikleri etkilemez, sessizce geç
    }

    return true;
  } catch (error) {
    logError(error, 'incrementRoomPoopForUser');
    throw new Error(getFirebaseErrorMessage(error));
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
      users: room.users || [],
      isComplete: room.characterCount >= (room.users?.length || 0),
      maxUsers: room.maxUsers || 5,
      totalPoopCount: room.totalPoopCount || 0
    };
  } catch (error) {
    console.error('Room durumu kontrol hatası:', error);
    throw error;
  }
};
