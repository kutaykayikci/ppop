// Deprecated: FCM functionality disabled for popup-only notifications
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/firebase/config';

// Stubs to keep API compatibility
export const saveFCMToken = async () => ({ success: false, error: 'FCM disabled' })
export const getFCMTokenByUser = async () => null
export const updateFCMToken = async () => ({ success: false, error: 'FCM disabled' })
export const deleteFCMToken = async () => ({ success: true })
export const getRoomFCMTokens = async () => []
export const getAllActiveFCMTokens = async () => []
export const initializePushNotifications = async () => ({ success: false, error: 'FCM disabled' })
export const checkPushNotificationStatus = () => ({ supported: true, permission: 'granted', serviceWorker: true, pushManager: false })
