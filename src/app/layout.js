import "./globals.css";
import Link from "next/link";
import { AuthProvider } from "../../context/AuthContext";

export const metadata = {
  title: "LearnToType - Master Your Typing Skills",
  description: "Intuitive Typing Practice Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}  
        </AuthProvider>
      </body>
    </html>
  );
}
