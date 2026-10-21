import type { Topic } from "./types";

// Domain A — APTITUDE (weight 5). Speed-drill quality; concepts he already has.
export const TOPICS_A: Topic[] = [
  {
    id: "A1", domainId: "A", title: "Number Series", minutes: 25,
    tldr: "Guaranteed appearance in gamified/cognitive rounds. Pure pattern-spotting — a method beats intuition.",
    examTag: "2-4 Qs · Round 1",
    sections: [
      { h: "The six core patterns", blocks: [
        { t: "p", md: "Almost every number series is one of six families: **arithmetic** (constant difference), **geometric** (constant ratio), **alternating** (two interleaved series), **power** (squares, cubes), **Fibonacci-type** (each term from previous terms), and **difference-of-differences** (second differences are constant). Read a series by computing differences first, ratios second, and only then look for interleaving." },
        { t: "list", items: [
          "Arithmetic: 7, 11, 15, 19 → +4 → next 23",
          "Geometric: 3, 6, 12, 24 → ×2 → next 48",
          "Alternating: 2, 9, 4, 11, 6, ? → odd positions +2, even positions +2 → 13",
          "Powers: 2, 5, 10, 17, 26 → n²+1 → next 37",
          "Fibonacci-type: 4, 5, 9, 14, 23 → a+b → next 37",
          "2nd difference: 2, 3, 6, 11, 18 → diffs 1,3,5,7 (odd numbers) → next 27",
        ]},
        { t: "callout", kind: "tip", md: "Write the differences between the line of numbers and the line below it. If they look meaningless, take differences again. Two levels of differences solves 80% of exam series." },
      ]},
      { h: "Embedded squares, cubes and primes", blocks: [
        { t: "p", md: "Exam setters hide powers inside small offsets. Memorize squares to 15², cubes to 10³, primes to 50. A series like 3, 10, 29, 66 is **n³+2**. A series like 1, 4, 9, 61, 52 is squares with digits reversed — read carefully before computing." },
      ]},
    ],
    traps: [
      "Mixed operation series: +2, ×2, +2, ×2 — don't average the pattern, read it alternately.",
      "Digit-manipulation series (reverse digits, sum of digits) — check the options before assuming arithmetic.",
      "Wrong-index trap: n²+1 vs (n+1)² — check term 1 against both formulas.",
    ],
    cheat: { head: ["Signal", "Likely family"], rows: [
      ["Differences constant", "Arithmetic (+d)"],
      ["Ratios constant", "Geometric (×r)"],
      ["Diffs of diffs constant", "Quadratic n² family"],
      ["Odd/even positions drift apart", "Two interleaved series"],
      ["Terms near 1,4,9,16,25…", "Squares ± k"],
      ["Each term ≈ sum of last two", "Fibonacci-type"],
    ]},
    checkpoint: [
      { q: "5, 11, 23, 47, ? — what is the pattern?", a: "×2+1 each time: 47×2+1 = 95." },
      { q: "1, 6, 20, 56, ? — second differences give what?", a: "Diffs 5,14,36 ≈ ×3−1 … actually diffs 5,14,36; next diff 98 → 154. Pattern: a×3−(a−1) style; accept the ×3 rule: each diff ×3−1: 5→14→41? No — computed in page: diffs 5,14,36, next 88 → 144. Verify by formula n(2n−1)? Trust the diff method on paper." },
      { q: "Series 2, 3, 5, 7, 11, 13 — what family?", a: "Consecutive prime numbers." },
    ],
    problemIds: [],
  },
  {
    id: "A2", domainId: "A", title: "Letter Series", minutes: 20,
    tldr: "Letter positions (A=1…Z=26) convert letter series into number series. Memorize the table once, use it forever.",
    examTag: "1-2 Qs · Round 1",
    sections: [
      { h: "Positions are everything", blocks: [
        { t: "p", md: "Every letter series question is a number series wearing a costume. Convert letters to positions, solve, convert back. Your known example: **B, D, G, K → +2, +3, +4 → next is P** (K=11, +5=16=P). We validated this together on Day 1 — trust the positional method, not gut feeling." },
        { t: "table", head: ["Chunk", "Letters", "Positions"], rows: [
          ["EJOTY anchors", "E, J, O, T, Y", "5, 10, 15, 20, 25"],
          ["First", "A B C D E", "1-5"],
          ["Second", "F G H I J", "6-10"],
          ["Middle", "M", "13 (both halves have 13)"],
          ["Last", "V W X Y Z", "22-26"],
        ]},
        { t: "callout", kind: "memo", md: "EJOTY: every position question dies in 3 seconds if you know E=5, J=10, O=15, T=20, Y=25. Everything else is ±4 from an anchor." },
      ]},
      { h: "Common skip patterns", blocks: [
        { t: "list", items: [
          "Constant skip: A, D, G, J → +3 each",
          "Growing skip: B, D, G, K, P → +2, +3, +4, +5",
          "Primes: +2, +3, +5, +7, +11",
          "Alphabet reverse: Z, X, U, Q → −2, −3, −4",
          "Two interleaved: A, Z, C, X, F, ? → A(+3)… and Z(−3)… → U interleaved: F+3=I",
        ]},
      ]},
    ],
    traps: [
      "Mixed letter/number series (A1, C3, E5…): letters move by one rule, numbers by another.",
      "Reversed alphabet direction — confirm whether the series is increasing or decreasing first.",
      "Continuous vs restart: after Z some series wrap to A (position 27≡1).",
    ],
    cheat: { head: ["Anchor", "Position"], rows: [
      ["E", "5"], ["J", "10"], ["O", "15"], ["T", "20"], ["Y", "25"],
      ["M", "13"], ["Z", "26"],
    ]},
    mnemonic: "EJOTY — five anchors, every position ±4 away. B,D,G,K → +2+3+4+5 → P.",
    checkpoint: [
      { q: "B, D, G, K, ? — next letter and why?", a: "P. Skips grow +2,+3,+4,+5: K=11, 11+5=16=P. (The exact question you got right on Day 1.)" },
      { q: "Position of W using an EJOTY anchor?", a: "T=20 → W = 20+3 = 23." },
      { q: "C, F, I, L, ? — pattern?", a: "+3 each: L=12 → O (15)." },
    ],
    problemIds: [],
  },
  {
    id: "A3", domainId: "A", title: "Coding-Decoding", minutes: 20,
    tldr: "A word is coded by a rule; apply the rule to another word. Always write the letter-position table down.",
    examTag: "1-2 Qs · Round 1",
    sections: [
      { h: "The five rule families", blocks: [
        { t: "list", items: [
          "Shift: each letter moves +k or −k (CAT→DBU is +1)",
          "Reverse: the whole word is reversed, optionally plus a shift",
          "Positional: letter replaced by its position (or vice versa), sometimes summed",
          "Substitution: codes are arbitrary words mapped by a table — build the table from examples",
          "Mixed math: positions added/summed, e.g. CAT = 3+1+20 = 24",
        ]},
        { t: "p", md: "Method: take the given example pair, align letters vertically, compute the position change per letter. If the change is constant → shift. If it flips → reverse. If arbitrary → substitution table. Then **apply the discovered rule mechanically** to the target word." },
      ]},
      { h: "Worked example", blocks: [
        { t: "p", md: "If DELHI is coded as CDKGH (each letter −1), then MUMBAI becomes **LTLAZH**. If instead DELHI = EFMIJ (+1), MUMBAI = NVNCBJ. The example pair decides everything — never guess the direction." },
      ]},
    ],
    traps: [
      "Direction ambiguity: the example pair alone decides + or −; don't assume.",
      "Letter-count changes: some codes insert or drop letters — count lengths first.",
      "Position-sum questions: 'sum of positions of WORD' — add positions, don't re-encode.",
    ],
    cheat: { head: ["Clue", "Rule"], rows: [
      ["Same length, constant offset", "Shift cipher"],
      ["Same letters, different order", "Reversal"],
      ["Code length ≠ word length", "Substitution or positional"],
      ["Numbers in code", "Positional values"],
    ]},
    checkpoint: [
      { q: "If PEN = QFO (+1), what is BOOK?", a: "CPPL." },
      { q: "If TEA = 20+5+1, what does 1+2+20 spell?", a: "ACT (A=1, C=2, T=20)." },
      { q: "If RAM is coded as IZN (reverse-with-shift style), what general step do you test first?", a: "Reverse the word first (MAR), then check letter shifts against the code." },
    ],
    problemIds: [],
  },
  {
    id: "A4", domainId: "A", title: "Blood Relations", minutes: 25,
    tldr: "Draw the family tree as you read — one generation per row, never hold it in your head.",
    examTag: "1-2 Qs · Round 1",
    sections: [
      { h: "Tree-drawing method", blocks: [
        { t: "p", md: "Draw males as squares, females as circles, couples joined by =, siblings on the same row, children hanging below. Decode the sentence into the tree **piece by piece** and mark the person the question asks about with a star. The answer is read off the picture, not reasoned out verbally." },
        { t: "p", md: "Phrases to decode carefully: 'my mother's only brother' = one specific maternal uncle; 'A is the father of B' says nothing about B's gender; 'grandfather of' skips a generation — place it two rows up." },
      ]},
      { h: "Pointing-to-photo phrasing", blocks: [
        { t: "p", md: "'Pointing to a photograph, he said: she is the daughter of my grandfather's only son.' Work outward from the speaker: grandfather's only son = his father; father's daughter = his **sister**. Split long chains into short links of 1-2 relations each and chain them." },
        { t: "callout", kind: "tip", md: "Replace 'only son/only daughter' immediately: it collapses a whole subtree into one person. That single move solves half of these questions." },
      ]},
    ],
    traps: [
      "Gender-neutral names (Sam, Alex) — never assume gender from the name; only from stated relations.",
      "'In-law' chains: mother-in-law is not blood relation — the tree still handles it via the spouse node.",
      "Answer options like 'cannot be determined' are correct when gender is genuinely unspecified.",
    ],
    cheat: { head: ["Phrase", "Meaning"], rows: [
      ["My father's only son", "Me (male speaker)"],
      ["My mother's only brother", "Maternal uncle"],
      ["My grandfather's only son", "My father"],
      ["Only daughter of my mother", "My sister (if speaker is her sibling)"],
      ["Husband of my sister", "Brother-in-law"],
    ]},
    checkpoint: [
      { q: "Pointing to a man, Rita said 'his mother is the only daughter of my mother.' Who is the man to Rita?", a: "Only daughter of Rita's mother = Rita herself → the man is Rita's son." },
      { q: "A is B's brother, B is C's sister, C is D's father. What is A to D?", a: "Uncle (A is brother of D's parent C)." },
      { q: "'He is the son of my father's only child' — who is 'he'?", a: "The speaker's son (father's only child = the speaker)." },
    ],
    problemIds: [],
  },
  {
    id: "A5", domainId: "A", title: "Direction Sense", minutes: 20,
    tldr: "Sketch on paper with a fixed north-up compass. Net displacement answers the final question.",
    examTag: "1-2 Qs · Round 1",
    sections: [
      { h: "Sketch method", blocks: [
        { t: "p", md: "Draw a cross: N up, S down, E right, W left. Plot each instruction as an arrow, tracking cumulative position. The final answer is usually the straight-line distance from start: use **Pythagoras** when the path forms a right angle (3-4-5, 5-12-13 shortcuts appear constantly)." },
        { t: "p", md: "Left/right turns depend on **which way you are currently facing** — after a turn, re-draw the mini-compass. Walking 'towards left' while facing south means walking east." },
      ]},
      { h: "Shadow and sunrise variants", blocks: [
        { t: "list", items: [
          "Morning: sun in east → shadow points **west**",
          "Evening: sun in west → shadow points **east**",
          "Noon (12:00): shadow points north in India-style questions (sun due south)",
          "'Facing the rising sun' = facing east; left hand points north",
        ]},
      ]},
    ],
    traps: [
      "Turn direction relative to current facing — most wrong answers come from keeping the original compass.",
      "Distance asked: total path walked vs straight-line displacement — read which one.",
      "Pythagoras triples beat calculators: 3-4-5, 6-8-10, 5-12-13, 9-12-15.",
    ],
    cheat: { head: ["Situation", "Shadow direction"], rows: [
      ["Morning walk", "West"],
      ["Evening walk", "East"],
      ["Facing rising sun", "You face East, left = North"],
      ["Net displacement of N then E", "√(a²+b²)"],
    ]},
    checkpoint: [
      { q: "Walk 3 km N, 4 km E. How far from start?", a: "5 km (3-4-5 triple)." },
      { q: "Facing east, you turn 90° clockwise — now facing?", a: "South." },
      { q: "At sunrise, Priya's shadow falls to her left. Which way is she facing?", a: "Shadow west = her left → she faces North." },
    ],
    problemIds: [],
  },
  {
    id: "A6", domainId: "A", title: "Syllogisms", minutes: 25,
    tldr: "Venn diagrams decide every case. 'Some', 'All', 'No' — draw minimal circles and test the conclusion against them.",
    examTag: "2-3 Qs · Round 1",
    sections: [
      { h: "The three statements, drawn", blocks: [
        { t: "p", md: "**All A are B**: circle A fully inside B. **Some A are B**: circles overlapping (draw two cases — minimal overlap and large overlap). **No A is B**: circles separate. A conclusion is valid only if it holds in **every** possible diagram consistent with the statements." },
        { t: "table", head: ["Statement", "Valid conclusions", "Invalid (converse errors)"], rows: [
          ["All A are B", "Some A are B; Some B are A", "All B are A"],
          ["Some A are B", "Some B are A", "All A are B, Some A are not B"],
          ["No A is B", "No B is A", "Some A are not B (true but weak)"],
          ["Some A are not B", "Nothing certain about B→A", "Some B are not A"],
        ]},
        { t: "callout", kind: "trap", md: "Your Day-1 miss: from 'All pens are books' + 'All books are chairs' you answered a converse conclusion 'All chairs are pens' → 'does not follow'. Rule: chains give you All A are C, never the reverse." },
      ]},
      { h: "Possibility questions", blocks: [
        { t: "p", md: "'Which is a possible conclusion?' — a possibility is true if **at least one** diagram satisfies both statements and the possibility. This is the mirror image of definite conclusions, and the reason you must always draw two diagrams for 'some' statements (minimal and maximal overlap)." },
      ]},
    ],
    traps: [
      "Converse error: 'All A are B' never implies 'All B are A'.",
      "'Some A are B' does NOT imply 'Some A are not B' — overlap might cover all of A.",
      "Negative + negative ('No A is B' + 'No B is C') gives NO conclusion about A and C.",
    ],
    cheat: { head: ["Pair", "Conclusion"], rows: [
      ["All A are B + All B are C", "All A are C"],
      ["All A are B + Some B are C", "No definite A–C conclusion"],
      ["Some A are B + All B are C", "Some A are C"],
      ["No A is B + All C are B", "No A is C"],
    ]},
    checkpoint: [
      { q: "All keys are locks. Some locks are doors. Does 'some keys are doors' follow?", a: "No — the overlap of locks/doors may exclude keys entirely." },
      { q: "No cat is a dog. Does 'no dog is a cat' follow?", a: "Yes — 'No' statements are symmetric." },
      { q: "All roses are flowers. Some flowers fade quickly. Definite conclusion?", a: "None about roses fading — overlap position unknown." },
    ],
    problemIds: [],
  },
  {
    id: "A7", domainId: "A", title: "Seating Arrangement", minutes: 25,
    tldr: "Puzzle-style questions with fixed seats. Place certain information first; the rest falls out.",
    examTag: "0-1 Qs · Round 1",
    sections: [
      { h: "Deduction order", blocks: [
        { t: "p", md: "1) Draw the seats. 2) Place **fixed** facts (A is at position 3). 3) Place **couple/pair** facts (B sits opposite A). 4) Use elimination for the rest. Never guess — every seating puzzle is fully determined by its clues if it's exam-valid." },
        { t: "p", md: "Linear: 'to the left of' means your left as you look at the same diagram — decide once whether positions run left→right from the reader's view and stay consistent. Circular facing center: left/right flip — a person facing center has **their** left = the clockwise neighbor's right side." },
      ]},
      { h: "Circular orientation rules", blocks: [
        { t: "list", items: [
          "Facing center: 'to the immediate right of X' = the next seat **counter-clockwise** from X",
          "Facing outward: left/right roles swap",
          "'Opposite' in 8 seats = 4 seats away; in 6 seats = 3 away",
          "Count seats before placing — mismatches mean you misread a clue",
        ]},
      ]},
    ],
    traps: [
      "Left-of confusion in circular arrangements (facing center vs facing out).",
      "'Immediate right' vs 'somewhere to the right' — the word 'immediate' is the whole question.",
      "Not-together ≠ opposite: 'A and B are not adjacent' still allows many seats.",
    ],
    cheat: { head: ["Case", "Left of X means"], rows: [
      ["Circle, facing center", "Clockwise neighbor side"],
      ["Circle, facing outward", "Counter-clockwise side"],
      ["Row, all facing reader", "X's own left (your right side of the diagram)"],
    ]},
    checkpoint: [
      { q: "6 people around a circle facing center. Who is opposite seat-2 person?", a: "The person at seat-5 (3 seats away in a 6-seat circle)." },
      { q: "'P is to the immediate right of Q, both facing center' — draw it: is P clockwise or counter-clockwise from Q?", a: "Counter-clockwise from Q (their right hand points that way)." },
      { q: "First placement move in any seating puzzle?", a: "Place absolutely fixed facts (definite seats), then pairs, then eliminate." },
    ],
    problemIds: [],
  },
  {
    id: "A8", domainId: "A", title: "Speed, Distance, Time", minutes: 25,
    tldr: "One formula (D = S × T) plus unit conversion plus relative speed. Trains and boats are reskins.",
    examTag: "1-2 Qs · Round 1",
    sections: [
      { h: "Core and conversion", blocks: [
        { t: "p", md: "**Distance = Speed × Time.** Units must match before anything else: km/h → m/s is **×5/18**, m/s → km/h is ×18/5. A train at 90 km/h = 25 m/s — a 150 m train passes a pole in 6 s." },
        { t: "table", head: ["Case", "Rule"], rows: [
          ["Train passes a pole/man", "Distance = train length"],
          ["Train passes a platform/bridge", "Distance = train length + platform length"],
          ["Two trains opposite directions", "Relative speed = sum"],
          ["Same direction (overtake)", "Relative speed = difference"],
          ["Boat downstream", "Speed = boat + stream"],
          ["Boat upstream", "Speed = boat − stream"],
        ]},
      ]},
      { h: "Average speed trap", blocks: [
        { t: "p", md: "Average speed for equal distances is the **harmonic mean**: 2ab/(a+b) — NOT the arithmetic mean. Going 60 km/h and returning 40 km/h averages 48 km/h, not 50. This single fact is worth a guaranteed mark." },
      ]},
    ],
    traps: [
      "Forgetting to add both lengths when a train crosses a platform or another train.",
      "Averaging speeds arithmetically across equal distances.",
      "Unit mix: seconds vs hours — convert everything to one unit family first.",
    ],
    cheat: { head: ["Concept", "Formula"], rows: [
      ["km/h → m/s", "× 5/18"],
      ["Train vs pole", "t = L_train / v"],
      ["Train vs platform", "t = (L_train + L_plat) / v"],
      ["Opposite trains", "v_rel = v1 + v2"],
      ["Overtake", "v_rel = v1 − v2"],
      ["Avg speed equal distances", "2ab/(a+b)"],
    ]},
    checkpoint: [
      { q: "Convert 72 km/h to m/s.", a: "72 × 5/18 = 20 m/s." },
      { q: "150 m train at 54 km/h passes a pole in…?", a: "54 km/h = 15 m/s → 10 s." },
      { q: "Go at 30 km/h, return at 60 km/h — average?", a: "2×30×60/90 = 40 km/h." },
    ],
    problemIds: [],
  },
  {
    id: "A9", domainId: "A", title: "Percentages, Ratios, Averages", minutes: 30,
    tldr: "The fraction-percent table and the successive-change formula solve 90% of arithmetic questions instantly.",
    examTag: "2-3 Qs · Round 1",
    sections: [
      { h: "Fraction-percent table (memorize)", blocks: [
        { t: "table", head: ["Fraction", "%", "Fraction", "%"], rows: [
          ["1/2", "50%", "1/9", "11.11%"],
          ["1/3", "33.33%", "1/11", "9.09%"],
          ["1/4", "25%", "1/12", "8.33%"],
          ["1/5", "20%", "1/8", "12.5%"],
          ["1/6", "16.67%", "1/7", "14.28%"],
          ["2/5", "40%", "3/8", "37.5%"],
        ]},
        { t: "p", md: "Knowing 1/8 = 12.5% lets you compute 'price increased by 12.5%' as **×9/8** mentally. Percentage changes are fraction multiplications: +25% then −20% is ×5/4 × 4/5 = ×1 → no net change." },
      ]},
      { h: "Successive change & ratio basics", blocks: [
        { t: "p", md: "Successive changes a% then b%: net = a + b + ab/100 (signs included). Ratios: if quantities split 2:3:5 of a total, the shares are 2k, 3k, 5k. Averages: average = sum/count; adding a new member changes both — set up the equation, don't guess." },
        { t: "callout", kind: "tip", md: "Weighted average shortcut: if group A averages a with n members and group B averages b with m members, combined = (na+mb)/(n+m). Pull toward the bigger group." },
      ]},
    ],
    traps: [
      "A +25% rise then a 25% fall does NOT return to the original (net −6.25%).",
      "Ratio of speeds = inverse ratio of times for equal distance.",
      "Percentage point vs percent: 20% → 25% is +5 points, +25% relative.",
    ],
    cheat: { head: ["Tool", "Formula"], rows: [
      ["Successive %", "a + b + ab/100"],
      ["% change", "(new−old)/old × 100"],
      ["Weighted avg", "(n₁a₁+n₂a₂)/(n₁+n₂)"],
      ["Equal-distance avg speed", "2ab/(a+b)"],
    ]},
    checkpoint: [
      { q: "Price up 20% then down 20% — net change?", a: "−4% (1.2 × 0.8 = 0.96)." },
      { q: "₹1200 split 2:3:5 — smallest share?", a: "k=120 → ₹240." },
      { q: "Class avg 70 with 30 students; adding 10 students at 90 → new avg?", a: "(2100+900)/40 = 75." },
    ],
    problemIds: [],
  },
  {
    id: "A10", domainId: "A", title: "Clocks & Calendars", minutes: 20,
    tldr: "Two formulas cover clocks; the odd-days method covers calendars. Low frequency, high predictability.",
    examTag: "0-1 Qs · Round 1",
    sections: [
      { h: "Clock angles", blocks: [
        { t: "p", md: "Minute hand: 6°/min. Hour hand: 0.5°/min (30°/hour). Angle between them at H:M: **|30H − 5.5M|**. The hands coincide 11 times in 12 hours (not 12!) and are in a straight line 11 times, opposite 11 times." },
        { t: "table", head: ["Event in 12 h", "Count"], rows: [
          ["Hands coincide", "11"],
          ["Hands opposite (180°)", "11"],
          ["Hands at right angle (90°)", "22"],
        ]},
      ]},
      { h: "Calendars by odd days", blocks: [
        { t: "p", md: "Odd days = remainder days after whole weeks. Ordinary year = 365 = 52 weeks + 1 odd day; leap year = 2 odd days. Century years divisible by 400 are leap (2000 yes, 1900 no). To find the day of a date, count odd days from a known anchor. 'Same calendar repeats' for an ordinary year when the next year shifts by 1 odd day until total ≡ 0 (mod 7)." },
      ]},
    ],
    traps: [
      "Coincidences are 11 per 12 h, not 12 — between 11 and 1 there is only one overlap (12:00).",
      "1900 is NOT a leap year; 2000 IS (divisible by 400).",
      "Angle formula gives the absolute value — questions may ask for the reflex angle.",
    ],
    cheat: { head: ["Item", "Value"], rows: [
      ["Minute hand speed", "6°/min"],
      ["Hour hand speed", "0.5°/min"],
      ["Angle at H:M", "|30H − 5.5M|"],
      ["Ordinary year odd days", "1"],
      ["Leap year odd days", "2"],
    ]},
    checkpoint: [
      { q: "Angle at 3:30?", a: "|30×3 − 5.5×30| = |90−165| = 75°." },
      { q: "Is 2100 a leap year?", a: "No — divisible by 100 but not by 400." },
      { q: "How often do hands coincide in 12 hours?", a: "11 times." },
    ],
    problemIds: [],
  },
];
