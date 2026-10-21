# SNIPER — Accenture Placement Domination Platform

Single-user, offline-first progress tracker + complete study library for the Accenture
campus placement drive (Round 1 cognitive → Round 2 technical MCQ → coding round).

## What's inside

- **75 full lesson pages** across 9 domains (Aptitude, Pseudocode, Python DSA, SQL,
  Web HTML/CSS/JS, Networking, Security, Cloud, Office & CLI) — every lesson has
  TL;DR, core concepts, exam traps, cheat sheet, mnemonics, self-checkpoint and
  linked problems.
- **74 problems** (46 DSA with Python solutions, 16 SQL, 12 HTML/CSS/JS build-or-fix
  tasks). LeetCode problems deep-link to leetcode.com; SITE problems are fully
  self-contained.
- **Progress tracker dashboard**: readiness % weighted by the exam blueprint, D-n
  counter, streak flame, XP + levels, weakest-flank card.
- **Rotation engine**: Leitner boxes (1→2→4-day spacing), daily 4-block battle plan
  (REVISE → LEARN → PRACTICE → DRILL) generated from your weakest domain first.
- **Gamified completion logic**: gated "Learned"/"Mastered" states, confetti,
  XP toasts, streak tracking.
- **localStorage persistence** (`sniper:v1:*` keys) with export/import/reset in Settings.

## Run it

```bash
npm install   # or: bun install
npm run dev   # or: bun run dev
# open http://localhost:3000
```

The app is a single route (`/`) with a hash router — every topic and problem has its
own deep link, e.g. `#/topics/C/C3`, `#/problems/lc-53`.

## First run

1. Open Settings → set your real **exam date** (default: launch day + 9).
2. Dashboard → **Generate today's plan**.
3. Do the LEARN block first, then PRACTICE, then DRILL; REVISE every day.

## Structure

```
src/content/        typed study content (9 domain files, 3 problem files, roadmap)
src/lib/            zustand store + localStorage, rotation engine, hash router
src/components/sniper/   app shell + all views (dashboard, today, topics, problems, ...)
src/app/page.tsx    single route → SniperApp
```

All data stays in your browser. Nothing leaves the machine.
