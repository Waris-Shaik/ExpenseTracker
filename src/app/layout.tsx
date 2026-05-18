import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your daily expenses with ease",
};

// ─── Root Layout ─────────────────────────────────────────────────────────────
// Next.js App Router requires a root layout that wraps every page.
// We add suppressHydrationWarning on <html> to silence the warning caused
// by the dark/light class being set client-side.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-gray-950 min-h-screen font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
