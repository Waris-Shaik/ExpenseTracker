"use client";

// ─── useExpenses hook ────────────────────────────────────────────────────────
// Manages the expense list.
//   • Loads from localStorage on mount (falls back to dummy data)
//   • Saves to localStorage whenever the list changes
//   • Exposes addExpense and deleteExpense helpers

import { useState, useEffect } from "react";
import { Expense } from "@/types/expense";
import { DUMMY_EXPENSES } from "@/lib/constants";

const STORAGE_KEY = "expense-tracker-data";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Load from localStorage (runs once, client-side only) ──────────────────
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setExpenses(JSON.parse(stored) as Expense[]);
      } else {
        // First visit → start empty, no dummy data
        setExpenses([]);
      }
    } catch {
      setExpenses([]);
    }
    setIsLoaded(true);
  }, []);

  // ── Persist to localStorage whenever expenses change ─────────────────────
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses, isLoaded]);

  // ── Add a new expense ─────────────────────────────────────────────────────
  function addExpense(expense: Omit<Expense, "id">) {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
  }

  // ── Delete an expense by id ───────────────────────────────────────────────
  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  return { expenses, addExpense, deleteExpense, isLoaded };
}