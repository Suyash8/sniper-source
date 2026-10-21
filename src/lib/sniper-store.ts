"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Profile, Settings, TopicState, ProblemState, DayPlan, DayBlock, DayTask,
  ProblemStatus, BlockType,
} from "@/content/types";
import { TOPICS, topicById } from "@/content";
import { PROBLEMS, problemById } from "@/content/problems";
import { DOMAINS, domainById } from "@/content/domains";
import {
  todayStr, addDays, daysLeft, freshTopic, freshProblem, freshProfile, freshSettings,
  dueDateFor, TOPIC_MASTERY, XP,
} from "./engine";

type BlockStatus = "PENDING" | "DONE" | "SKIPPED";

type Store = {
  profile: Profile;
  topics: Record<string, TopicState>;
  problems: Record<string, ProblemState>;
  days: Record<string, DayPlan>;
  settings: Settings;
  hydrated: boolean;
  markHydrated: () => void;

  // profile / settings
  setExamDate: (d: string) => void;
  setBudget: (m: number) => void;
  setSettings: (s: Partial<Settings>) => void;
  resetAll: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;

  // topics
  openTopic: (id: string) => void;
  setReadPct: (id: string, pct: number) => void;
  revealCheckpoint: (id: string) => void;
  markLearned: (id: string) => void;
  markMastered: (id: string) => void;
  boxOf: (id: string) => number;
  dropBox: (id: string) => void;

  // problems
  openProblem: (id: string) => void;
  setProblemStatus: (id: string, s: ProblemStatus) => void;
  setNotes: (id: string, notes: string) => void;

  // day plans
  generateDay: (date?: string) => DayPlan;
  setTaskStatus: (date: string, blockIdx: number, taskIdx: number, s: BlockStatus) => void;
  dayDone: (date: string) => boolean;
};

// streak/lastActive touch: returns xp gained from streak if new active day
function touchStreak(profile: Profile): { profile: Profile; gained: number } {
  const today = todayStr();
  if (profile.lastActiveDate === today) return { profile, gained: 0 };
  const yesterday = addDays(today, -1);
  const streak = profile.lastActiveDate === yesterday ? profile.streak + 1 : 1;
  return { profile: { ...profile, lastActiveDate: today, streak }, gained: XP.DAY_STREAK };
}

function addXp(state: { profile: Profile }, xp: number) {
  const { profile, gained } = touchStreak(state.profile);
  return { profile: { ...profile, xp: profile.xp + xp + gained } };
}

