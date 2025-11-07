"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle, user } = useAuth();
  const router = useRouter();

  // Redirect to landing page if already logged in
  useEffect(() => {
    if (user) {
      router.push("/landingPage");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      router.push("/landingPage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      router.push("/landingPage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      gap: '3rem'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="welcome-title">Welcome to LearnToType</h1>
        <p className="welcome-subtitle">Intuitive Typing Practice Platform</p>
      </div>

      <div className="login-box">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="divider">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="google-btn"
          disabled={loading}
        >
          Login with Google
        </button>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="toggle-btn"
            disabled={loading}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </main>
  );
}