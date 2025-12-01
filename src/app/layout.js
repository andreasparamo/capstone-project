import "./globals.css";
import { AuthProvider } from "../../context/AuthContext";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import ThemeInitializer from "@/src/components/ThemeInitializer";

export const metadata = {
  title: "LearnToType - Master Your Typing Skills",
  description: "Intuitive Typing Practice Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeInitializer />
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
