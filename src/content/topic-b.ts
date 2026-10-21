import type { Topic } from "./types";

// Domain B — PSEUDOCODE MCQ (weight 20). His strength; keep sharp, focus on traps.
export const TOPICS_B: Topic[] = [
  {
    id: "B1", domainId: "B", title: "Data Types & Operators", minutes: 30,
    tldr: "Operator precedence, integer division and %, and coercion tricks drive a third of all pseudocode MCQs.",
    examTag: "≈6 of 45 MCQs",
    sections: [
      { h: "Precedence ladder", blocks: [
        { t: "p", md: "Highest to lowest: `()` → `**` → unary `−x` → `* / // %` (left→right) → `+ −` (left→right) → comparisons → `not` → `and` → `or`. One famous wrinkle: `2**-1` parses as 2 to the power of −1 = 0.5, because `**` binds tighter than unary minus but is right-associative: `2**3**2 = 2**(3**2) = 512`." },
        { t: "code", lang: "python", src: `print(2**3**2)      # 512  (** is right-associative)\nprint(-3**2)        # -9   (** binds first, unary minus last)\nprint((-3)**2)      # 9\nprint(7//2, -7//2)  # 3 -4  (floor rounds toward negative infinity)\nprint(7%2, -7%2)    # 1  1  (result has sign of divisor)\nprint(2+3*4**2)     # 50` },
      ]},
      { h: "Division & modulo sign rules", blocks: [
        { t: "p", md: "`//` is **floor** division — it rounds toward negative infinity, so `-7//2 = -4`, not −3. `%` returns a result with the **sign of the divisor**: `-7%2 = 1` and `7%-2 = -1`. Exams love these two lines because human intuition says 'truncate' and it doesn't." },
      ]},
    ],
    traps: [
      "-3**2 = -9 (power first, then negation).",
      "-7//2 = -4 (floor toward −∞). -7%2 = 1 (sign follows divisor).",
      "True + True = 2 (bools are ints). int('12') + 1 works; '12' + 1 is TypeError.",
      "5/2 = 2.5 (true division) — / is never integer division in Python.",
    ],
    cheat: { head: ["Expr", "Result"], rows: [
      ["7//2", "3"], ["-7//2", "-4"], ["7%2", "1"], ["-7%2", "1"],
      ["2**3**2", "512"], ["10/5", "2.0"], ["True+True", "2"],
    ]},
    checkpoint: [
      { q: "print(-8//3)?", a: "-3 (floor of −2.67 is −3)." },
      { q: "print(10 - 4 * 2)?", a: "2 (multiplication first)." },
      { q: "print(1 + True)?", a: "2." },
    ],
    problemIds: [],
  },
  {
    id: "B2", domainId: "B", title: "Control Flow & Loops", minutes: 30,
    tldr: "Truthiness, for-else/while-else and range() semantics are the three classic stingers.",
    examTag: "≈5 of 45 MCQs",
    sections: [
      { h: "Truthiness", blocks: [
        { t: "p", md: "Falsy values: `0, 0.0, '', [], {}, set(), None, False`. Everything else is truthy — including `'False'`, `[0]`, and -1. `if arr:` on an empty list correctly skips the block; this idiom appears in real exam pseudocode constantly." },
      ]},
      { h: "range() and loop-else", blocks: [
        { t: "p", md: "`range(2,10,3)` yields 2, 5, 8 — stop is exclusive, step applies from start. The stinger: **for-else** runs the else block only when the loop finished **without break**. This is used to search: loop finds item → break → else skipped; item missing → else prints 'not found'." },
        { t: "code", lang: "python", src: `for i in range(2, 10, 3):\n    print(i, end=" ")   # 2 5 8\n\nfor x in [1, 2, 3]:\n    if x == 5:\n        break\nelse:\n    print("not found")  # prints: loop ended without break` },
        { t: "callout", kind: "trap", md: "for-else: the else belongs to the LOOP, not to the if. It fires when no break happened. If you see else under a for/while in exam pseudocode, ask one question only: did any iteration break?" },
      ]},
    ],
    traps: [
      "range(5) gives 0..4 — never 5.",
      "for-else fires when loop completes without break.",
      "while with a condition that never changes → infinite loop questions ask 'how many times printed' = infinite.",
      "continue skips the rest of the current iteration only; break exits the loop.",
    ],
    cheat: { head: ["Construct", "Meaning"], rows: [
      ["range(a,b,s)", "a, a+s, … < b"],
      ["for…else", "else runs if no break"],
      ["while…else", "same rule as for…else"],
      ["pass", "no-op placeholder"],
      ["continue", "next iteration"],
    ]},
    checkpoint: [
      { q: "for i in range(3): print(i) — output?", a: "0 1 2." },
      { q: "When does for-else's else NOT run?", a: "When a break executed inside the loop." },
      { q: "if []: — truthy or falsy?", a: "Falsy — empty list." },
    ],
    problemIds: [],
  },
  {
    id: "B3", domainId: "B", title: "Strings & Slicing", minutes: 30,
    tldr: "Slicing with negative steps, immutability and the join/split pair — the most repeated pseudocode topic.",
    examTag: "≈6 of 45 MCQs",
    sections: [
      { h: "Slicing semantics", blocks: [
        { t: "p", md: "`s[start:stop:step]` — stop is exclusive, defaults fill the gaps, and negative step walks backwards. `s[::-1]` reverses. `s[1:5:2]` takes indices 1 and 3. Out-of-range slices never raise errors (they truncate) — but single-index access `s[20]` on a short string raises IndexError. Exams exploit both asymmetries." },
        { t: "code", lang: "python", src: `s = "SNIPER"\nprint(s[::-1])    # REPINS\nprint(s[1:4])     # NIP\nprint(s[::2])     # SIE\nprint(s[4:1:-1])  # EPI  (walks backwards from 4 down to 2)\nprint(s[10:])     # ""   (no error, empty)` },
      ]},
      { h: "Immutability & methods", blocks: [
        { t: "p", md: "Strings never change in place — every 'modification' returns a new string. `s.upper()` does nothing unless you assign it. Methods tested: `upper, lower, strip, split, join, replace, find, count, startswith`. `split()` with no argument splits on any whitespace; `\"-\".join(list)` glues with a separator. `find` returns −1 when missing (vs `index` which raises)." },
        { t: "callout", kind: "trap", md: "s.replace('A','B') without assignment = the exam's favorite one-liner trap. The printed string is unchanged. Immutability is not a detail — it is the whole question." },
      ]},
    ],
    traps: [
      "s[::-1] reverses; s[-1] is the last character.",
      "Slice out-of-range is fine; index out-of-range errors.",
      "Methods return NEW strings — no assignment = no change.",
      "'A' + 'B' concatenates; 'A' * 3 = 'AAA'; 'A' + 3 is an error.",
    ],
    cheat: { head: ["Expr", "Result (s='SNIPER')"], rows: [
      ["s[::-1]", "REPINS"], ["s[1:4]", "NIP"], ["s[-2:]", "ER"],
      ["s.count('S')", "1"], ["len(s)", "6"],
    ]},
    checkpoint: [
      { q: "'hello'[1:4]?", a: "'ell'." },
      { q: "abc = 'Hi'; abc.upper(); print(abc) — prints what?", a: "'Hi' — immutability, result was discarded." },
      { q: "Difference between find() and index() on a miss?", a: "find → −1; index → ValueError." },
    ],
    problemIds: [],
  },
  {
    id: "B4", domainId: "B", title: "Lists, Tuples, Sets, Dicts", minutes: 35,
    tldr: "Aliasing, append vs extend, set dedupe and dict counting — the highest-frequency MCQ cluster after strings.",
    examTag: "≈6 of 45 MCQs",
    sections: [
      { h: "Aliasing vs copying", blocks: [
        { t: "p", md: "`b = a` copies the **reference**, not the list: appending to b changes a. `b = a[:]` or `b = list(a)` or `b = a.copy()` makes a shallow copy — enough for flat lists. Nested structures still share inner lists (deep copy exists but exams rarely go there)." },
        { t: "code", lang: "python", src: `a = [1, 2, 3]\nb = a\nb.append(4)\nprint(a)          # [1, 2, 3, 4]  ← changed!\n\nc = a[:]\nc.append(5)\nprint(a)          # [1, 2, 3, 4]  ← safe` },
      ]},
      { h: "The four containers at a glance", blocks: [
        { t: "table", head: ["Type", "Ordered", "Mutable", "Dupes", "Killer detail"], rows: [
          ["list  [ ]", "yes", "yes", "yes", "append vs extend; pop(i) vs remove(x)"],
          ["tuple ( )", "yes", "NO", "yes", "unpacking; single-element needs (1,)"],
          ["set  { }", "no", "yes", "no", "dedupe; add vs update; no indexing"],
          ["dict {k:v}", "insertion", "yes", "keys unique", "d[k] raises if missing; .get(d, default) safe"],
        ]},
        { t: "p", md: "Counting pattern without imports (appears verbatim in exam pseudocode): `d = {}` → `for x in s: d[x] = d.get(x, 0) + 1`. Sets dedupe instantly: `len(set([1,1,2])) = 2`." },
      ]},
    ],
    traps: [
      "b = a aliases; mutating b mutates a.",
      "extend([4,5]) adds two items; append([4,5]) adds ONE list item.",
      "list.remove(x) removes first VALUE; pop() removes last INDEX and returns it.",
      "set({1,1,2,2,3}) → {1,2,3}; len counts unique.",
      "dict[key] on missing key errors; dict.get(key, 0) doesn't.",
      "(1) is int 1; (1,) is a tuple.",
    ],
    cheat: { head: ["Expr", "Result"], rows: [
      ["[1,2]+[3]", "[1,2,3]"], ["[1,2]*2", "[1,2,1,2]"],
      ["list(range(3))", "[0,1,2]"], ["sorted([3,1,2])", "[1,2,3]"],
      ["set('ab')", "{'a','b'}"],
    ]},
    checkpoint: [
      { q: "a=[1,2]; b=a; b+=[3]. print(a)?", a: "[1,2,3] — same object." },
      { q: "len(set([1,1,2,3,3]))?", a: "3." },
      { q: "d={}; d.get('x', 5)?", a: "5 (no error, key not added)." },
    ],
    problemIds: ["lc-217"],
  },
  {
    id: "B5", domainId: "B", title: "Functions & Scope", minutes: 25,
    tldr: "return vs print, mutable default arguments, and the global keyword — small topic, reliable marks.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "return vs print", blocks: [
        { t: "p", md: "`return` hands a value back to the caller; `print` only displays. A function with no return gives **None**. The classic exam line: `def f(): print(5)` then `x = f()` prints 5 and stores None — printing x afterwards shows None." },
      ]},
      { h: "Defaults & scope", blocks: [
        { t: "p", md: "Default arguments are evaluated **once** at definition time — a mutable default (like `def f(x, acc=[])`) persists between calls and accumulates. Inside a function, assigning to a name makes it local unless `global` is declared. Parameters are local names too. LEGB lookup: Local → Enclosing → Global → Built-in." },
        { t: "code", lang: "python", src: `def add(x, acc=[]):     # danger: shared default list\n    acc.append(x)\n    return acc\nprint(add(1))   # [1]\nprint(add(2))   # [1, 2]  ← persists!\n\ncount = 0\ndef bump():\n    global count\n    count += 1          # without global → UnboundLocalError` },
      ]},
    ],
    traps: [
      "No return → None; return with no value → None.",
      "Mutable default argument keeps state across calls.",
      "Assigning inside a function shadows the global name unless declared global.",
      "*args collects extra positional args into a tuple; **kwargs into a dict.",
    ],
    cheat: { head: ["Construct", "Behavior"], rows: [
      ["def f(): …(no return)", "returns None"],
      ["def f(a=[]) ", "shared mutable default"],
      ["global x", "write to module-level x"],
      ["f(*args, **kwargs)", "tuple + dict passthrough"],
    ]},
    checkpoint: [
      { q: "def f(): return; x=f(); print(x)?", a: "None." },
      { q: "Why does def f(x, acc=[]) accumulate across calls?", a: "Default evaluated once at definition; the same list object is reused." },
      { q: "def g(): n=n+1 with global n — fine or error?", a: "Fine — global declared. Without it: UnboundLocalError." },
    ],
    problemIds: [],
  },
  {
    id: "B6", domainId: "B", title: "Recursion Tracing", minutes: 30,
    tldr: "Exams show a recursive function and ask for the output or call count. The call-stack diagram on paper is the whole method.",
    examTag: "≈4 of 45 MCQs",
    sections: [
      { h: "Draw the stack, always", blocks: [
        { t: "p", md: "For every recursive question, write one column per call: f(4) → f(3) → f(2) → f(1), annotate returns on the way back up. Never trace recursion in your head. Base case first: identify what stops the recursion; missing base case = RecursionError (and the exam asks exactly that as an option)." },
        { t: "code", lang: "python", src: `def fact(n):\n    if n <= 1: return 1\n    return n * fact(n-1)\n\n# fact(4) = 4 * fact(3) = 4*3*fact(2) = 4*3*2*fact(1) = 24\n# stack depth: 4 calls` },
        { t: "p", md: "Fibonacci costs: fib(5) makes 15 calls total (it recomputes fib(3) twice, fib(2) three times). Exams ask 'how many calls' or 'how many times is f(3) computed' — count on the tree you draw, branching 2-way per non-base call." },
      ]},
      { h: "Two exam-standard shapes", blocks: [
        { t: "list", items: [
          "Head recursion: work after the call → prints ascending (1,2,3)",
          "Tail position: work before the call → prints descending (3,2,1)",
          "def f(n): if n==0: return; print(n); f(n-1) → 3 2 1",
          "def f(n): if n==0: return; f(n-1); print(n) → 1 2 3",
        ]},
      ]},
    ],
    traps: [
      "Missing base case → RecursionError: maximum recursion depth exceeded.",
      "Print-before-call vs print-after-call flips the output order.",
      "Return value ignored: calling f(n-1) without using its result still executes it.",
    ],
    cheat: { head: ["Shape", "Output for f(3)"], rows: [
      ["print then recurse", "3 2 1"],
      ["recurse then print", "1 2 3"],
      ["fact(5)", "120"], ["fib recursive cost(n=5)", "15 calls"],
    ]},
    checkpoint: [
      { q: "def f(n): if n==0: return; f(n-1); print(n) — f(3) output?", a: "1 2 3." },
      { q: "fact(0) with base n<=1 returns?", a: "1." },
      { q: "What error does a missing base case raise?", a: "RecursionError (maximum recursion depth exceeded)." },
    ],
    problemIds: ["site-fib", "site-fact"],
  },
  {
    id: "B7", domainId: "B", title: "Bitwise Operations", minutes: 25,
    tldr: "Shifts are ×2/÷2; XOR kills duplicates. Four facts answer every bit MCQ ever set.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The four facts", blocks: [
        { t: "list", items: [
          "x << 1 doubles x; x >> 1 halves it (floor). 5<<2 = 20.",
          "x & 1 is 1 when x is odd (parity check).",
          "x & (x-1) clears the lowest set bit → equals 0 exactly when x is a power of two.",
          "x ^ x = 0 and x ^ 0 = x → XOR-ing a list where everything appears twice leaves the unique one.",
        ]},
        { t: "code", lang: "python", src: `print(5 << 2)         # 20\nprint(20 >> 1)        # 10\nprint(7 & 1, 8 & 1)   # 1 0\nprint(8 & 7)          # 0 → 8 is a power of two\nprint(1^2^3^2^1)      # 3  (the unique number)` },
      ]},
      { h: "Masking and NOT", blocks: [
        { t: "p", md: "`x | mask` sets bits, `x & ~mask` clears them. `~x = -x-1` in Python (two's complement): ~5 = −6. OR of a number with itself is itself; AND of a number with its complement is 0. Exams test ~ and ^ more than & and | because they're less intuitive." },
      ]},
    ],
    traps: [
      "~x = -x - 1, not just negation.",
      "x << n overflows nothing in Python (arbitrary precision) but exams may show C-style fixed width.",
      "^ is XOR in Python, NOT exponent (that's **).",
      "Odd/even test is x & 1, not x % 1.",
    ],
    cheat: { head: ["Expr", "Result"], rows: [
      ["5 << 2", "20"], ["20 >> 2", "5"], ["x & 1", "parity"],
      ["x & (x-1) == 0", "x is power of 2"], ["x ^ x", "0"], ["~5", "-6"],
    ]},
    checkpoint: [
      { q: "6 << 3?", a: "48." },
      { q: "Fastest check that n is a power of two?", a: "n > 0 and n & (n-1) == 0." },
      { q: "[4,1,2,1,2] XOR-folded gives?", a: "4." },
    ],
    problemIds: ["lc-136", "lc-231"],
  },
  {
    id: "B8", domainId: "B", title: "Operator Tricks: is, and/or, Ternary", minutes: 25,
    tldr: "Short-circuit and/or return OPERANDS not booleans; is tests identity; chained comparisons parse left-to-right.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "and/or return operands", blocks: [
        { t: "p", md: "`x and y` → y if x is truthy else x. `x or y` → x if x is truthy else y. So `0 or 'hi'` = 'hi', `3 and 5` = 5, `[] or {}` = {}. This is why `value = arg or 'default'` works as a fallback idiom — and why the exam can ask 'what type is the result' with confusing options." },
        { t: "code", lang: "python", src: `print(3 and 5)      # 5\nprint(0 and 5)      # 0\nprint(0 or 'x')     # 'x'\nprint(1 < 2 < 3)    # True (chained: 1<2 and 2<3)\nprint(1 == 1 == 2)  # False\nx = 7\nprint('big' if x > 5 else 'small')  # big` },
      ]},
      { h: "is vs ==", blocks: [
        { t: "p", md: "`==` compares values; `is` compares identity (same object in memory). Small ints (−5…256) are interned, so `a=100; b=100; a is b` is True in CPython — but `a=1000; b=1000; a is b` may be False. Exams test exactly this boundary. Rule for real code: `is` only for None." },
      ]},
    ],
    traps: [
      "'or' returns the first TRUTHY operand, not True itself.",
      "Chained comparison a < b < c means a < b and b < c (b evaluated once).",
      "is with big ints is implementation-dependent — 'False' is the safe exam answer.",
      "not has lower precedence than comparison: not x == y means not (x == y).",
    ],
    cheat: { head: ["Expr", "Value"], rows: [
      ["3 and 5", "5"], ["0 or 'x'", "'x'"], ["not 5 == 5", "False"],
      ["[] and 'x'", "[]"], ["2 if 1>0 else 3", "2"],
    ]},
    checkpoint: [
      { q: "print(0 or 5)?", a: "5." },
      { q: "print([] and 5)?", a: "[] (first falsy operand)." },
      { q: "a=1000; b=1000; a is b — guaranteed True?", a: "No — identity of large ints isn't guaranteed; == is True." },
    ],
    problemIds: [],
  },
  {
    id: "B9", domainId: "B", title: "Output Tracing Method", minutes: 30,
    tldr: "The 30-second hand-trace protocol: a variable table, line by line. This is the meta-skill for the whole domain.",
    examTag: "applies to ~15 of 45 MCQs",
    sections: [
      { h: "The 30-second hand-trace", blocks: [
        { t: "p", md: "Draw a table: one column per variable, one row per line executed. Update EVERY variable as each line runs — no mental math, no shortcuts. Where you'd 'skip obvious lines' is exactly where exams hide the trap. 30 seconds of table beats 3 minutes of staring." },
        { t: "callout", kind: "memo", md: "Rule (yours, verbatim): trace on paper, line by line, updating every variable. Tracing in your head loses state — and the exam counts on you losing it." },
      ]},
      { h: "Trace discipline", blocks: [
        { t: "list", items: [
          "Number the lines first; execute in order, jumping for loops/calls.",
          "For loops: one row per ITERATION, not per loop.",
          "For functions: separate mini-table, return value written at the bottom.",
          "Print statements: write output on the side, in order, as they execute.",
          "Cross off consumed values — prevents reusing stale ones.",
        ]},
        { t: "code", lang: "python", src: `x, y = 2, 3\nfor i in range(3):\n    x += i\n    y -= x\n# trace:\n# i=0: x=2  y=1\n# i=1: x=3  y=-2\n# i=2: x=5  y=-7   → print(x*y) = -35` },
      ]},
    ],
    traps: [
      "Reusing a stale variable value after it changed mid-loop.",
      "Forgetting print happens at its exact moment in the trace order.",
      "Off-by-one on loop bounds: the final iteration is where the marks are.",
    ],
    cheat: { head: ["Step", "Action"], rows: [
      ["1", "Number every line"],
      ["2", "Variable table, one row per executed line"],
      ["3", "Update all variables, every line"],
      ["4", "Collect prints in execution order"],
    ]},
    checkpoint: [
      { q: "Why one table row per iteration, not per loop?", a: "Loop variables change per iteration; a single row hides the state you need." },
      { q: "What do you do with a function call mid-trace?", a: "Pause, run a separate mini-trace, write its return value back into the main table." },
      { q: "Your rule for the final 30 seconds before submitting ANY exam code?", a: "Hand-trace the smallest input ([-2, 1]) on paper before submitting." },
    ],
    problemIds: [],
  },
  {
    id: "B10", domainId: "B", title: "Loop Counting Patterns", minutes: 30,
    tldr: "'How many times does the print execute?' — triangular sums, break/continue effects and counter placement.",
    examTag: "≈4 of 45 MCQs",
    sections: [
      { h: "Nested loop totals", blocks: [
        { t: "p", md: "Inner-loop counting: for `for i in range(n): for j in range(i): print()` the total is **n(n−1)/2** — the triangular number 3+2+1=6 for n=4 (your exact Day-1 miss on P10). For `range(n-i)` patterns it's the other triangle: n(n+1)/2. When bounds are non-triangular, count row by row and add — five rows is five seconds with the table method." },
        { t: "code", lang: "python", src: `c = 0\nfor i in range(4):\n    for j in range(i):\n        c += 1\nprint(c)   # 0+1+2+3 = 6\n\n# i from 1..4, j from i..4 → 4+3+2+1 = 10 (other triangle)` },
      ]},
      { h: "Counter placement vs break/continue", blocks: [
        { t: "p", md: "A counter AFTER a `continue` doesn't count skipped iterations; a counter before it does. After a `break`, nothing in that iteration counts. The exam moves one line across the continue/break and asks for the new total — re-trace with the table rather than reasoning abstractly." },
      ]},
    ],
    traps: [
      "range(i) runs i times only when i > 0 — range(0) runs zero times.",
      "Counter placed after continue → undercounts; before → counts all.",
      "Total print count vs total loop-iteration count differ when prints are conditional.",
      "Outer-loop var used in inner bounds — recompute per row, never guess a formula.",
    ],
    cheat: { head: ["Pattern", "Total iterations"], rows: [
      ["Σ range(i), i=0..n-1", "n(n−1)/2"],
      ["Σ range(n−i), i=0..n-1", "n(n+1)/2"],
      ["n × m full nested", "n·m"],
      ["while with break at k-th item", "k iterations"],
    ]},
    checkpoint: [
      { q: "for i in range(5): for j in range(i): print('*') — how many stars?", a: "0+1+2+3+4 = 10." },
      { q: "for i in range(4): for j in range(4-i): print() — how many?", a: "4+3+2+1 = 10." },
      { q: "Where must a counter sit to count iterations skipped by continue?", a: "Before the continue statement." },
    ],
    problemIds: [],
  },
];
