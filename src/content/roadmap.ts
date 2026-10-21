import type { RoadmapDay } from "./types";

// Seed roadmap D-9 … D-0. Day offsets: 0 = today-at-first-launch (D-9) … 9 = exam day (D-0).
export const ROADMAP: RoadmapDay[] = [
  {
    offset: 0, label: "Build the engine — I/O + arrays",
    blocks: [
      { type: "LEARN", note: "Python I/O templates + arrays/two pointers", topicIds: ["C1", "C2"] },
      { type: "PRACTICE", note: "First blood problems", problemIds: ["lc-1", "site-fib", "site-leaders"] },
      { type: "DRILL", note: "Hand-trace 5 pseudocode snippets (B9 method)" },
    ],
  },
  {
    offset: 1, label: "Kadane day + SQL skeleton",
    blocks: [
      { type: "LEARN", note: "Kadane & prefix sums", topicIds: ["C3"] },
      { type: "REVISE", note: "C1, C2 + yesterday's problems", topicIds: ["C1", "C2"], problemIds: ["lc-1", "site-leaders"] },
      { type: "PRACTICE", note: "lc-53 re-solve COLD, lc-121, lc-169", problemIds: ["lc-53", "lc-121", "lc-169"] },
      { type: "LEARN", note: "SQL basics", topicIds: ["D1"] },
      { type: "DRILL", note: "B1-B2 operator/loop MCQs" },
    ],
  },
  {
    offset: 2, label: "Hashmaps, strings, joins + the CSS fix",
    blocks: [
      { type: "LEARN", note: "Hashmaps & strings", topicIds: ["C5", "C6"] },
      { type: "REVISE", note: "C3 (Kadane cold)", topicIds: ["C3"], problemIds: ["lc-53"] },
      { type: "PRACTICE", note: "anagram & dedupe family", problemIds: ["lc-242", "lc-217", "lc-387"] },
      { type: "LEARN", note: "SQL joins + box model + units (finish site-cardfix!)", topicIds: ["D3", "E4", "E8"] },
      { type: "PRACTICE", note: "The CSS bug you shipped", problemIds: ["site-cardfix"] },
      { type: "DRILL", note: "B3-B4 string/container MCQs" },
    ],
  },
  {
    offset: 3, label: "Windows, binary search, 2nd salary ×3, ports",
    blocks: [
      { type: "LEARN", note: "Sliding window + binary search", topicIds: ["C4", "C7"] },
      { type: "REVISE", note: "C5", topicIds: ["C5"], problemIds: ["lc-242"] },
      { type: "PRACTICE", note: "window/bisect set", problemIds: ["lc-704", "lc-34", "lc-209", "lc-3"] },
      { type: "LEARN", note: "2nd salary three ways + ports table", topicIds: ["D6", "F6"] },
      { type: "PRACTICE", note: "lc-176 + lc-1280 (3-table)", problemIds: ["lc-176", "lc-1280"] },
      { type: "DRILL", note: "B10 loop counting" },
    ],
  },
  {
    offset: 4, label: "Stacks, recursion, OSI, crypto",
    blocks: [
      { type: "LEARN", note: "Stacks + recursion", topicIds: ["C8", "C10"] },
      { type: "REVISE", note: "C4, C7 cold traces", topicIds: ["C4", "C7"], problemIds: ["lc-209", "lc-34"] },
      { type: "PRACTICE", note: "parentheses & friends", problemIds: ["lc-20", "lc-231", "lc-412"] },
      { type: "LEARN", note: "OSI + devices + symmetric/asymmetric + hashing", topicIds: ["F2", "F4", "G2", "G3"] },
      { type: "DRILL", note: "Ports rapid-fire (F6 chunks)" },
    ],
  },
  {
    offset: 5, label: "VLOOKUP day + flexbox + cloud",
    blocks: [
      { type: "LEARN", note: "Cloud models + Excel functions (VLOOKUP!)", topicIds: ["H2", "H3", "I1"] },
      { type: "REVISE", note: "F6 ports, G2 crypto", topicIds: ["F6", "G2"] },
      { type: "PRACTICE", note: "SQL pattern vault", problemIds: ["lc-176", "lc-1280", "site-lowest-avg"] },
      { type: "LEARN", note: "Flexbox + transitions", topicIds: ["E6", "E9"] },
      { type: "DRILL", note: "Aptitude speed: number & letter series" },
    ],
  },
  {
    offset: 6, label: "Recursion MCQs, attacks, subqueries, JS survival",
    blocks: [
      { type: "LEARN", note: "Recursion tracing + loop counting + attacks + subqueries", topicIds: ["B6", "B10", "G6", "D4"] },
      { type: "REVISE", note: "H2 cloud, I1 VLOOKUP", topicIds: ["H2", "I1"] },
      { type: "PRACTICE", note: "SQL patterns + JS counter", problemIds: ["site-avg-marks-desc", "lc-184", "site-counter"] },
      { type: "LEARN", note: "IP addressing + JS survival kit", topicIds: ["F5", "E10"] },
      { type: "DRILL", note: "Devices & ports elimination drill" },
    ],
  },
  {
    offset: 7, label: "FULL REVISION — cold solves only",
    blocks: [
      { type: "REVISE", note: "Every box-1/box-2 item in the tracker", topicIds: ["C1", "C3", "C5", "D3", "D6", "E8", "F6", "G2", "I1"] },
      { type: "PRACTICE", note: "Cold solves, no hints: Kadane, joins, CSS fix", problemIds: ["lc-53", "lc-1280", "site-cardfix"] },
      { type: "LEARN", note: "Skim every domain cheat sheet (read-only)" },
      { type: "DRILL", note: "30 pseudocode output traces, table method" },
    ],
  },
  {
    offset: 8, label: "SIMULATION DAY — full dress rehearsal",
    blocks: [
      { type: "DRILL", note: "45-min timed block: 20 MCQs from B/F/G/H traps" },
      { type: "PRACTICE", note: "1 unseen DSA + 1 SQL + 1 CSS fix, timed", problemIds: ["lc-167", "lc-177", "site-hover"] },
      { type: "REVISE", note: "Cheat sheets only — no new material", topicIds: ["C3", "C12"] },
      { type: "LEARN", note: "Sleep early. That's an order." },
    ],
  },
  {
    offset: 9, label: "EXAM DAY",
    blocks: [
      { type: "DRILL", note: "Ports. Kadane. 2nd salary 3 ways. TODAY≠NOW. RSA≠MD5. Router=L3. Trace [-2,1]. Go." },
    ],
  },
];
