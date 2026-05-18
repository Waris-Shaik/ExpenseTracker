"use client";

// ─── useBudget hook ───────────────────────────────────────────────────────────
// Stores the user's monthly budget limit in localStorage.
// Returns the budget, a setter, and helper derived values.

import { useState, useEffect } from "react";

const BUDGET_KEY = "expense-tracker-budget";

export function useBudget(totalSpent: number) {
  const [budget, setBudgetState] = useState<number | null>(null);

  // Load saved budget on mount
  useEffect(() => {
    const saved = localStorage.getItem(BUDGET_KEY);
    if (saved) setBudgetState(parseFloat(saved));
  }, []);

  function setBudget(amount: number | null) {
    setBudgetState(amount);
    if (amount === null) {
      localStorage.removeItem(BUDGET_KEY);
    } else {
      localStorage.setItem(BUDGET_KEY, String(amount));
    }
  }

  // Derived values
  const percentage = budget ? Math.min((totalSpent / budget) * 100, 100) : 0;
  const remaining = budget ? budget - totalSpent : null;
  const isOver = budget !== null && totalSpent > budget;
  const isWarning = budget !== null && !isOver && percentage >= 80;

  return { budget, setBudget, percentage, remaining, isOver, isWarning };
}