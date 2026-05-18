"use client";

// ─── ExpenseCard ──────────────────────────────────────────────────────────────
// Renders a single expense row with category colour, title, date, amount,
// and a delete button.

import { Trash2 } from "lucide-react";
import { Expense } from "@/types/expense";
import { CATEGORY_COLORS } from "@/lib/constants";

interface Props {
  expense: Expense;
  onDelete: (id: string) => void;
}

export default function ExpenseCard({ expense, onDelete }: Props) {
  const color = CATEGORY_COLORS[expense.category];

  // Format "2024-05-18" → "May 18, 2024"
  const formattedDate = new Date(expense.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  return (
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
      {/* Left: colour dot + text */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Category colour indicator */}
        <span
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <div className="min-w-0">
          <p className="font-medium text-gray-800 dark:text-white truncate">
            {expense.title}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {expense.category} · {formattedDate}
          </p>
        </div>
      </div>

      {/* Right: amount + delete */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-4">
        <span className="font-semibold text-gray-800 dark:text-white">
          ${expense.amount.toFixed(2)}
        </span>
        <button
          onClick={() => onDelete(expense.id)}
          aria-label="Delete expense"
          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
