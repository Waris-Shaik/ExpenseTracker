"use client";

// ─── ExpenseInsights ──────────────────────────────────────────────────────────
// A rich analytics panel rendered below the main dashboard.
// Sections:
//   1. Habits score ring + streak badge
//   2. Category breakdown with animated bars
//   3. 7-week spending heatmap
//   4. Smart tips

import { Expense } from "@/types/expense";
import { useInsights, SmartTip } from "@/hooks/useInsights";
import { Flame, Sparkles, Brain } from "lucide-react";

interface Props {
  expenses: Expense[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color =
    score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="128" height="128" className="-rotate-90">
        {/* Track */}
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10"
          className="stroke-gray-100 dark:stroke-gray-700" />
        {/* Progress */}
        <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10"
          stroke={color}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-gray-800 dark:text-white">{score}</span>
        <span className="text-[10px] text-gray-400 uppercase tracking-wide">Score</span>
      </div>
    </div>
  );
}

function TipCard({ tip }: { tip: SmartTip }) {
  const styles: Record<SmartTip["type"], string> = {
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    info:    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  };

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${styles[tip.type]}`}>
      <span className="text-base leading-snug">{tip.icon}</span>
      <p className="leading-snug">{tip.message}</p>
    </div>
  );
}

const HEATMAP_COLORS = [
  "bg-gray-100 dark:bg-gray-800",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-400 dark:bg-emerald-600",
  "bg-emerald-500 dark:bg-emerald-500",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Main component ────────────────────────────────────────────────────────────

export default function ExpenseInsights({ expenses }: Props) {
  const { categoryStats, heatmapDays, streak, habitsScore, tips, avgPerDay } =
    useInsights(expenses);

  // Group heatmap into 7 columns (weeks) of 7 rows (days)
  // heatmapDays has 49 items (7 weeks)
  const weeks: typeof heatmapDays[] = [];
  for (let w = 0; w < 7; w++) {
    weeks.push(heatmapDays.slice(w * 7, w * 7 + 7));
  }

  return (
    <section className="mt-8">
      {/* Section heading */}
      <div className="flex items-center gap-2 mb-4">
        <Brain size={20} className="text-purple-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Expense Insights
        </h2>
        <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded-full font-medium">
          AI-style analytics
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* ── 1. Habits score + streak ──────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 self-start">
            <Sparkles size={16} className="text-purple-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Habits Score
            </span>
          </div>

          <ScoreRing score={habitsScore} />

          <p className="text-xs text-center text-gray-400 dark:text-gray-500">
            {habitsScore >= 70
              ? "Excellent spending habits! Keep it up."
              : habitsScore >= 40
              ? "Room to improve — diversify your spending."
              : "High concentration in one category. Review it!"}
          </p>

          {/* Streak badge */}
          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl px-4 py-2 w-full justify-center">
            <Flame size={16} className="text-orange-500" />
            <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
              {streak > 0 ? `${streak}-day streak` : "No streak yet"}
            </span>
          </div>

          {avgPerDay > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Avg spend: <strong className="text-gray-700 dark:text-gray-200">${avgPerDay.toFixed(2)}/day</strong>
            </p>
          )}
        </div>

        {/* ── 2. Category breakdown ─────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Top Categories
          </p>

          {categoryStats.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {categoryStats.slice(0, 5).map((stat) => (
                <div key={stat.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: stat.color }}
                      />
                      {stat.category}
                      <span className="text-gray-400">({stat.count})</span>
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ${stat.total.toFixed(2)} · {stat.percentage.toFixed(0)}%
                    </span>
                  </div>
                  {/* Animated bar */}
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${stat.percentage}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 3. Smart tips ─────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Smart Tips
          </p>
          <div className="flex flex-col gap-3">
            {tips.map((tip) => (
              <TipCard key={tip.id} tip={tip} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Spending heatmap (full width) ─────────────────────────────── */}
      <div className="mt-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          Last 7 Weeks — Daily Spending Heatmap
        </p>

        <div className="overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {/* Day labels column */}
            <div className="flex flex-col gap-1 mr-1">
              {DAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="text-[10px] text-gray-400 dark:text-gray-600 w-7 h-7 flex items-center justify-end pr-1"
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Week columns */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    title={
                      cell.amount > 0
                        ? `${cell.date}: $${cell.amount.toFixed(2)}`
                        : cell.date
                    }
                    className={`w-7 h-7 rounded-md cursor-default transition-colors ${HEATMAP_COLORS[cell.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] text-gray-400">Less</span>
          {HEATMAP_COLORS.map((cls, i) => (
            <div key={i} className={`w-4 h-4 rounded-sm ${cls}`} />
          ))}
          <span className="text-[10px] text-gray-400">More</span>
        </div>
      </div>
    </section>
  );
}