"use client";
import styles from './OpponentProgress.module.css';

export default function OpponentProgress({ opponentName, progress, wpm, accuracy }) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Opponent: {opponentName}</h3>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span>Progress: </span>
          <strong>{Math.round(progress)}%</strong>
        </div>
        <div className={styles.stat}>
          <span>WPM: </span>
          <strong>{wpm}</strong>
        </div>
        <div className={styles.stat}>
          <span>Accuracy: </span>
          <strong>{accuracy}%</strong>
        </div>
      </div>
      <div className={styles.progressBarContainer}>
        <div
          className={styles.progressBar}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
