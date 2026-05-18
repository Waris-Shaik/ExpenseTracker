"use client";

// ─── Navbar ──────────────────────────────────────────────────────────────────
// Top navigation bar with app logo and dark/light mode toggle button.

import { Moon, Sun, Wallet } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
          <Wallet size={24} />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Expense<span className="text-emerald-500">Tracker</span>
          </span>
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300
                     hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}
