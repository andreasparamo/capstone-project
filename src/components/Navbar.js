"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ProfileModal from "@/src/components/ProfileModal";
import SettingsModal from "@/src/components/SettingsModal";

const toggleDropdown = () => {
  const dropdown = document.getElementById("myDropdown");
  console.log("Dropdown element:", dropdown);
  console.log("Current classes:", dropdown?.classList);
  dropdown?.classList.toggle("show");
  console.log("After toggle:", dropdown?.classList);
};

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const openProfileModal = (e) => {
    e.preventDefault();
    setIsProfileModalOpen(true);
    // Close the dropdown when opening modal
    const dropdown = document.getElementById("myDropdown");
    dropdown?.classList.remove("show");
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const openSettingsModal = (e) => {
    e.preventDefault();
    setIsSettingsModalOpen(true);
    // Close the dropdown when opening modal
    const dropdown = document.getElementById("myDropdown");
    dropdown?.classList.remove("show");
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the user-menu
      if (!event.target.closest(".user-menu")) {
        const dropdowns = document.getElementsByClassName("dropdown-menu");
        for (let i = 0; i < dropdowns.length; i++) {
          dropdowns[i].classList.remove("show");
        }
      }
    };

    window.addEventListener("click", handleClickOutside);

    // Cleanup function
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header">
        <div className="nav-container">
          <Link href="/landingPage" className="logo">
            LearnToType
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/tests">Tests</Link>
              </li>
              <li>
                <Link href="/lessons">Lessons</Link>
              </li>
              <li>
                <Link href="/games">Games</Link>
              </li>
              <li>
                <Link href="/leaderboard">Leaderboard</Link>
              </li>
              <li>
                <Link href="/progress">Progress</Link>
              </li>
            </ul>
          </nav>
          <div className="user-menu">
            <button
              className="dropdown-toggle"
              onClick={toggleDropdown}
              aria-label="User menu"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid var(--border)',
                background: 'linear-gradient(135deg, var(--accent-1) 0%, var(--accent-2) 100%)',
                color: 'var(--on-accent, #fff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.borderColor = 'rgba(var(--accent-1-rgb), .45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <div className="dropdown-menu" id="myDropdown">
              <a href="#" onClick={openProfileModal}>
                Profile
              </a>
              <a href="#" onClick={openSettingsModal}>
                Settings
              </a>
              <a href="#" onClick={handleLogout}>
                Logout
              </a>
            </div>
          </div>
        </div>
      </header>

      <ProfileModal isOpen={isProfileModalOpen} onClose={closeProfileModal} />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      />
    </>
  );
}
