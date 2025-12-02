"use client";

import { useState, useEffect } from "react";
import { getAllUsersGameScores } from "@/lib/firestoreService";
import "./leaderboard.css";

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGame, setSelectedGame] = useState("wordfall");

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      setError(null);

      const result = await getAllUsersGameScores();

      if (result.success) {
        setLeaderboardData(result.data);
      } else {
        setError(result.error);
      }

      setLoading(false);
    };

    fetchLeaderboardData();
  }, []);

  // Get available games from the data
  const availableGames = leaderboardData.reduce((games, user) => {
    Object.keys(user.gameScores || {}).forEach((game) => {
      if (!games.includes(game)) {
        games.push(game);
      }
    });
    return games;
  }, []);

  // Sort users by high score for the selected game
  const getSortedLeaderboard = () => {
    return leaderboardData
      .map((user) => ({
        ...user,
        score: user.gameScores[selectedGame]?.highScore || 0,
        level: user.gameScores[selectedGame]?.level || 0,
        difficulty: user.gameScores[selectedGame]?.difficulty || "N/A",
      }))
      .filter((user) => user.score > 0)
      .sort((a, b) => b.score - a.score);
  };

  const sortedLeaderboard = getSortedLeaderboard();

  if (loading) {
    return (
      <main>
        <section id="leaderboardPage">
          <div className="leaderboard-hero">
            <h1>Leaderboard</h1>
            <p className="muted">Loading leaderboard data...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <section id="leaderboardPage">
          <div className="leaderboard-hero">
            <h1>Leaderboard</h1>
            <p className="error">Error loading leaderboard: {error}</p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section id="leaderboardPage">
        <div className="leaderboard-hero">
          <h1>Leaderboard</h1>
          <p className="muted">
            Compete with other players and see who&apos;s on top!
          </p>
        </div>

        <div className="leaderboard-controls">
          <label htmlFor="gameSelect">Select Game:</label>
          <select
            id="gameSelect"
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
          >
            {availableGames.length > 0 ? (
              availableGames.map((game) => (
                <option key={game} value={game}>
                  {game.charAt(0).toUpperCase() + game.slice(1)}
                </option>
              ))
            ) : (
              <option value="">No games available</option>
            )}
          </select>
        </div>

        {sortedLeaderboard.length > 0 ? (
          <div className="leaderboard-table-container">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Difficulty</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((user, index) => (
                  <tr
                    key={user.userId}
                    className={index < 3 ? `rank-${index + 1}` : ""}
                  >
                    <td className="rank-cell">
                      {index === 0 && <span className="medal gold">🥇</span>}
                      {index === 1 && <span className="medal silver">🥈</span>}
                      {index === 2 && <span className="medal bronze">🥉</span>}
                      {index > 2 && <span className="rank-number">{index + 1}</span>}
                    </td>
                    <td className="player-cell">
                      <div className="player-info">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.displayName
                          )}&background=0D8ABC&color=fff`}
                          alt={user.displayName}
                          className="player-avatar"
                        />
                        <span className="player-name">{user.displayName}</span>
                      </div>
                    </td>
                    <td className="score-cell">
                      <strong>{user.score.toLocaleString()}</strong>
                    </td>
                    <td>{user.level}</td>
                    <td>
                      <span className={`difficulty-badge ${user.difficulty}`}>
                        {user.difficulty.charAt(0).toUpperCase() +
                          user.difficulty.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">
            <p>No scores available for {selectedGame} yet.</p>
            <p className="muted">Be the first to set a high score!</p>
          </div>
        )}
      </section>
    </main>
  );
}
