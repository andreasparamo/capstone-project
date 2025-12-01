"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { saveGameHighScore, getGameHighScore } from "@/lib/firestoreService";

/**
 Hook
 * @param {string} gameName - The name of the game 
 * @returns {Object} - { highScore, saveScore, loading, error }
 */
export function useGameScore(gameName) {
  const { user } = useAuth(); //gets currect user object
  const [highScore, setHighScore] = useState(0); //state for high score
  const [loading, setLoading] = useState(true); //
  const [error, setError] = useState(null);

  //loads the high score when component mounts
  useEffect(() => {
    const loadHighScore = async () => {
      if (!user) {
        setHighScore(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null); //clears attempts to load

      const result = await getGameHighScore(user.uid, gameName); //gets the user high score
      if (result.success) {
        setHighScore(result.data.highScore || 0);
      } else {
        setError(result.error);
        setHighScore(0);
      }
      setLoading(false);
    };

    loadHighScore();
  }, [user, gameName]);

  /**
   * @param {number} score - The score to save
   * @param {Object} additionalData - Optional additional data (e.g., level, difficulty)
   * @returns {Promise<Object>} - Result with isNewHighScore flag
   */
  const saveScore = useCallback(
    async (score, additionalData = {}) => {
      if (!user) {
        return { success: false, error: "User not authenticated" };
      }

      const result = await saveGameHighScore(
        user.uid,
        gameName,
        score,
        additionalData
      );

      if (result.success && result.isNewHighScore) {
        setHighScore(score);
      }

      return result;
    },
    [user, gameName]
  );

  return {
    highScore,
    saveScore,
    loading,
    error,
  };
}
