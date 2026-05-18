"use client";

// ── Insights page ─────────────────────────────────────────────────────────────

import { useExpenses } from "@/hooks/useExpenses";
import { useInsights, SmartTip } from "@/hooks/useInsights";
import { Flame, Sparkles, TrendingUp, TrendingDown, Calendar, Activity } from "lucide-react";

// ── Sub-components ────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r    = 52;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#eab308" : "#ef4444";
  const label = score >= 70 ? "Excellent" : score >= 40 ? "Fair" : "Needs work";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative inline-flex items-center justify-center">
        <svg width="132" height="132" className="-rotate-90">
          <circle cx="66" cy="66" r={r} fill="none" strokeWidth="11"
            className="stroke-gray-100 dark:stroke-gray-700" />
          <circle cx="66" cy="66" r={r} fill="none" strokeWidth="11"
            stroke={color}
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1s ease" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-tight">
          <span className="text-3xl font-bold text-gray-800 dark:text-white">{score}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">/ 100</span>
        </div>
      </div>
      <span className="text-xs font-semibold px-3 py-1 rounded-full"
        style={{ backgroundColor: color + "22", color }}>
        {label}
      </span>
    </div>
  );
}

function TipCard({ tip }: { tip: SmartTip }) {
  const map: Record<SmartTip["type"], string> = {
    warning: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    success: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300",
    info:    "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300",
  };
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-3 text-sm ${map[tip.type]}`}>
      <span className="text-base mt-0.5 flex-shrink-0">{tip.icon}</span>
      <p className="leading-snug">{tip.message}</p>
    </div>
  );
}

const HEAT_COLORS = [
  "bg-gray-100 dark:bg-gray-800",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-400 dark:bg-emerald-500",
  "bg-emerald-500 dark:bg-emerald-400",
];

// ── Main page ─────────────────────────────────────────────────────────────────

export default function InsightsPage() {
  const { expenses, isLoaded } = useExpenses();
  const {
    categoryStats, heatmapDays, streak,
    habitsScore, tips, avgPerDay,
    weeklyComparison, activeDays,
  } = useInsights(expenses);

  if (!isLoaded) return <div className="text-center text-gray-400 py-20">Loading…</div>;

  // Group heatmap into 7 columns of 7 rows
  const weeks = Array.from({ length: 7 }, (_, w) => heatmapDays.slice(w * 7, w * 7 + 7));

  const weekUp = weeklyComparison.change > 0;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Understand your spending patterns and habits
        </p>
      </div>

      {/* ── Row 1: Score + Streak + Weekly comparison ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        {/* Habits score */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col items-center gap-3">
          <div className="flex items-center gap-1.5 self-start">
            <Sparkles size={15} className="text-purple-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Habits Score</span>
          </div>
          <ScoreRing score={habitsScore} />
          <p className="text-[11px] text-center text-gray-400 dark:text-gray-500 leading-snug">
            Based on spending diversity and daily average
          </p>
        </div>

        {/* Streak + avg */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Flame size={15} className="text-orange-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Activity</span>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-3 flex items-center gap-3">
              <Flame size={22} className="text-orange-500" />
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{streak} days</p>
                <p className="text-xs text-gray-400">Current streak</p>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 flex items-center gap-3">
              <Activity size={22} className="text-blue-500" />
              <div>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{activeDays}</p>
                <p className="text-xs text-gray-400">Active days tracked</p>
              </div>
            </div>
            {avgPerDay > 0 && (
              <p className="text-xs text-center text-gray-400">
                Avg <strong className="text-gray-700 dark:text-gray-200">${avgPerDay.toFixed(2)}</strong> per active day
              </p>
            )}
          </div>
        </div>

        {/* This week vs last week */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 flex flex-col gap-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={15} className="text-indigo-500" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Weekly Compare</span>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-gray-400 mb-1">This week</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">
                ${weeklyComparison.thisWeek.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-1">Last week</p>
              <p className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                ${weeklyComparison.lastWeek.toFixed(2)}
              </p>
            </div>

            {weeklyComparison.lastWeek > 0 && (
              <div className={`flex items-center gap-1.5 text-sm font-semibold rounded-lg px-3 py-1.5
                ${weekUp
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                }`}>
                {weekUp ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                {weekUp ? "+" : ""}{weeklyComparison.change.toFixed(1)}% vs last week
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Row 2: Category bars + Smart tips ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Category breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-5">
            Top Categories
          </h2>

          {categoryStats.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-10">No data yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {categoryStats.slice(0, 6).map((s) => (
                <div key={s.category}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: s.color }} />
                      {s.category}
                      <span className="text-gray-400 font-normal">×{s.count}</span>
                    </span>
                    <span className="font-semibold text-gray-600 dark:text-gray-300">
                      ${s.total.toFixed(2)}
                      <span className="ml-1 text-gray-400 font-normal">
                        {s.percentage.toFixed(0)}%
                      </span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{ width: `${s.percentage}%`, backgroundColor: s.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Smart tips */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-5">
            Smart Tips
          </h2>
          <div className="flex flex-col gap-3">
            {tips.map((tip) => <TipCard key={tip.id} tip={tip} />)}
          </div>
        </div>
      </div>

      {/* ── Row 3: Spending heatmap ── */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-5">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white mb-5">
          Daily Spending — Last 7 Weeks
        </h2>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1.5 min-w-max">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1.5">
                {week.map((cell) => (
                  <div
                    key={cell.date}
                    title={
                      cell.amount > 0
                        ? `${cell.label} (${cell.date}): $${cell.amount.toFixed(2)}`
                        : `${cell.label} (${cell.date}): No spending`
                    }
                    className={[
                      "w-8 h-8 rounded-lg cursor-default transition-all hover:scale-110 relative flex items-center justify-center",
                      HEAT_COLORS[cell.level],
                      cell.isToday ? "ring-2 ring-emerald-500 ring-offset-1 dark:ring-offset-gray-800" : "",
                    ].join(" ")}
                  >
                    {cell.isToday && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend + Today marker explanation */}
        <div className="flex items-center gap-4 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400">Less</span>
            {HEAT_COLORS.map((cls, i) => (
              <div key={i} className={`w-4 h-4 rounded-sm ${cls}`} />
            ))}
            <span className="text-[11px] text-gray-400">More</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <div className="w-4 h-4 rounded-sm bg-gray-100 dark:bg-gray-800 ring-2 ring-emerald-500" />
            Today
          </div>
        </div>

        {/* Day labels below the last 7 cells (today's column) */}
        <div className="mt-3 flex gap-1.5 overflow-x-auto min-w-max">
          {weeks.map((week, wi) => (
            <div key={wi} className="w-8 text-center">
              <span className="text-[10px] text-gray-300 dark:text-gray-600">
                {wi === 6 ? week[week.length - 1]?.label?.slice(0, 3) : ""}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}