export const useSniper = create<Store>()(
  persist(
    (set, get) => ({
      profile: freshProfile(),
      topics: {},
      problems: {},
      days: {},
      settings: freshSettings(),
      hydrated: false,
      markHydrated: () => set({ hydrated: true }),

      setExamDate: (d) => set((s) => ({ profile: { ...s.profile, examDate: d } })),
      setBudget: (m) => set((s) => ({ profile: { ...s.profile, dailyBudget: m } })),
      setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),
      resetAll: () => set({
        profile: freshProfile(), topics: {}, problems: {}, days: {}, settings: freshSettings(),
      }),
      exportData: () => {
        const { profile, topics, problems, days, settings } = get();
        return JSON.stringify({ version: 1, profile, topics, problems, days, settings }, null, 2);
      },
      importData: (json) => {
        try {
          const d = JSON.parse(json);
          if (!d || typeof d !== "object" || !d.profile) return false;
          set({
            profile: { ...freshProfile(), ...d.profile },
            topics: d.topics ?? {}, problems: d.problems ?? {},
            days: d.days ?? {}, settings: { ...freshSettings(), ...(d.settings ?? {}) },
          });
          return true;
        } catch {
          return false;
        }
      },

      openTopic: (id) => set((s) => {
        const now = new Date().toISOString();
        const cur = s.topics[id] ?? freshTopic(todayStr());
        const first = cur.status === "NOT_STARTED";
        return {
          ...addXp(s, first ? XP.TOPIC_OPEN : 0),
          topics: {
            ...s.topics,
            [id]: {
              ...cur, status: first ? "READING" : cur.status,
              lastTouched: now, due: dueDateFor(todayStr(), cur.box),
            },
          },
        };
      }),
      setReadPct: (id, pct) => set((s) => {
        const cur = s.topics[id] ?? freshTopic(todayStr());
        return {
          topics: { ...s.topics, [id]: { ...cur, readPct: Math.max(cur.readPct, pct) } },
        };
      }),
      revealCheckpoint: (id) => set((s) => {
        const cur = s.topics[id] ?? freshTopic(todayStr());
        const total = topicById(id)?.checkpoint.length ?? 1;
        const revealed = Math.min(total, cur.revealed + 1);
        return { topics: { ...s.topics, [id]: { ...cur, revealed } } };
      }),
      markLearned: (id) => set((s) => {
        const cur = s.topics[id] ?? freshTopic(todayStr());
        if (cur.status === "LEARNED" || cur.status === "MASTERED") return s;
        const t = topicById(id);
        const total = t?.checkpoint.length ?? 1;
        if (cur.readPct < 100 || cur.revealed < total) return s; // gated
        const box = Math.min(5, cur.box + 1) as TopicState["box"];
        return {
          ...addXp(s, XP.TOPIC_LEARNED),
          topics: {
            ...s.topics,
            [id]: { ...cur, status: "LEARNED", box, due: dueDateFor(todayStr(), box) },
          },
        };
      }),
      markMastered: (id) => set((s) => {
        const cur = s.topics[id];
        const t = topicById(id);
        if (!cur || !t) return s;
        if (cur.status !== "LEARNED") return s;
        const allSolved = t.problemIds.every(
          (pid) => (s.problems[pid]?.status ?? "TODO") === "SOLVED",
        );
        if (!allSolved || cur.box < 3) return s; // gated
        const box = Math.min(5, cur.box + 1) as TopicState["box"];
        return {
          ...addXp(s, XP.TOPIC_MASTERED),
          topics: {
            ...s.topics,
            [id]: { ...cur, status: "MASTERED", box, due: dueDateFor(todayStr(), box) },
          },
        };
      }),
      boxOf: (id) => get().topics[id]?.box ?? 1,
      dropBox: (id) => set((s) => {
        const cur = s.topics[id];
        if (!cur) return s;
        const box = Math.max(1, cur.box - 1) as TopicState["box"];
        return { topics: { ...s.topics, [id]: { ...cur, box, due: dueDateFor(todayStr(), box) } } };
      }),

      openProblem: (id) => set((s) => {
        const now = new Date().toISOString();
        const cur = s.problems[id] ?? freshProblem(todayStr());
        return { problems: { ...s.problems, [id]: { ...cur, lastTouched: now } } };
      }),
      setProblemStatus: (id, status) => set((s) => {
        const now = new Date().toISOString();
        const cur = s.problems[id] ?? freshProblem(todayStr());
        const p = problemById(id);
        let gained = 0;
        if (status === "SOLVED" && cur.status !== "SOLVED") {
          gained = p?.platform === "SITE" ? XP.PROBLEM_CUSTOM
            : p?.difficulty === "MEDIUM" ? XP.PROBLEM_MEDIUM : XP.PROBLEM_EASY;
        }
        return {
          ...addXp(s, gained),
          problems: { ...s.problems, [id]: { ...cur, status, attempts: cur.attempts + 1, lastTouched: now } },
        };
      }),
      setNotes: (id, notes) => set((s) => {
        const cur = s.problems[id] ?? freshProblem(todayStr());
        return { problems: { ...s.problems, [id]: { ...cur, notes } } };
      }),

      // ── rotation engine ─────────────────────────────────────────────
      generateDay: (date) => {
        const d = date ?? todayStr();
        const s = get();
        const budget = s.profile.dailyBudget;
        const blocks: DayBlock[] = [];
        const reviseTasks: DayTask[] = [];
        const practice: DayTask[] = [];
        let used = 0;

        const topicMin = (id: string) => topicById(id)?.minutes ?? 30;
        const probMin = (id: string) => (problemById(id)?.difficulty === "MEDIUM" ? 25 : 15);
        const topicTask = (id: string) => ({
          refId: id, kind: "topic" as const, status: "PENDING" as const, minutes: topicMin(id),
        });
        const probTask = (id: string) => ({
          refId: id, kind: "problem" as const, status: "PENDING" as const, minutes: probMin(id),
        });

        // 1) REVISE — due items first, heaviest exam weight first
        const dueTopics = TOPICS.filter((t) => {
          const st = s.topics[t.id];
          return st && (st.status === "LEARNED" || st.status === "READING") && st.due <= d;
        }).sort((a, b) => domainById(b.domainId).weight - domainById(a.domainId).weight);
        for (const t of dueTopics) {
          if (used + topicMin(t.id) > 45) break;
          reviseTasks.push(topicTask(t.id));
          used += topicMin(t.id);
        }
        const dueProblems = PROBLEMS.filter((p) => {
          const st = s.problems[p.id];
          return st && st.status !== "SOLVED" && st.lastTouched.slice(0, 10) < d && st.attempts > 0;
        });
        for (const p of dueProblems) {
          if (used + probMin(p.id) > 45) break;
          reviseTasks.push(probTask(p.id));
          used += probMin(p.id);
        }
        if (reviseTasks.length) blocks.push({ type: "REVISE", tasks: reviseTasks });

        // 2) LEARN — one new topic from the highest-value domain
        const masteryOf = (domId: string) => {
          const domTopics = TOPICS.filter((t) => t.domainId === domId);
          const tm = domTopics.reduce((acc, t) => acc + TOPIC_MASTERY[s.topics[t.id]?.status ?? "NOT_STARTED"], 0);
          return tm / domTopics.length;
        };
        const ranked = DOMAINS.map((dom) => ({
          dom, score: dom.weight * (1 - masteryOf(dom.id)),
        })).sort((a, b) => b.score - a.score);
        for (const { dom } of ranked) {
          const next = TOPICS.find((t) => t.domainId === dom.id && (s.topics[t.id]?.status ?? "NOT_STARTED") === "NOT_STARTED");
          if (next && used + topicMin(next.id) <= budget) {
            blocks.push({ type: "LEARN", tasks: [topicTask(next.id)] });
            used += topicMin(next.id);
            break;
          }
        }

        // 3) PRACTICE — 2 DSA (1 new from current topic, 1 retry) + 1 SQL + 1 web
        const isUnsolved = (id: string) => (s.problems[id]?.status ?? "TODO") !== "SOLVED";
        const isRetry = (id: string) => {
          const st = s.problems[id];
          return st && (st.status === "ATTEMPTED" || st.status === "REVISIT");
        };
        const learningTopic = TOPICS.find((t) => s.topics[t.id]?.status === "READING");
        const freshDsa = learningTopic?.problemIds.find((pid) => isUnsolved(pid))
          ?? PROBLEMS.find((p) => p.domainId === "C" && isUnsolved(p.id))?.id;
        const retryDsa = PROBLEMS.find((p) => p.domainId === "C" && isRetry(p.id))?.id;
        if (freshDsa && used + probMin(freshDsa) <= budget) { practice.push(probTask(freshDsa)); used += probMin(freshDsa); }
        if (retryDsa && retryDsa !== freshDsa && used + probMin(retryDsa) <= budget) { practice.push(probTask(retryDsa)); used += probMin(retryDsa); }
        const sql = PROBLEMS.find((p) => p.domainId === "D" && isUnsolved(p.id))?.id;
        if (sql && used + probMin(sql) <= budget) { practice.push(probTask(sql)); used += probMin(sql); }
        const webMastery = masteryOf("E");
        if (webMastery < 0.9) {
          const web = PROBLEMS.find((p) => p.domainId === "E" && isUnsolved(p.id))?.id;
          if (web && used + probMin(web) <= budget) { practice.push(probTask(web)); used += probMin(web); }
        }
        if (practice.length) blocks.push({ type: "PRACTICE", tasks: practice });

        // 4) DRILL — pseudocode hand-trace block
        if (used + 15 <= budget) {
          blocks.push({
            type: "DRILL",
            tasks: [{ refId: "B9", kind: "topic", status: "PENDING", minutes: 15 }],
          });
        }

        const plan: DayPlan = { date: d, blocks, source: "GENERATED" };
        set((st) => ({ days: { ...st.days, [d]: plan } }));
        return plan;
      },

      setTaskStatus: (date, blockIdx, taskIdx, status) => set((s) => {
        const plan = s.days[date];
        if (!plan) return s;
        const blocks = plan.blocks.map((b, bi) =>
          bi !== blockIdx ? b : {
            ...b, tasks: b.tasks.map((t, ti) => (ti !== taskIdx ? t : { ...t, status })),
          });
        return { days: { ...s.days, [date]: { ...plan, blocks } } };
      }),
      dayDone: (date) => {
        const plan = get().days[date];
        if (!plan || plan.blocks.length === 0) return false;
        return plan.blocks.every((b) => b.tasks.every((t) => t.status === "DONE"));
      },
    }),
    {
      name: "sniper:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        profile: s.profile, topics: s.topics, problems: s.problems,
        days: s.days, settings: s.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);

export type { BlockType };
export const daysLeftNow = () => daysLeft(useSniper.getState().profile.examDate);
