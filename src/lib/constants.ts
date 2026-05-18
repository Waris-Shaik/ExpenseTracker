import { Category, Expense } from "@/types/expense";

// ─── Category colours ────────────────────────────────────────────────────────
// Used by the chart and expense cards to colour-code categories.
export const CATEGORY_COLORS: Record<Category, string> = {
  Food: "#f97316",
  Transport: "#3b82f6",
  Shopping: "#a855f7",
  Entertainment: "#ec4899",
  Health: "#22c55e",
  Utilities: "#eab308",
  Other: "#64748b",
};

// ─── All selectable categories ───────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Other",
];

// ─── Dummy data shown on first load ─────────────────────────────────────────
export const DUMMY_EXPENSES: Expense[] = [
  {
    id: "1",
    title: "Grocery run",
    amount: 54.2,
    category: "Food",
    date: "2024-05-15",
  },
  {
    id: "2",
    title: "Uber ride",
    amount: 12.5,
    category: "Transport",
    date: "2024-05-16",
  },
  {
    id: "3",
    title: "Netflix subscription",
    amount: 15.99,
    category: "Entertainment",
    date: "2024-05-16",
  },
  {
    id: "4",
    title: "Pharmacy",
    amount: 28.0,
    category: "Health",
    date: "2024-05-17",
  },
  {
    id: "5",
    title: "Amazon order",
    amount: 89.99,
    category: "Shopping",
    date: "2024-05-17",
  },
  {
    id: "6",
    title: "Electricity bill",
    amount: 67.4,
    category: "Utilities",
    date: "2024-05-18",
  },
  {
    id: "7",
    title: "Coffee & snacks",
    amount: 9.75,
    category: "Food",
    date: "2024-05-18",
  },
];
