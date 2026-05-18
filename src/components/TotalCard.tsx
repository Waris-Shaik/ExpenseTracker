"use client";

// ─── TotalCard ────────────────────────────────────────────────────────────────
// Shows three summary numbers: total spent, number of expenses, biggest expense.

import { TrendingUp, Receipt, DollarSign } from "lucide-react";
import { Expense } from "@/types/expense";

interface Props {
  expenses: Expense[];
}

// Small stat tile used inside TotalCard
function StatTile({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className={`p-3 rounded-xl ${accent}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

export default function TotalCard({ expenses }: Props) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const biggest = expenses.length
    ? Math.max(...expenses.map((e) => e.amount))
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatTile
        icon={<DollarSign size={20} className="text-emerald-600" />}
        label="Total Spent"
        value={`$${total.toFixed(2)}`}
        accent="bg-emerald-50 dark:bg-emerald-900/30"
      />
      <StatTile
        icon={<Receipt size={20} className="text-blue-600" />}
        label="Transactions"
        value={String(expenses.length)}
        accent="bg-blue-50 dark:bg-blue-900/30"
      />
      <StatTile
        icon={<TrendingUp size={20} className="text-purple-600" />}
        label="Biggest Expense"
        value={`$${biggest.toFixed(2)}`}
        accent="bg-purple-50 dark:bg-purple-900/30"
      />
    </div>
  );
}
