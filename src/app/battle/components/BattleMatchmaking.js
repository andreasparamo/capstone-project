"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { joinQueue, leaveQueue, listenMatch, createMatch } from '@/lib/battleMatchmaking';
import styles from './BattleMatchmaking.module.css';

export default function BattleMatchmaking({ onMatchFound }) {
  const { user } = useAuth();
  const [state, setState] = useState('idle'); // idle, searching, matched
  const [matchData, setMatchData] = useState(null);

  useEffect(() => {
    if (state === 'searching' && user) {
      const displayName = user.displayName || user.email || 'Anonymous';

      // Join the matchmaking queue
      joinQueue(user.uid, displayName);

      // Listen for match notification
      const unsubscribe = listenMatch(user.uid, (match) => {
        if (match) {
          console.log('Match found:', match);
          setMatchData(match);
          setState('matched');

          // Notify parent component
          if (onMatchFound) {
            onMatchFound(match);
          }
        }
      });

      // Try to create match every 2 seconds
      const matchInterval = setInterval(() => {
        createMatch({ userId: user.uid, displayName });
      }, 2000);

      // Cleanup: leave queue on unmount or state change
      return () => {
        if (unsubscribe) unsubscribe();
        clearInterval(matchInterval);
        leaveQueue(user.uid);
      };
    }
  }, [state, user, onMatchFound]);

  const handleFindOpponent = () => {
    setState('searching');
  };

  const handleCancel = () => {
    setState('idle');
    leaveQueue(user.uid);
  };

  if (state === 'matched') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Match Found! 🎮</h2>
        <p className={styles.subtitle}>
          Opponent: <strong>{matchData?.opponentName}</strong>
        </p>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Preparing race...</p>
        </div>
      </div>
    );
  }

  if (state === 'searching') {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Finding Opponent...</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Searching for players...</p>
        </div>
        <button onClick={handleCancel} className={styles.cancelButton}>
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Ready to Battle?</h2>
      <p className={styles.subtitle}>
        Compete against other players in real-time typing races
      </p>
      <button onClick={handleFindOpponent} className={styles.findButton}>
        Find Opponent
      </button>
    </div>
  );
}
