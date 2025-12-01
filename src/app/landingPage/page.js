"use client";
import "../globals.css";

export default function LandingPage() {
  return (
    <main style={{ position: 'relative', minHeight: 'calc(100vh - 70px)' }}>
      <div className="welcome-container">
        <h1 className="welcome-title">Welcome to LearnToType</h1>
        <p className="welcome-subtitle">Master your typing skills with our intuitive platform</p>
      </div>
    </main>
  );
}
