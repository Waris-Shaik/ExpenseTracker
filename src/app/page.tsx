"use client";

// ─── Dashboard Page ───────────────────────────────────────────────────────────
// This is the only page in the app.
// Layout (desktop):  left column = form + chart | right column = stats + list

import Navbar from "@/components/Navbar";
import TotalCard from "@/components/TotalCard";
import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import ExpenseChart from "@/components/ExpenseChart";
import { useExpenses } from "@/hooks/useExpenses";

export default function DashboardPage() {
  const { expenses, addExpense, deleteExpense, isLoaded } = useExpenses();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* ── Top navigation ───────────────────────────────────────────────── */}
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* ── Page heading ────────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track and manage your daily expenses
          </p>
        </div>

        {/* ── Show a skeleton/placeholder while localStorage loads ─────────── */}
        {!isLoaded ? (
          <div className="text-center text-gray-400 py-20">Loading…</div>
        ) : (
          <>
            {/* Summary cards (full width) */}
            <section className="mb-6">
              <TotalCard expenses={expenses} />
            </section>

            {/*
             * Two-column layout on md+ screens:
             *   Left  (1/3 width): Add form  +  Chart
             *   Right (2/3 width): Expense list
             */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ── LEFT COLUMN ────────────────────────────────────────────── */}
              <div className="md:col-span-1 flex flex-col gap-6">
                <AddExpenseForm onAdd={addExpense} />
                <ExpenseChart expenses={expenses} />
              </div>

              {/* ── RIGHT COLUMN ───────────────────────────────────────────── */}
              <div className="md:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                  <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
                    All Expenses
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      ({expenses.length})
                    </span>
                  </h2>
                  <ExpenseList expenses={expenses} onDelete={deleteExpense} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
