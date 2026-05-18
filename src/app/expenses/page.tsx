"use client";

// ── Expenses page ─────────────────────────────────────────────────────────────

import AddExpenseForm from "@/components/AddExpenseForm";
import ExpenseList from "@/components/ExpenseList";
import { useExpenses } from "@/hooks/useExpenses";

export default function ExpensesPage() {
  const { expenses, addExpense, deleteExpense, isLoaded } = useExpenses();

  if (!isLoaded) return <div className="text-center text-gray-400 py-20">Loading…</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Add and manage all your transactions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add form */}
        <div className="md:col-span-1">
          <AddExpenseForm onAdd={addExpense} />
        </div>

        {/* Full expense list */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
              All Expenses
              <span className="ml-2 text-xs font-normal text-gray-400">
                ({expenses.length})
              </span>
            </h2>
            {expenses.length > 0 && (
              <span className="text-xs text-gray-400">
                Total:{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-200">
                  ${expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
                </span>
              </span>
            )}
          </div>
          <ExpenseList expenses={expenses} onDelete={deleteExpense} />
        </div>
      </div>
    </div>
  );
}