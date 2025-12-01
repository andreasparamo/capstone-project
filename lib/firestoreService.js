import { db } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';

// Create or update user profile
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: 'User profile not found' };
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { success: false, error: error.message };
  }
};

// Save typing test result
export const saveTypingTestResult = async (userId, testData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const testRef = collection(userRef, 'typingTests');

    await setDoc(doc(testRef), {
      ...testData,
      timestamp: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving typing test:', error);
    return { success: false, error: error.message };
  }
};

// Update user statistics
export const updateUserStats = async (userId, stats) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      stats: stats,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false, error: error.message };
  }
};

// Save lesson progress
export const saveLessonProgress = async (userId, lessonData) => {
  try {
    const userRef = doc(db, 'users', userId);
    const lessonsRef = collection(userRef, 'lessons');

    await setDoc(doc(lessonsRef, lessonData.lessonId), {
      ...lessonData,
      timestamp: serverTimestamp()
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    return { success: false, error: error.message };
  }
};
