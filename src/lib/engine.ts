import type {
  Profile, Settings, TopicState, ProblemState, DayPlan, TopicStatus, ProblemStatus,
} from "@/content/types";

// ─── date helpers ────────────────────────────────────────────────────────
export const todayStr = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const addDays = (dateStr: string, n: number): string => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d + n);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

export const daysLeft = (examDate: string): number => {
  const [y, m, d] = examDate.split("-").map(Number);
  const [ty, tm, td] = todayStr().split("-").map(Number);
  const ms = Date.UTC(y, m - 1, d) - Date.UTC(ty, tm - 1, td);
  return Math.round(ms / 86400000);
};

// ─── gamification constants ─────────────────────────────────────────────
export const XP = {
  TOPIC_OPEN: 10, TOPIC_LEARNED: 40, TOPIC_MASTERED: 100,
  PROBLEM_EASY: 20, PROBLEM_MEDIUM: 40, PROBLEM_CUSTOM: 30,
  REVISE_ITEM: 10, DAY_STREAK: 5,
};

export const LEVELS: [number, string][] = [
  [0, "Recruit"], [500, "Cadet"], [1200, "Operator"],
  [2500, "Marksman"], [4000, "Sniper"], [6000, "Ghost"],
];

export const levelFor = (xp: number): { name: string; next: number | null; progress: number } => {
  let name = LEVELS[0][1];
  let base = 0;
  let next: number | null = LEVELS[0][0];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i][0]) {
      name = LEVELS[i][1];
      base = LEVELS[i][0];
      next = LEVELS[i + 1]?.[0] ?? null;
    }
  }
  const progress = next === null ? 1 : (xp - base) / (next - base);
  return { name, next, progress };
};

// ─── leitner boxes ───────────────────────────────────────────────────────
// box 1 → due same day · 2 → +1d · 3 → +2d · 4 → +4d · 5 → every day (cold recall)
export const BOX_INTERVALS: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 4, 5: 1 };

export const dueDateFor = (fromStr: string, box: number): string =>
  addDays(fromStr, BOX_INTERVALS[box] ?? 1);

export const isDue = (due: string, today: string): boolean => due <= today;

// ─── topic/problem default state ────────────────────────────────────────
export const freshTopic = (now: string): TopicState => ({
  status: "NOT_STARTED", box: 1, due: now, lastTouched: now, readPct: 0, revealed: 0,
});

export const freshProblem = (now: string): ProblemState => ({
  status: "TODO", attempts: 0, lastTouched: now, notes: "",
});

// ─── default profile ────────────────────────────────────────────────────
export const freshProfile = (): Profile => ({
  xp: 0, streak: 0, lastActiveDate: "", examDate: addDays(todayStr(), 9),
  dailyBudget: 180, firstLaunch: todayStr(),
});

export const freshSettings = (): Settings => ({ confetti: true, toasts: true });

// ─── mastery + readiness ────────────────────────────────────────────────
export const TOPIC_MASTERY: Record<TopicStatus, number> = {
  NOT_STARTED: 0, READING: 0.25, LEARNED: 0.7, MASTERED: 1,
};

export const STATUS_ORDER: Record<ProblemStatus, number> = {
  TODO: 0, ATTEMPTED: 0.25, REVISIT: 0.3, SOLVED: 1,
};
