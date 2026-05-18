"use client";

// ─── useTheme hook ───────────────────────────────────────────────────────────
// Reads / writes "theme" in localStorage.
// Adds / removes the "dark" class on <html> so Tailwind dark: variants work.

import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");

  // Load saved theme on mount
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return { theme, toggleTheme };
}
