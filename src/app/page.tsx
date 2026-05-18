"use client";

// ── Dashboard / Home page ────────────────────────────────────────────────────

import TotalCard from "@/components/TotalCard";
import ExpenseChart from "@/components/ExpenseChart";
import ExpenseList from "@/components/ExpenseList";
import { useExpenses } from "@/hooks/useExpenses";
import Link from "next/link";
import { PlusCircle, Brain, Target, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { expenses, deleteExpense, isLoaded } = useExpenses();

  if (!isLoaded) return <div className="text-center text-gray-400 py-20">Loading…</div>;

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Welcome back — here is your spending overview
        </p>
      </div>

      {/* Stats row */}
      <TotalCard expenses={expenses} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { href: "/expenses", icon: PlusCircle, label: "Add Expense",    sub: "Log a new transaction",   color: "emerald" },
          { href: "/insights", icon: Brain,      label: "View Insights",  sub: "Analyse your habits",     color: "purple"  },
          { href: "/budget",   icon: Target,     label: "Set Budget",     sub: "Track your monthly limit", color: "blue"    },
        ].map(({ href, icon: Icon, label, sub, color }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 p-4 rounded-2xl border bg-white dark:bg-gray-800
              border-gray-100 dark:border-gray-700 hover:border-${color}-300 dark:hover:border-${color}-700
              hover:shadow-md transition-all group`}
          >
            <div className={`p-2.5 rounded-xl bg-${color}-50 dark:bg-${color}-900/30`}>
              <Icon size={18} className={`text-${color}-600 dark:text-${color}-400`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{label}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{sub}</p>
            </div>
            <ArrowRight size={14} className="text-gray-300 group-hover:text-gray-500 dark:group-hover:text-gray-300 transition-colors" />
          </Link>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpenseChart expenses={expenses} />

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-800 dark:text-white">Recent Expenses</h2>
            <Link href="/expenses" className="text-xs text-emerald-500 hover:underline">View all</Link>
          </div>
          <ExpenseList expenses={recentExpenses} onDelete={deleteExpense} />
        </div>
      </div>
    </div>
  );
}