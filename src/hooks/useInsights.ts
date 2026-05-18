// ─── useInsights hook ─────────────────────────────────────────────────────────
// Derives rich analytics purely from the expense array.

import { useMemo } from "react";
import { Expense, Category } from "@/types/expense";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";

export interface CategoryStat {
  category: Category;
  total: number;
  percentage: number;
  color: string;
  count: number;
}

export interface DayCell {
  date: string;
  label: string;       // "Today", "Yesterday", "Mon", "Tue" etc.
  amount: number;
  level: 0 | 1 | 2 | 3 | 4;
  isToday: boolean;
}

export interface SmartTip {
  id: string;
  icon: string;
  message: string;
  type: "warning" | "success" | "info";
}

export interface WeeklyComparison {
  thisWeek: number;
  lastWeek: number;
  change: number;       // percentage change
}

// Returns "Today", "Yesterday", or short weekday name
function friendlyDate(d: Date, today: Date): string {
  const todayStr = toKey(today);
  const yestStr  = toKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1));
  const key = toKey(d);
  if (key === todayStr)  return "Today";
  if (key === yestStr)   return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

function toKey(d: Date) {
  return d.toISOString().split("T")[0];
}

export function useInsights(expenses: Expense[]) {
  return useMemo(() => {
    // Use local midnight for today so date math matches expense date strings
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const total = expenses.reduce((s, e) => s + e.amount, 0);

    // Build a date → amount map
    const dayMap: Record<string, number> = {};
    expenses.forEach((e) => { dayMap[e.date] = (dayMap[e.date] || 0) + e.amount; });

    // ── Category stats ────────────────────────────────────────────────────
    const categoryStats: CategoryStat[] = CATEGORIES.map((cat) => {
      const catExp = expenses.filter((e) => e.category === cat);
      const catTotal = catExp.reduce((s, e) => s + e.amount, 0);
      return {
        category: cat,
        total: catTotal,
        percentage: total > 0 ? (catTotal / total) * 100 : 0,
        color: CATEGORY_COLORS[cat],
        count: catExp.length,
      };
    }).filter((s) => s.total > 0).sort((a, b) => b.total - a.total);

    // ── 7-week heatmap (49 cells, oldest → newest) ────────────────────────
    const allAmounts = Object.values(dayMap);
    const maxAmount = allAmounts.length ? Math.max(...allAmounts) : 1;

    const heatmapDays: DayCell[] = [];
    for (let i = 48; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key     = toKey(d);
      const amount  = dayMap[key] || 0;
      const ratio   = amount / maxAmount;
      const level: DayCell["level"] = amount === 0 ? 0 : ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1;
      heatmapDays.push({
        date:    key,
        label:   friendlyDate(d, today),
        amount,
        level,
        isToday: i === 0,
      });
    }

    // ── Streak ────────────────────────────────────────────────────────────
    let streak = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      if (dayMap[toKey(d)]) streak++;
      else break;
    }

    // ── Weekly comparison ─────────────────────────────────────────────────
    let thisWeek = 0, lastWeek = 0;
    for (let i = 0; i < 7; i++) {
      const d1 = new Date(today); d1.setDate(today.getDate() - i);
      const d2 = new Date(today); d2.setDate(today.getDate() - i - 7);
      thisWeek += dayMap[toKey(d1)] || 0;
      lastWeek += dayMap[toKey(d2)] || 0;
    }
    const weeklyChange = lastWeek === 0 ? 0 : ((thisWeek - lastWeek) / lastWeek) * 100;
    const weeklyComparison: WeeklyComparison = { thisWeek, lastWeek, change: weeklyChange };

    // ── Busiest day of week ───────────────────────────────────────────────
    const byDow: Record<number, number> = { 0:0,1:0,2:0,3:0,4:0,5:0,6:0 };
    expenses.forEach((e) => {
      const dow = new Date(e.date + "T00:00:00").getDay();
      byDow[dow] = (byDow[dow] || 0) + e.amount;
    });
    const busiestDow = Object.entries(byDow).sort((a, b) => b[1] - a[1])[0];
    const dowNames   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const busiestDay = busiestDow && Number(busiestDow[1]) > 0 ? dowNames[Number(busiestDow[0])] : null;

    // ── Habits score ──────────────────────────────────────────────────────
    const topCatPct    = categoryStats[0]?.percentage ?? 0;
    const activeDays   = Object.keys(dayMap).length;
    const avgPerDay    = activeDays > 0 ? total / activeDays : 0;
    const diversity    = Math.max(0, 100 - topCatPct);
    const spendScore   = Math.max(0, 100 - (avgPerDay / 50) * 50);
    const habitsScore  = Math.round(diversity * 0.5 + spendScore * 0.5);

    // ── Smart tips ────────────────────────────────────────────────────────
    const tips: SmartTip[] = [];

    if (categoryStats[0]?.percentage > 40) {
      tips.push({ id: "top-cat", icon: "🎯",
        message: `${categoryStats[0].percentage.toFixed(0)}% of spending is on ${categoryStats[0].category}. Consider a sub-limit.`,
        type: "warning" });
    }

    if (streak >= 3) {
      tips.push({ id: "streak", icon: "🔥",
        message: `${streak}-day spending streak! A no-spend day can reset your habits.`,
        type: "info" });
    }

    if (weeklyChange > 20) {
      tips.push({ id: "week-up", icon: "📈",
        message: `Spending is up ${weeklyChange.toFixed(0)}% vs last week ($${thisWeek.toFixed(0)} vs $${lastWeek.toFixed(0)}).`,
        type: "warning" });
    }

    if (weeklyChange < -10 && lastWeek > 0) {
      tips.push({ id: "week-down", icon: "📉",
        message: `Great! Spending is down ${Math.abs(weeklyChange).toFixed(0)}% compared to last week.`,
        type: "success" });
    }

    if (avgPerDay > 0 && avgPerDay < 20) {
      tips.push({ id: "low-spend", icon: "💚",
        message: `You average only $${avgPerDay.toFixed(2)}/day — excellent discipline!`,
        type: "success" });
    }

    if (busiestDay) {
      tips.push({ id: "busy-day", icon: "📅",
        message: `${busiestDay} is your biggest spending day. Plan ahead for it.`,
        type: "info" });
    }

    if (expenses.length >= 5 && categoryStats.length >= 4) {
      tips.push({ id: "diverse", icon: "⚖️",
        message: `Spending across ${categoryStats.length} categories — good financial diversity!`,
        type: "success" });
    }

    if (tips.length === 0) {
      tips.push({ id: "empty", icon: "👋",
        message: "Add expenses to unlock personalised insights!",
        type: "info" });
    }

    return {
      categoryStats, heatmapDays, streak,
      habitsScore, tips, total, avgPerDay,
      weeklyComparison, busiestDay, activeDays,
    };
  }, [expenses]);
}