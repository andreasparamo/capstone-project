"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Navbar from "@/src/components/Navbar";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If not loading and no user, and not on login page, redirect to login
    if (!loading && !user && pathname !== "/") {
      router.push("/");
    }
  }, [user, loading, router, pathname]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If on login page, always show it (without navbar)
  if (pathname === "/") {
    return <>{children}</>;
  }

  // If user is authenticated, show the navbar and protected content
  if (user) {
    return (
      <>
        <Navbar />
        {children}
      </>
    );
  }

  // If not authenticated and not on login page, don't show anything
  // (will redirect in useEffect)
  return null;
}
