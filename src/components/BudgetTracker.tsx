"use client";

// ─── BudgetTracker ────────────────────────────────────────────────────────────
// Lets the user set a monthly budget and see a live progress bar.
// Shows a yellow warning at 80% and a red alert when over budget.

import { useState } from "react";
import { Target, Pencil, X, Check, AlertTriangle, TrendingUp } from "lucide-react";
import { useBudget } from "@/hooks/useBudget";

interface Props {
  totalSpent: number;
}

export default function BudgetTracker({ totalSpent }: Props) {
  const { budget, setBudget, percentage, remaining, isOver, isWarning } =
    useBudget(totalSpent);

  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");

  function handleSave() {
    const val = parseFloat(input);
    if (!isNaN(val) && val > 0) {
      setBudget(val);
      setEditing(false);
      setInput("");
    }
  }

  function handleRemove() {
    setBudget(null);
    setEditing(false);
  }

  // ── Colour scheme based on status ────────────────────────────────────────
  const barColor = isOver
    ? "bg-red-500"
    : isWarning
    ? "bg-yellow-400"
    : "bg-emerald-500";

  const borderColor = isOver
    ? "border-red-300 dark:border-red-700"
    : isWarning
    ? "border-yellow-300 dark:border-yellow-700"
    : "border-gray-100 dark:border-gray-700";

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-5 ${borderColor} transition-colors`}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-800 dark:text-white font-semibold text-base">
          <Target size={18} className="text-emerald-500" />
          Monthly Budget
        </div>

        {budget !== null && !editing && (
          <button
            onClick={() => {
              setInput(String(budget));
              setEditing(true);
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Edit budget"
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      {/* ── No budget set yet ───────────────────────────────────────────── */}
      {budget === null && !editing && (
        <div className="flex flex-col items-center gap-3 py-4">
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            No budget set. Set one to track your spending limit.
          </p>
          <button
            onClick={() => setEditing(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Set Budget
          </button>
        </div>
      )}

      {/* ── Input form ──────────────────────────────────────────────────── */}
      {editing && (
        <div className="flex flex-col gap-3">
          <input
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 1000"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50
                       dark:bg-gray-900 text-gray-800 dark:text-white px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-1 bg-emerald-500
                         hover:bg-emerald-600 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
            >
              <Check size={15} /> Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center justify-center px-3 rounded-lg bg-gray-100
                         dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200
                         dark:hover:bg-gray-600 transition-colors"
            >
              <X size={15} />
            </button>
            {budget !== null && (
              <button
                onClick={handleRemove}
                className="text-xs text-red-400 hover:text-red-600 px-2 transition-colors"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Budget progress ──────────────────────────────────────────────── */}
      {budget !== null && !editing && (
        <div className="flex flex-col gap-3">
          {/* Numbers row */}
          <div className="flex justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Spent:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                ${totalSpent.toFixed(2)}
              </span>
            </span>
            <span className="text-gray-500 dark:text-gray-400">
              Budget:{" "}
              <span className="font-semibold text-gray-800 dark:text-white">
                ${budget.toFixed(2)}
              </span>
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Percentage label */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
            {percentage.toFixed(1)}% used
          </p>

          {/* ── Alert banners ──────────────────────────────────────────── */}
          {isOver && (
            <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
              <TrendingUp size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                  Over budget!
                </p>
                <p className="text-xs text-red-500 dark:text-red-500 mt-0.5">
                  You&apos;ve exceeded your limit by{" "}
                  <strong>${Math.abs(remaining!).toFixed(2)}</strong>. Try to
                  cut back on spending.
                </p>
              </div>
            </div>
          )}

          {isWarning && (
            <div className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
              <AlertTriangle size={16} className="text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
                  Heads up!
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-0.5">
                  Only{" "}
                  <strong>${remaining!.toFixed(2)}</strong> left for this month.
                </p>
              </div>
            </div>
          )}

          {!isOver && !isWarning && (
            <p className="text-xs text-emerald-500 font-medium">
              ✓ ${remaining!.toFixed(2)} remaining &mdash; you&apos;re on track!
            </p>
          )}
        </div>
      )}
    </div>
  );
}