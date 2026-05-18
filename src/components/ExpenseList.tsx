"use client";

// ─── ExpenseList ──────────────────────────────────────────────────────────────
// Renders all expenses newest-first.  Shows an empty-state when there are none.

import { PackageOpen } from "lucide-react";
import { Expense } from "@/types/expense";
import ExpenseCard from "./ExpenseCard";

interface Props {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onDelete }: Props) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-600 gap-3">
        <PackageOpen size={40} strokeWidth={1.5} />
        <p className="text-sm">No expenses yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {expenses.map((expense) => (
        <ExpenseCard key={expense.id} expense={expense} onDelete={onDelete} />
      ))}
    </div>
  );
}
