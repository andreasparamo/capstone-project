"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserSettings } from "@/lib/firestoreService";

export default function SettingsModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme: "dark",
    sound: true,
    soundEffect: "default"
  });
  const [loading, setLoading] = useState(false);
  const previousThemeRef = useRef(null);
  const audioCtxRef = useRef(null);
  const previewTimeoutsRef = useRef([]);

  // Helper: detect current theme class on body (first matching theme-*)
  const getCurrentThemeClass = () => {
    if (typeof document === 'undefined') return null;
    const classes = Array.from(document.body.classList || []);
    const themeClass = classes.find((c) => c.startsWith('theme-'));
    return themeClass || null;
  };

  const applyThemeClass = (theme) => {
    if (typeof document === 'undefined') return;
    // Remove existing theme-* classes
    Array.from(document.body.classList).forEach((c) => {
      if (c.startsWith('theme-')) document.body.classList.remove(c);
    });

    if (!theme) return;
    if (theme === 'auto') {
      // Respect OS preference for preview
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      // Also keep auto marker
      document.body.classList.add('theme-auto');
    } else {
      document.body.classList.add(`theme-${theme}`);
    }
  };

  // Load saved settings when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // Capture current theme class ONCE when modal opens (for cancel/restore)
    // This prevents flicker by not re-applying themes during load
    previousThemeRef.current = getCurrentThemeClass();

    const load = async () => {
      let loadedSettings = { theme: "dark", sound: true, soundEffect: "default" };

      // Try localStorage first
      try {
        const local = localStorage.getItem('ltt_settings');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && typeof parsed === 'object') {
            loadedSettings = { ...loadedSettings, ...parsed };
          }
        }
      } catch (e) {
        console.warn('Failed to parse localStorage settings:', e);
      }

      // If user is signed in, load from profile and override
      if (user && user.uid) {
        try {
          const res = await getUserProfile(user.uid);
          if (res && res.success && res.data && res.data.settings) {
            loadedSettings = { ...loadedSettings, ...res.data.settings };
          }
        } catch (e) {
          console.warn('Failed to load user profile settings:', e);
        }
      }

      // Set state once with final merged settings (no theme application here)
      setSettings(loadedSettings);
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.uid]);

  // Handle input changes and preview theme immediately for quick feedback
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setSettings((prev) => ({ ...prev, [name]: newVal }));

    if (name === 'theme') {
      applyThemeClass(newVal);
    }
    
    // Play preview for soundEffect selection immediately (user gesture)
    if (name === 'soundEffect') {
      // only preview if sound is enabled
      if ((type === 'checkbox' && checked) || settings.sound) {
        try {
          playPreview(newVal);
        } catch (err) {
          // ignore preview failures
          console.warn('Preview failed', err);
        }
      }
    }
  };

  // Cleanup any scheduled preview timeouts when unmounting
  useEffect(() => {
    return () => {
      previewTimeoutsRef.current.forEach((id) => clearTimeout(id));
      previewTimeoutsRef.current = [];
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
        audioCtxRef.current = null;
      }
    };
  }, []);

  // WebAudio synth preview helper
  const ensureAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  };

  const playTone = (freq = 440, time = 0.08, type = 'sine', when = 0) => {
    const ctx = ensureAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + when);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime + when);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + when + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + when + time);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime + when);
    osc.stop(ctx.currentTime + when + time + 0.02);
  };

  const playPreview = (effect) => {
    // don't play when sound disabled
    if (!settings.sound) return;
    const ctx = ensureAudioContext();
    if (!ctx) return;

    // Small mapping of preview sounds
    // cancel any scheduled timeouts
    previewTimeoutsRef.current.forEach((id) => clearTimeout(id));
    previewTimeoutsRef.current = [];

    switch (effect) {
      case 'typewriter':
        // 3 quick clicks
        playTone(800, 0.06, 'square', 0);
        previewTimeoutsRef.current.push(setTimeout(() => playTone(780, 0.06, 'square', 0), 90));
        previewTimeoutsRef.current.push(setTimeout(() => playTone(760, 0.06, 'square', 0), 180));
        break;
      case 'blip':
        playTone(1200, 0.12, 'sine', 0);
        break;
      case 'pop':
        // short sweep: two quick tones
        playTone(600, 0.06, 'sawtooth', 0);
        previewTimeoutsRef.current.push(setTimeout(() => playTone(420, 0.08, 'sine', 0), 80));
        break;
      case 'none':
        // silent
        break;
      default:
        // default click
        playTone(880, 0.08, 'sine', 0);
        break;
    }
  };

  const revertThemeAndClose = () => {
    // restore previous theme
    if (previousThemeRef.current) {
      // remove theme-* classes then reapply previous
      Array.from(document.body.classList).forEach((c) => {
        if (c.startsWith('theme-')) document.body.classList.remove(c);
      });
      document.body.classList.add(previousThemeRef.current);
    }
    // Try to return focus to the typing test (main) so keyboard works immediately
    try {
      const main = document.querySelector('main');
      if (main && typeof main.click === 'function') main.click();
      else if (typeof document.body.focus === 'function') document.body.focus();
    } catch (e) {}
    onClose();
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Apply settings persistently
    try {
      if (user && user.uid) {
        const res = await updateUserSettings(user.uid, settings);
        if (!res.success) throw new Error(res.error || 'Failed to save settings');
        // success: keep previewed theme applied
        try { localStorage.setItem('ltt_settings', JSON.stringify(settings)); } catch (e) {}
        setLoading(false);
        try {
          const main = document.querySelector('main');
          if (main && typeof main.click === 'function') main.click();
          else if (typeof document.body.focus === 'function') document.body.focus();
        } catch (e) {}
        onClose();
      } else {
        // fallback to localStorage for unauthenticated users
        try {
          localStorage.setItem('ltt_settings', JSON.stringify(settings));
        } catch (err) {
          console.error('LocalStorage save failed', err);
        }
        setLoading(false);
        // indicate to user they can save to account by signing in
        alert('Settings saved locally. Sign in to persist to your account.');
        try {
          const main = document.querySelector('main');
          if (main && typeof main.click === 'function') main.click();
          else if (typeof document.body.focus === 'function') document.body.focus();
        } catch (e) {}
        onClose();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setLoading(false);
      alert('Failed to save settings. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={revertThemeAndClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={revertThemeAndClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSettingsSubmit}>
          {/* Theme Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">Appearance</h3>
            <div className="form-group">
              <label htmlFor="theme">Theme</label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleSettingChange}
                className="theme-select"
              >
                <option value="dark">Dark (default)</option>
                <option value="ocean">Ocean Blue</option>
                <option value="forest">Forest Green</option>
                <option value="sunset">Sunset</option>
                <option value="midnight">Midnight</option>
                <option value="sunrise">Sunrise</option>
              </select>
              <p className="setting-description">
                Choose your preferred theme. Preview applies instantly; click Save to persist.
              </p>
            </div>
          </div>

          {/* General Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">General</h3>
            

            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sound"
                  checked={settings.sound}
                  onChange={handleSettingChange}
                />
                <span>Sound Effects</span>
              </label>
              <p className="setting-description">
                Play sound effects during typing tests and games
              </p>
            </div>

            <div className="form-group">
              <label htmlFor="soundEffect">Sound Effect</label>
              <select
                id="soundEffect"
                name="soundEffect"
                value={settings.soundEffect}
                onChange={handleSettingChange}
                className="theme-select"
                disabled={!settings.sound}
              >
                <option value="default">Default</option>
                <option value="typewriter">Typewriter</option>
                <option value="blip">Blip</option>
                <option value="pop">Pop</option>
                <option value="none">None</option>
              </select>
              <p className="setting-description">
                Choose which sound effect set to play. Toggle Sound Effects off to mute.
              </p>
            </div>

            
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={revertThemeAndClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
