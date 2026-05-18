"use client";

// ─── ExpenseChart ─────────────────────────────────────────────────────────────
// Bar chart: total spending per category using Recharts.
// Recharts components must be rendered client-side (they use DOM APIs).

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Expense } from "@/types/expense";
import { CATEGORY_COLORS, CATEGORIES } from "@/lib/constants";

interface Props {
  expenses: Expense[];
}

export default function ExpenseChart({ expenses }: Props) {
  // ── Aggregate total per category ─────────────────────────────────────────
  const data = CATEGORIES.map((cat) => ({
    name: cat,
    total: expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + e.amount, 0),
  })).filter((d) => d.total > 0); // hide categories with no spending

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
        <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-3">
          Spending by Category
        </h2>
        <p className="text-sm text-gray-400 text-center py-8">
          No data to display yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
      <h2 className="text-base font-semibold text-gray-800 dark:text-white mb-4">
        Spending by Category
      </h2>

      {/* ResponsiveContainer makes the chart fill its parent width */}
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 0 }}>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "none",
              borderRadius: "8px",
              color: "#f9fafb",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={CATEGORY_COLORS[entry.name as keyof typeof CATEGORY_COLORS]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
