"use client";
import "../globals.css";
import ContainerTextFlip from "@/src/components/ContainerTextFlip";

export default function LandingPage() {
  return (
    <main style={{ position: 'relative', minHeight: 'calc(100vh - 70px)' }}>
      <div className="welcome-container">
        <h1 className="welcome-title">
          Learn to Type{" "}
          <ContainerTextFlip
            words={["Faster", "Smarter", "Better", "Efficiently"]}
            interval={2500}
          />
        </h1>
        <p className="welcome-subtitle">Master your typing skills with our intuitive platform</p>
      </div>
    </main>
  );
}
