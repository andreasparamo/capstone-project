"use client";
import "../globals.css";

export default function LandingPage() {
  const analyticsData = [
    {
      title: "Average WPM",
      value: "68",
      subtitle: "Words per minute",
      trend: "+12% from last week",
    },
    {
      title: "Accuracy",
      value: "94%",
      subtitle: "Average accuracy",
      trend: "+3% from last week",
    },
    {
      title: "Tests Completed",
      value: "127",
      subtitle: "Total tests",
      trend: "+15 this week",
    },
    {
      title: "Time Practiced",
      value: "24h",
      subtitle: "Total practice time",
      trend: "+5h this week",
    },
    {
      title: "Best WPM",
      value: "89",
      subtitle: "Personal record",
      trend: "Set 2 days ago",
    },
    {
      title: "Current Streak",
      value: "7",
      subtitle: "Days in a row",
      trend: "Keep it up!",
    },
    {
      title: "Lessons Completed",
      value: "42",
      subtitle: "Out of 60 lessons",
      trend: "70% complete",
    },
    {
      title: "Global Rank",
      value: "#1,234",
      subtitle: "Among all users",
      trend: "+56 positions",
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Typing Analytics</h1>
        <p>Track your progress and improve your typing skills</p>
      </div>

      <div className="analytics-grid">
        {analyticsData.map((item, index) => (
          <div key={index} className="analytics-tile">
            <div className="tile-content">
              <h3 className="tile-title">{item.title}</h3>
              <div className="tile-value">{item.value}</div>
              <p className="tile-subtitle">{item.subtitle}</p>
              <p className="tile-trend">{item.trend}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
