# 💸 Expense Tracker

A simple, beginner-friendly expense tracker built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Recharts**, and **Lucide React**.

All data is stored in **localStorage** — no backend, no database, no auth required.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📊 Dashboard | Stats cards + category bar chart |
| ➕ Add expense | Title, amount, category, date |
| 🗑️ Delete expense | One-click removal |
| 🌙 Dark / Light mode | Persisted in localStorage |
| 📱 Responsive | Works on mobile and desktop |
| 💾 LocalStorage | Data survives page refreshes |

---

## 🗂️ Project Structure

```
expense-tracker/
├── src/
│   ├── app/
│   │   ├── globals.css       # Tailwind base styles
│   │   ├── layout.tsx        # Root layout (Next.js App Router)
│   │   └── page.tsx          # Dashboard page
│   ├── components/
│   │   ├── Navbar.tsx        # Top nav + theme toggle
│   │   ├── TotalCard.tsx     # Summary stats
│   │   ├── AddExpenseForm.tsx# Controlled form
│   │   ├── ExpenseList.tsx   # List container
│   │   ├── ExpenseCard.tsx   # Single expense row
│   │   └── ExpenseChart.tsx  # Recharts bar chart
│   ├── hooks/
│   │   ├── useExpenses.ts    # Expense CRUD + localStorage
│   │   └── useTheme.ts       # Dark/light mode
│   ├── lib/
│   │   └── constants.ts      # Dummy data, categories, colours
│   └── types/
│       └── expense.ts        # TypeScript interfaces
├── .github/
│   └── workflows/
│       └── ci.yml            # GitHub Actions (install → lint → build)
├── tailwind.config.ts
├── next.config.js
└── tsconfig.json
```

---

## 🚀 Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/expense-tracker.git
cd expense-tracker

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 🛠️ Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## ☁️ Deploy to Vercel

Vercel is the easiest way to deploy a Next.js app.

### Option A — Vercel Dashboard (Recommended)

1. Push your code to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. Click **"Add New Project"**.
4. Import your `expense-tracker` repository.
5. Leave all settings as default — Vercel auto-detects Next.js.
6. Click **"Deploy"**.

Your app will be live in under a minute at `https://your-project.vercel.app`.

### Option B — Vercel CLI

```bash
# Install the CLI globally
npm install -g vercel

# Login
vercel login

# Deploy (follow the prompts)
vercel

# Deploy to production
vercel --prod
```

---

## 🔄 GitHub Actions CI

Every push / pull-request to `main` runs the CI pipeline defined in `.github/workflows/ci.yml`:

1. **Install** — `npm install`
2. **Lint** — `npm run lint`
3. **Build** — `npm run build`

The workflow badge will show green if all steps pass. ✅

---

## 🧩 Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Recharts](https://recharts.org/) | Bar chart |
| [Lucide React](https://lucide.dev/) | Icons |

---

## 📄 License

MIT — feel free to use and modify for your own projects.
