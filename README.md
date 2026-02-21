# 🏀 College Basketball Scouting Dashboard

> NCAA-to-NBA player archetype predictions — built with React, TypeScript, Vite & Tailwind CSS.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

---

## ⚡ Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) **v18+**
- npm (comes with Node)

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` to point at your Flask backend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> 💡 The frontend uses mock data by default, so you can skip this step if the backend isn't running yet.

### 3️⃣ Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser — you're in! 🎉

---

## 📦 Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | 🚀 Start Vite dev server with HMR |
| `npm run build` | 🔨 Type-check + production build |
| `npm run preview` | 👀 Preview the production build locally |

---

## 🗂️ Project Structure

```
src/
├── App.tsx              # Root layout + React Router
├── pages/               # Route-level page components
├── components/          # Reusable components
│   └── ui/              # shadcn/ui primitives (don't edit directly)
├── services/            # API client & service layer
├── types/               # Shared TypeScript interfaces
├── data/                # Mock/static data
├── hooks/               # Custom React hooks
└── styles/              # Tailwind config, theme & fonts
```

---

## 🔗 Backend Integration

The frontend communicates with a **Flask** backend via `src/services/api.ts`.

The `playerService.ts` file has a `USE_MOCK` flag — set it to `false` when backend endpoints are live.

---

## 🎨 Design

Original Figma design: [College Basketball Scouting Dashboard](https://www.figma.com/design/m6jwmL4BSvVfpiQMohtfO2/College-Basketball-Scouting-Dashboard)
