"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile, updateUserProfile } from "@/lib/firestoreService";

export default function ProfileModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    bio: "",
    phone: "",
    location: ""
  });
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        // Try to load profile from Firestore
        const result = await getUserProfile(user.uid);

        if (result.success && result.data) {
          setProfileData({
            displayName: result.data.displayName || user.displayName || "",
            email: user.email || "",
            bio: result.data.bio || "",
            phone: result.data.phone || "",
            location: result.data.location || ""
          });
        } else {
          // If no profile exists, use auth data
          setProfileData({
            displayName: user.displayName || "",
            email: user.email || "",
            bio: "",
            phone: "",
            location: ""
          });
        }
      }
    };

    if (isOpen) {
      loadUserProfile();
    }
  }, [user, isOpen]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setSaveMessage(""); // Clear any previous messages
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveMessage("");

    try {
      const result = await updateUserProfile(user.uid, {
        displayName: profileData.displayName,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location
      });

      if (result.success) {
        setSaveMessage("Profile updated successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSaveMessage("Error: " + result.error);
      }
    } catch (error) {
      setSaveMessage("Error saving profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Profile Settings</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        {saveMessage && (
          <div className={saveMessage.startsWith("Error") ? "error-message" : "success-message"}>
            {saveMessage}
          </div>
        )}
        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={profileData.displayName}
              onChange={handleProfileChange}
              placeholder="Enter your display name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              placeholder="Enter your email"
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              placeholder="Enter your phone number"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={profileData.location}
              onChange={handleProfileChange}
              placeholder="Enter your location"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
