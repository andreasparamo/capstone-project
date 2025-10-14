"use client";
import { useEffect } from "react";
import "../globals.css";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const toggleDropdown = () => {
  const dropdown = document.getElementById("myDropdown");
  console.log("Dropdown element:", dropdown);
  console.log("Current classes:", dropdown?.classList);
  dropdown?.classList.toggle("show");
  console.log("After toggle:", dropdown?.classList);
};

export default function RootLayout({ children }) {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
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
          <Link href="/" className="logo">
            LearnToType
          </Link>
          <nav>
            <ul className="nav-links">
              <li>
                <Link href="/">Test</Link>
              </li>
              <li>
                <Link href="/lessons">Lessons</Link>
              </li>
              <li>
                <Link href="/games">Games</Link>
              </li>
              <li>
                <Link href="/progress">Progress</Link>
              </li>
              <li>
                <Link href="/leaderboard">Leaderboard</Link>
              </li>
            </ul>
          </nav>
          <div className="user-menu">
            <button
              className="dropdown-toggle"
              onClick={toggleDropdown}
              aria-label="User menu"
            >
              <img src="https://via.placeholder.com/40" alt="Profile Picture" />
            </button>
            <div className="dropdown-menu" id="myDropdown">
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#" onClick={handleLogout}>Logout</a>
            </div>
          </div>
        </div>
      </header>
      {children}
    </>
  );
}
