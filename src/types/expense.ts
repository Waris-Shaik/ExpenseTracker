// ─── Expense type ───────────────────────────────────────────────────────────
// This is the shape of every expense object in our app.

export type Category =
  | "Food"
  | "Transport"
  | "Shopping"
  | "Entertainment"
  | "Health"
  | "Utilities"
  | "Other";

export interface Expense {
  id: string;          // unique identifier (generated with crypto.randomUUID)
  title: string;       // short description, e.g. "Lunch"
  amount: number;      // in USD
  category: Category;
  date: string;        // ISO date string: "2024-05-18"
}
