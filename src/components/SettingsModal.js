"use client";
import { useState } from "react";

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: true,
    sound: true,
    autoSave: true
  });

  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    // TODO: Apply settings and save to localStorage or database
    console.log("Settings saved:", settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>
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
                <option value="light">Light (Coming Soon)</option>
                <option value="auto">Auto (Coming Soon)</option>
                <option value="ocean">Ocean Blue (Coming Soon)</option>
                <option value="forest">Forest Green (Coming Soon)</option>
                <option value="sunset">Sunset (Coming Soon)</option>
                <option value="midnight">Midnight (Coming Soon)</option>
              </select>
              <p className="setting-description">
                Choose your preferred theme. More themes coming soon!
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
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleSettingChange}
                />
                <span>Enable Notifications</span>
              </label>
              <p className="setting-description">
                Receive notifications about your progress and achievements
              </p>
            </div>

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

            <div className="form-group-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="autoSave"
                  checked={settings.autoSave}
                  onChange={handleSettingChange}
                />
                <span>Auto-save Progress</span>
              </label>
              <p className="setting-description">
                Automatically save your progress after each test
              </p>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
