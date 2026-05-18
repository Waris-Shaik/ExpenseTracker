"use client";

// ── Budget page ───────────────────────────────────────────────────────────────

import BudgetTracker from "@/components/BudgetTracker";
import { useExpenses } from "@/hooks/useExpenses";
import { CATEGORY_COLORS, CATEGORIES } from "@/lib/constants";
import { Category } from "@/types/expense";

export default function BudgetPage() {
  const { expenses, isLoaded } = useExpenses();

  if (!isLoaded) return <div className="text-center text-gray-400 py-20">Loading…</div>;

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  // Per-category totals for the mini breakdown
  const catTotals = CATEGORIES.map((cat) => ({
    cat,
    total: expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0),
    color: CATEGORY_COLORS[cat as Category],
  })).filter((c) => c.total > 0).sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budget</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Set your monthly limit and track where money goes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Budget tracker card */}
        <BudgetTracker totalSpent={total} />

        {/* Category spend breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-4">
            Spending by Category
          </h2>

          {catTotals.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-10">
              No expenses yet. Add some to see breakdown.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {catTotals.map(({ cat, total: catTotal, color }) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                      {cat}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ${catTotal.toFixed(2)}
                      {total > 0 && (
                        <span className="ml-1 text-gray-400">
                          ({((catTotal / total) * 100).toFixed(0)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-2.5 rounded-full transition-all duration-700"
                      style={{
                        width: total > 0 ? `${(catTotal / total) * 100}%` : "0%",
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}