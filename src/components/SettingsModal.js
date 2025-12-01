"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserSettings } from "@/lib/firestoreService";

export default function SettingsModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    theme: "dark",
    sound: true
  });
  const [loading, setLoading] = useState(false);
  const previousThemeRef = useRef(null);

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
    // capture previous theme to allow cancel/restore
    previousThemeRef.current = getCurrentThemeClass();

    const load = async () => {
      // Try localStorage first
      try {
        const local = localStorage.getItem('ltt_settings');
        if (local) {
          const parsed = JSON.parse(local);
          setSettings((prev) => ({ ...prev, ...parsed }));
          // preview
          if (parsed.theme) applyThemeClass(parsed.theme);
        }
      } catch (e) {
        // ignore
      }

      // If user is signed in, load from profile and override
      if (user && user.uid) {
        const res = await getUserProfile(user.uid);
        if (res.success && res.data && res.data.settings) {
          setSettings((prev) => ({ ...prev, ...res.data.settings }));
          if (res.data.settings.theme) applyThemeClass(res.data.settings.theme);
        }
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Handle input changes and preview theme immediately for quick feedback
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newVal = type === 'checkbox' ? checked : value;
    setSettings((prev) => ({ ...prev, [name]: newVal }));

    if (name === 'theme') {
      applyThemeClass(newVal);
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
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
                <option value="ocean">Ocean Blue</option>
                <option value="forest">Forest Green</option>
                <option value="sunset">Sunset</option>
                <option value="midnight">Midnight</option>
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
