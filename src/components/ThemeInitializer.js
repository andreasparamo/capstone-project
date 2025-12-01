"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/lib/firestoreService";

export default function ThemeInitializer() {
  const { user } = useAuth();

  const applyThemeClass = (theme) => {
    if (typeof document === 'undefined') return;
    // Remove existing theme-* classes
    Array.from(document.body.classList).forEach((c) => {
      if (c.startsWith('theme-')) document.body.classList.remove(c);
    });

    if (!theme) return;
    if (theme === 'auto') {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(prefersDark ? 'theme-dark' : 'theme-light');
      document.body.classList.add('theme-auto');
    } else {
      document.body.classList.add(`theme-${theme}`);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // 1) localStorage fallback
      try {
        const local = localStorage.getItem('ltt_settings');
        if (local) {
          const parsed = JSON.parse(local);
          if (parsed && parsed.theme) {
            applyThemeClass(parsed.theme);
          }
        }
      } catch (e) {
        // ignore
      }

      // 2) if user is signed in, prefer server value
      if (user && user.uid) {
        try {
          const res = await getUserProfile(user.uid);
          if (!mounted) return;
          if (res.success && res.data && res.data.settings && res.data.settings.theme) {
            applyThemeClass(res.data.settings.theme);
          }
        } catch (err) {
          // ignore
        }
      }
    };

    load();

    return () => { mounted = false; };
  }, [user]);

  return null;
}
