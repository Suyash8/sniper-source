// ─── SNIPER content model ────────────────────────────────────────────────
// IDs are the single source of truth: they key localStorage, routes and the
// roadmap. Once shipped, IDs must never change.

export type Block =
  | { t: "p"; md: string }
  | { t: "list"; items: string[] }
  | { t: "code"; lang: string; src: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "callout"; kind: "trap" | "tip" | "memo"; md: string };

export type Section = { h: string; blocks: Block[] };

export type TopicStatus = "NOT_STARTED" | "READING" | "LEARNED" | "MASTERED";

export type Topic = {
  id: string;            // e.g. "C3"  (unique across all domains)
  domainId: string;      // "A".."I"
  title: string;
  minutes: number;
  tldr: string;          // exam relevance sentence
  examTag: string;       // e.g. "≈3 of 45 MCQs" / "1 of 3 coding Qs"
  sections: Section[];
  traps: string[];       // exact trick patterns the exam uses
  cheat: { head: string[]; rows: string[][] };
  mnemonic?: string;
  checkpoint: { q: string; a: string }[];
  problemIds: string[];
};

export type DomainId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I";

export type Domain = {
  id: DomainId;
  name: string;
  color: string;         // hex
  weight: number;        // exam weight %, sums to 100
  blurb: string;
};

export type ProblemDomain = "C" | "D" | "E";

export type Problem = {
  id: string;            // e.g. "lc-53" / "site-leaders"
  title: string;
  domainId: ProblemDomain;
  platform: "LEETCODE" | "SITE";
  leetcodeSlug?: string; // when platform=LEETCODE
  leetcodeUrl?: string;  // absolute link for the button
  pattern: string;       // "Kadane" / "Joins" / "Flexbox" ...
  difficulty: "EASY" | "MEDIUM";
  statement: string;
  examples: { input: string; output: string; why?: string }[];
  constraints?: string[];
  hints: string[];       // 2–3 progressive nudges
  approach: string;      // behind the gate
  solution: string;      // full runnable solution (Python / SQL / HTML)
  solutionLang: string;
  complexity?: string;
  topicIds: string[];
};

export type BlockType = "REVISE" | "LEARN" | "PRACTICE" | "DRILL";

export type RoadmapDay = {
  offset: number;                    // 0 = D-9 … 9 = D-0 (exam day)
  label: string;                     // "Build the engine"
  blocks: { type: BlockType; note: string; topicIds?: string[]; problemIds?: string[] }[];
};

// ─── persisted state (sniper:v1:*) ───────────────────────────────────────

export type TopicState = {
  status: TopicStatus;
  box: 1 | 2 | 3 | 4 | 5;
  due: string;           // YYYY-MM-DD when the item is due for revision
  lastTouched: string;   // ISO
  readPct: number;       // 0..100
  revealed: number;      // checkpoint answers revealed count
};

export type ProblemStatus = "TODO" | "ATTEMPTED" | "SOLVED" | "REVISIT";

export type ProblemState = {
  status: ProblemStatus;
  attempts: number;
  lastTouched: string;
  notes: string;
};

export type DayTask = {
  refId: string;         // topic or problem id
  kind: "topic" | "problem";
  status: "PENDING" | "DONE" | "SKIPPED";
  minutes: number;
};

export type DayBlock = { type: BlockType; tasks: DayTask[] };

export type DayPlan = {
  date: string;          // YYYY-MM-DD
  blocks: DayBlock[];
  source: "SEED" | "GENERATED";
};

export type Profile = {
  xp: number;
  streak: number;
  lastActiveDate: string;   // YYYY-MM-DD
  examDate: string;         // YYYY-MM-DD
  dailyBudget: number;      // minutes
  firstLaunch: string;
};

export type Settings = { confetti: boolean; toasts: boolean };
