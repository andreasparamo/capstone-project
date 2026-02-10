import { db } from "./firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  serverTimestamp,
  getDocs,
  query,
} from "firebase/firestore";

// Create or update user profile
export const createUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(
      userRef,
      {
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { success: true };
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error: error.message };
  }
};

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, data: userSnap.data() };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    console.error("Error getting user profile:", error);
    return { success: false, error: error.message };
  }
};

// Update user profile
export const updateUserProfile = async (userId, updates) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message };
  }
};

// Save typing test result
export const saveTypingTestResult = async (userId, testData) => {
  try {
    const userRef = doc(db, "users", userId);
    const testRef = collection(userRef, "typingTests");

    await setDoc(doc(testRef), {
      ...testData,
      timestamp: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving typing test:", error);
    return { success: false, error: error.message };
  }
};

// Update user statistics
export const updateUserStats = async (userId, stats) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      stats: stats,
      updatedAt: serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user stats:", error);
    return { success: false, error: error.message };
  }
};

// Save lesson progress
export const saveLessonProgress = async (userId, lessonData) => {
  try {
    const userRef = doc(db, "users", userId);
    const lessonsRef = collection(userRef, "lessons");

    await setDoc(
      doc(lessonsRef, lessonData.lessonId),
      {
        ...lessonData,
        timestamp: serverTimestamp(),
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error saving lesson progress:", error);
    return { success: false, error: error.message };
  }
};

// Save game high score
export const saveGameHighScore = async (
  userId,
  gameName,
  score,
  additionalData = {}
) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, error: "User profile not found" };
    }

    const currentData = userSnap.data();
    const gameScores = currentData.gameScores || {};
    const currentHighScore = gameScores[gameName]?.highScore || 0;

    // Only update if new score is higher
    if (score > currentHighScore) {
      await updateDoc(userRef, {
        [`gameScores.${gameName}`]: {
          highScore: score,
          ...additionalData,
          lastUpdated: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      });
      return {
        success: true,
        isNewHighScore: true,
        previousHighScore: currentHighScore,
      };
    }

    return { success: true, isNewHighScore: false, currentHighScore };
  } catch (error) {
    console.error("Error saving game high score:", error);
    return { success: false, error: error.message };
  }
};

// Get game high score
export const getGameHighScore = async (userId, gameName) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      const gameScores = data.gameScores || {};
      const gameData = gameScores[gameName] || { highScore: 0 };
      return { success: true, data: gameData };
    } else {
      return { success: false, error: "User profile not found" };
    }
  } catch (error) {
    console.error("Error getting game high score:", error);
    return { success: false, error: error.message };
  }
};

// Get leaderboard data for all games
export const getAllUsersGameScores = async () => {
  try {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef);
    const querySnapshot = await getDocs(usersQuery);

    const leaderboardData = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      const gameScores = userData.gameScores || {};

      // Add user data with their scores
      leaderboardData.push({
        userId: doc.id,
        displayName: userData.displayName || userData.email || "Anonymous",
        email: userData.email,
        gameScores: gameScores,
      });
    });

    return { success: true, data: leaderboardData };
  } catch (error) {
    console.error("Error getting leaderboard data:", error);
    return { success: false, error: error.message };
  }
};

// Update user settings (save settings object under users/{uid}.settings)
export const updateUserSettings = async (userId, settings) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      settings: settings,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    // If the user doc doesn't exist yet, fall back to setDoc with merge
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        settings: settings,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true };
    } catch (err) {
      console.error('Error updating user settings:', err);
      return { success: false, error: err.message };
    }
  }
};

// Save battle result and update user stats
export const saveBattleResult = async (userId, matchData) => {
  try {
    const userRef = doc(db, "users", userId);
    const battlesRef = collection(userRef, "battles");

    // Save battle result to subcollection
    await setDoc(doc(battlesRef), {
      matchId: matchData.matchId || null,
      opponent: matchData.opponentName || "Unknown",
      opponentId: matchData.opponentId || null,
      result: matchData.result, // 'win' or 'loss'
      myWPM: matchData.myWPM || 0,
      myAccuracy: matchData.myAccuracy || 0,
      opponentWPM: matchData.opponentWPM || 0,
      opponentAccuracy: matchData.opponentAccuracy || 0,
      language: matchData.language || "c",
      snippet: matchData.snippet || "",
      timestamp: serverTimestamp(),
    });

    // Update user stats
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const stats = userSnap.data().stats || {};
      await updateDoc(userRef, {
        "stats.battlesPlayed": (stats.battlesPlayed || 0) + 1,
        "stats.battlesWon":
          matchData.result === "win"
            ? (stats.battlesWon || 0) + 1
            : stats.battlesWon || 0,
        updatedAt: serverTimestamp(),
      });
    } else {
      // Create user document if it doesn't exist
      await setDoc(userRef, {
        stats: {
          battlesPlayed: 1,
          battlesWon: matchData.result === "win" ? 1 : 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }, { merge: true });
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving battle result:", error);
    return { success: false, error: error.message };
  }
};
