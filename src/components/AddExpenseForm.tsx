"use client";

// ─── AddExpenseForm ───────────────────────────────────────────────────────────
// A controlled form to add a new expense.
// Receives an onAdd callback so the parent (Dashboard) can update state.

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Category, Expense } from "@/types/expense";
import { CATEGORIES } from "@/lib/constants";

interface Props {
  onAdd: (expense: Omit<Expense, "id">) => void;
}

// Reusable labelled input wrapper
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {children}
    </div>
  );
}

// Shared Tailwind classes for inputs & selects
const inputClass =
  "w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 " +
  "text-gray-800 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";

export default function AddExpenseForm({ onAdd }: Props) {
  // ── Local form state ──────────────────────────────────────────────────────
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Food");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // today
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // ── Basic validation ──────────────────────────────────────────────────
    if (!title.trim()) return setError("Please enter a title.");
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0)
      return setError("Please enter a valid amount greater than 0.");
    if (!date) return setError("Please select a date.");

    // ── Add and reset ─────────────────────────────────────────────────────
    onAdd({ title: title.trim(), amount: parsedAmount, category, date });
    setTitle("");
    setAmount("");
    setCategory("Food");
    setDate(new Date().toISOString().split("T")[0]);
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
        Add New Expense
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Title">
          <input
            className={inputClass}
            placeholder="e.g. Lunch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Field>

        <Field label="Amount ($)">
          <input
            className={inputClass}
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </Field>

        <Field label="Category">
          <select
            className={inputClass}
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date">
          <input
            className={inputClass}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </Field>

        {/* Validation error */}
        {error && (
          <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
        )}

        <button
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 
                     active:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <PlusCircle size={18} />
          Add Expense
        </button>
      </form>
    </div>
  );
}
