import type { Topic } from "./types";

// Domain C — PYTHON DSA (weight 22). The weakest flank: baseline 25%.
export const TOPICS_C: Topic[] = [
  {
    id: "C1", domainId: "C", title: "Python I/O Survival Kit", minutes: 25,
    tldr: "Every coding question starts with reading input. These five templates are non-negotiable muscle memory — your Day-1 score died here, not in the algorithm.",
    examTag: "Foundation for 1 of 3 coding Qs",
    sections: [
      { h: "The five templates", blocks: [
        { t: "code", lang: "python", src: `# 1. single integer\nn = int(input())\n\n# 2. one line of integers → list\narr = list(map(int, input().split()))\n\n# 3. n lines, one integer each\nn = int(input())\nvals = [int(input()) for _ in range(n)]\n\n# 4. n lines, each a list of ints\nn = int(input())\ngrid = [list(map(int, input().split())) for _ in range(n)]\n\n# 5. one string + one list\ns = input()\narr = list(map(int, input().split()))` },
        { t: "callout", kind: "memo", md: "map() returns the recipe, not the dish — list() puts it in the pan. A bare map object prints as 'map object at 0x…' and iterates only once. Your Day-1 I/O score of 2/5 was exactly this." },
      ]},
      { h: "Output patterns", blocks: [
        { t: "p", md: "Print a list space-separated: `print(*arr)` — the star unpacks. Print a computed list directly: `print([x*x for x in arr])`. Join strings: `\" \".join(parts)`. Newline-separated output: loop and print each. End=\" \" keeps output on one line when the expected format demands it." },
        { t: "code", lang: "python", src: `arr = [1, 2, 3]\nprint(*arr)                    # 1 2 3\nprint([x**2 for x in arr])     # [1, 4, 9]\nprint(" ".join(str(x) for x in arr))  # 1 2 3` },
      ]},
      { h: "Naming law (your bug list, verbatim)", blocks: [
        { t: "callout", kind: "trap", md: "Never name a variable sum, max, min, input, list, str, len — it shadows the builtin and every later call explodes. Your Day-1 bugs: forgetting list() around map(); writing range(arr) instead of range(len(arr)); using += i (index) instead of += x (value) in for-loops. These are fixed habits now — keep them fixed." },
        { t: "list", items: [
          "for x in arr: iterates VALUES (what you want 90% of the time)",
          "for i in range(len(arr)): iterates INDICES (only when you need position)",
          "range(arr) is always wrong — range wants an int",
        ]},
      ]},
    ],
    traps: [
      "print(map(...)) prints an object, not values — wrap in list() or unpack with *.",
      "input() always returns a string: int(input()) or split before math.",
      "Variable named max/sum shadows the builtin for the REST of the program.",
    ],
    cheat: { head: ["Need", "Template"], rows: [
      ["One int", "n = int(input())"],
      ["Int list", "arr = list(map(int, input().split()))"],
      ["Space-separated out", "print(*arr)"],
      ["List out", "print([...for x in arr])"],
      ["String join", "\" \".join(map(str, arr))"],
    ]},
    checkpoint: [
      { q: "Why did print(map(int, input().split())) fail your Day-1 test?", a: "map returns a lazy map object — no values, no output. list() materializes it." },
      { q: "Template to read a line '16 17 4 3 5 2' into a list of ints?", a: "arr = list(map(int, input().split()))" },
      { q: "for x in arr vs for i in range(len(arr)) — which gives values?", a: "for x in arr gives values directly; the range form gives indices." },
    ],
    problemIds: ["lc-412"],
  },
  {
    id: "C2", domainId: "C", title: "Arrays & Two Pointers", minutes: 35,
    tldr: "Two pointers converge from both ends or read/write in place. The pattern behind ~8 of your 45 problems.",
    examTag: "1 of 3 coding Qs",
    sections: [
      { h: "Converging pointers", blocks: [
        { t: "p", md: "On a **sorted** array, start `l, r = 0, len(arr)-1`. Too big → move r left; too small → move l right. Works for pair-sum, palindrome checks, container/squares problems. The sorted precondition is what makes skipping one endpoint safe." },
        { t: "code", lang: "python", src: `# Two Sum II (sorted) — lc-167\narr = list(map(int, input().split()))\ntarget = int(input())\nl, r = 0, len(arr) - 1\nwhile l < r:\n    s = arr[l] + arr[r]\n    if s == target:\n        print(l + 1, r + 1)\n        break\n    elif s < target:\n        l += 1\n    else:\n        r -= 1` },
      ]},
      { h: "Read/write pointers (in-place)", blocks: [
        { t: "p", md: "One pointer scans, one tracks where the next 'kept' element goes. Move Zeroes: write pointer only advances on non-zero, then fill the tail with zeros. Remove Duplicates: keep if `arr[i] != arr[i-1]`. This family mutates in place and returns counts — read the problem's return contract carefully." },
        { t: "code", lang: "python", src: `# Move Zeroes — lc-283\narr = list(map(int, input().split()))\nw = 0\nfor x in arr:\n    if x != 0:\n        arr[w] = x\n        w += 1\nwhile w < len(arr):\n    arr[w] = 0\n    w += 1\nprint(*arr)` },
      ]},
    ],
    traps: [
      "Two pointers on an UNSORTED array is invalid — sort first or switch to a hashmap.",
      "while l < r vs while l <= r: meeting-point questions differ by one iteration.",
      "In-place problems want the modified array AND a count — return what's asked.",
    ],
    cheat: { head: ["Situation", "Move"], rows: [
      ["sum < target", "l += 1"],
      ["sum > target", "r -= 1"],
      ["sum == target", "answer / break"],
      ["Palindrome check", "compare arr[l], arr[r] then l+=1, r-=1"],
    ]},
    checkpoint: [
      { q: "Why does two-pointer pair-sum need sorted input?", a: "Moving l or r must provably discard candidates — only sorted order guarantees that." },
      { q: "Move Zeroes: what does the write pointer track?", a: "Where the next non-zero element belongs." },
      { q: "Palindrome with two pointers on 'racecar'?", a: "l=0/r=6 compare 'r'='r' … all match → palindrome." },
    ],
    problemIds: ["lc-1", "lc-283", "lc-26", "lc-88", "lc-167", "lc-977"],
  },
  {
    id: "C3", domainId: "C", title: "Kadane & Prefix Sums", minutes: 35,
    tldr: "Your Day-1 redemption problem. Max subarray sum in O(n) — template memorized, edge cases drilled, closed.",
    examTag: "1 of 3 coding Qs",
    sections: [
      { h: "The Kadane template (locked in)", blocks: [
        { t: "p", md: "Walk the array keeping a running sum that **resets to 0 when it goes negative** (a negative prefix can only hurt). Track the best seen. This is the exact template you fixed through three iterations on Day 1." },
        { t: "code", lang: "python", src: `# Maximum Subarray — lc-53\narr = list(map(int, input().split()))\nrsum = 0\nmaxi = float('-inf')\nfor x in arr:\n    rsum = max(rsum + x, 0)   # drop a negative prefix\n    maxi = max(maxi, rsum)    # rsum>0 here unless all-req\n# all-negative arrays: answer is the largest single element\nif maxi <= 0:\n    maxi = max(arr)\nprint(maxi)` },
        { t: "callout", kind: "trap", md: "Initialization matters: rsum starts 0, maxi starts −∞. If every element is negative ([-3,-1,-2]) the reset-to-0 version reports 0 — wrong; the true answer is −1 (best single element). Handle the all-negative case explicitly." },
      ]},
      { h: "Prefix sums", blocks: [
        { t: "p", md: "prefix[i] = sum of first i elements. Range sum of [l..r] = prefix[r+1] − prefix[l]. Build in O(n), answer any range in O(1). Stock profit (lc-121) is Kadane in disguise: track min-so-far, best = max(best, price − min)." },
        { t: "code", lang: "python", src: `# Best Time to Buy & Sell Stock — lc-121\nprices = list(map(int, input().split()))\nlo = float('inf')\nbest = 0\nfor p in prices:\n    lo = min(lo, p)\n    best = max(best, p - lo)\nprint(best)` },
      ]},
    ],
    traps: [
      "All-negative input → answer is max(arr), not 0.",
      "rsum must reset to 0, not to x — resetting to x breaks when x extends a positive run.",
      "Don't name variables sum/max (shadowing) — the bug you already made once.",
    ],
    cheat: { head: ["Line", "Why"], rows: [
      ["rsum = max(rsum+x, 0)", "drop harmful prefix"],
      ["maxi = max(maxi, rsum)", "record best"],
      ["init maxi=-inf", "handles negatives"],
      ["lc-121: best=p-lo, lo=min(lo,p)", "Kadane on price deltas"],
    ]},
    mnemonic: "Kadane = 'running sum that's allowed to quit'. If it goes negative, it quits at 0 and starts over. maxi keeps the champion.",
    checkpoint: [
      { q: "Kadane on [-2, 1, -3, 4]?", a: "rsum: 0,1,0,4 → maxi = 4 (subarray [4])." },
      { q: "Why maxi = float('-inf') and not 0?", a: "All-negative arrays then report the best single element, not 0." },
      { q: "lc-121's Kadane translation?", a: "Best = max over days of (price − min price before it)." },
    ],
    problemIds: ["lc-53", "lc-121", "lc-643"],
  },
  {
    id: "C4", domainId: "C", title: "Sliding Window", minutes: 35,
    tldr: "Fixed or growing window with a shrink condition. Arrays/strings, contiguous, O(n) — 'subarray' in the statement is the trigger word.",
    examTag: "1 of 3 coding Qs",
    sections: [
      { h: "Fixed-size window", blocks: [
        { t: "p", md: "Sum the first k elements, then slide: subtract the leaving element, add the entering one. No re-summing — that's the entire trick. Max-sum-subarray-of-size-K is the canonical drill." },
        { t: "code", lang: "python", src: `# Max sum subarray of size K\narr = list(map(int, input().split()))\nk = int(input())\nwindow = sum(arr[:k])\nbest = window\nfor i in range(k, len(arr)):\n    window += arr[i] - arr[i-k]\n    best = max(best, window)\nprint(best)` },
      ]},
      { h: "Variable-size window", blocks: [
        { t: "p", md: "Grow r one step at a time; while the window breaks the constraint, shrink from l. Minimum-size-subarray-sum: while window sum ≥ target, record length then shrink. Longest-substring-without-repeat: while the new char is already in the window, shrink past its last occurrence. The invariant 'window is valid when we record the answer' is what you must protect." },
        { t: "code", lang: "python", src: `# Longest substring without repeating chars — lc-3\ns = input()\nseen = set()\nl = best = 0\nfor r, ch in enumerate(s):\n    while ch in seen:\n        seen.remove(s[l])\n        l += 1\n    seen.add(ch)\n    best = max(best, r - l + 1)\nprint(best)` },
      ]},
    ],
    traps: [
      "Record the answer INSIDE the valid state — before shrinking (min) or after adding (max).",
      "l never moves backwards in a window; if it does, the algorithm is wrong.",
      "Negative numbers break min-size-subarray-sum monotonicity — exam won't ask that variant; don't panic.",
    ],
    cheat: { head: ["Type", "Loop shape"], rows: [
      ["Fixed k", "slide: add arr[i], drop arr[i-k]"],
      ["Min length", "while valid: record, then l += 1"],
      ["Longest / no-repeat", "while invalid: shrink l, then record r-l+1"],
    ]},
    checkpoint: [
      { q: "Trigger word in the statement that screams sliding window?", a: "'Subarray' or 'substring' (contiguous) with a max/min length or sum constraint." },
      { q: "Max sum size-k on [2,1,5,1,3,2], k=3?", a: "8 (window [5,1,3] → 5+1+3=9? compute: 2+1+5=8, 1+5+1=7, 5+1+3=9, 1+3+2=6 → answer 9)." },
      { q: "Why is l never decremented?", a: "Each element enters/leaves once; moving back would reprocess and break O(n)." },
    ],
    problemIds: ["site-sw-k", "lc-3", "lc-209", "lc-643"],
  },
  {
    id: "C5", domainId: "C", title: "Hashmaps & Sets", minutes: 30,
    tldr: "The dict-count and seen-set idioms turn O(n²) scans into O(n). Two Sum, anagrams, duplicates, intersections.",
    examTag: "MCQ + powers your DSA Q",
    sections: [
      { h: "Count and membership idioms", blocks: [
        { t: "code", lang: "python", src: `# frequency count (no imports)\ncounts = {}\nfor x in arr:\n    counts[x] = counts.get(x, 0) + 1\n\n# seen-set one-pass Two Sum — lc-1\nseen = {}\nfor i, x in enumerate(arr):\n    if target - x in seen:\n        print(seen[target - x], i)\n        break\n    seen[x] = i` },
        { t: "p", md: "`in` on a dict/set is O(1) average — that single fact is why hash solutions beat nested loops. Anagram check: sorted(a) == sorted(b) (O(n log n)) or equal frequency dicts (O(n)). Both appear in exams; the dict version shows more understanding." },
      ]},
      { h: "Pattern table", blocks: [
        { t: "table", head: ["Problem smell", "Tool"], rows: [
          ["Seen before?", "set membership"],
          ["Count occurrences", "dict.get(x,0)+1"],
          ["Find complement (target−x)", "dict of value→index"],
          ["Group variants of same letters", "dict of sorted-string→list"],
          ["First unique char", "count dict, second scan"],
        ]},
      ]},
    ],
    traps: [
      "dict[key] on a missing key raises KeyError — use .get(key, default).",
      "Sets have no order and no indexing: set[0] is invalid.",
      "Keys must be immutable — lists can't be dict keys; tuples can.",
    ],
    cheat: { head: ["Idiom", "Code"], rows: [
      ["Count", "d[x] = d.get(x,0)+1"],
      ["Seen", "if x in seen: …"],
      ["Complement", "if t−x in seen: …"],
      ["Anagram", "sorted(a)==sorted(b)"],
    ]},
    checkpoint: [
      { q: "One-pass Two Sum stores what in the dict?", a: "value → index of values seen so far; look up target−x before inserting." },
      { q: "Why is dict membership O(1)?", a: "Hash table: key hashes to a bucket directly." },
      { q: "Group anagrams' dict key?", a: "The sorted word ('eat','tea' → 'aet')." },
    ],
    problemIds: ["lc-1", "lc-217", "lc-242", "lc-349", "lc-205", "lc-49"],
  },
  {
    id: "C6", domainId: "C", title: "String Patterns", minutes: 30,
    tldr: "Palindrome two-pointer, build-and-join, char class checks. Strings are arrays with a syllabus of their own.",
    examTag: "powers your DSA Q",
    sections: [
      { h: "Core recipes", blocks: [
        { t: "code", lang: "python", src: `# Valid Palindrome (ignore non-alnum) — lc-125\nclean = [c.lower() for c in s if c.isalnum()]\nprint(clean == clean[::-1])\n\n# Reverse words III — lc-557\nprint(" ".join(w[::-1] for w in s.split()))\n\n# First unique char — lc-387\ncounts = {}\nfor c in s: counts[c] = counts.get(c, 0) + 1\nfor i, c in enumerate(s):\n    if counts[c] == 1: print(i); break\nelse: print(-1)` },
        { t: "p", md: "Char-class helpers the exam assumes you know: `isdigit()`, `isalpha()`, `isalnum()`, `lower()`, `split()` (splits on whitespace runs), `join`. Strings are immutable — building large strings in a loop with += is O(n²); accumulate a list and join at the end." },
      ]},
      { h: "Roman numerals & digit tricks", blocks: [
        { t: "p", md: "Roman to Integer: walk left to right; if current value < next value, subtract it, else add. Palindrome Number without strings: reverse the digits with `% 10` and `// 10` and compare. These two appear in almost every exam bank in some costume." },
      ]},
    ],
    traps: [
      "s[i] is a char, never changeable in place — rebuild strings instead.",
      "' ' vs '' in split: split() collapses whitespace, split(' ') keeps empties.",
      "isalnum() excludes spaces — the palindrome cleanup depends on it.",
    ],
    cheat: { head: ["Need", "Recipe"], rows: [
      ["Reverse string", "s[::-1]"],
      ["Reverse each word", "\" \".join(w[::-1] for w in s.split())"],
      ["Cleanup alnum", "[c.lower() for c in s if c.isalnum()]"],
      ["Digits of n", "n % 10 then n //= 10"],
    ]},
    checkpoint: [
      { q: "Reverse each word of 'sniper mode on'?", a: "'repins edom no'." },
      { q: "Roman 'MCMXCIV' value?", a: "1000 + (1000−100) + (100−10) + 5−1 = 1994." },
      { q: "Why build strings via list + join?", a: "String += in a loop is O(n²); join is O(n)." },
    ],
    problemIds: ["lc-125", "lc-344", "lc-557", "lc-14", "lc-13", "lc-9", "lc-387"],
  },
  {
    id: "C7", domainId: "C", title: "Binary Search Family", minutes: 35,
    tldr: "One template, three biases. Sorted input is the trigger; off-by-one discipline is the skill.",
    examTag: "1 of 3 coding Qs candidate",
    sections: [
      { h: "The template", blocks: [
        { t: "code", lang: "python", src: `# Binary Search — lc-704\narr = list(map(int, input().split()))\ntarget = int(input())\nlo, hi = 0, len(arr) - 1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n        print(mid); break\n    elif arr[mid] < target:\n        lo = mid + 1\n    else:\n        hi = mid - 1\nelse:\n    print(-1)   # for-else: no break → not found` },
        { t: "p", md: "The invariants that keep it correct: `lo = mid + 1` and `hi = mid − 1` (never just mid — infinite loop), and `mid = (lo+hi)//2` computed fresh each iteration. Search Insert Position is the same loop returning `lo` on failure." },
      ]},
      { h: "First/last occurrence biasing", blocks: [
        { t: "p", md: "Find FIRST occurrence: when equal, keep searching left (`hi = mid − 1`, record mid). Find LAST: search right (`lo = mid + 1`, record mid). lc-34 is just these two runs. Sqrt(x): binary search the answer space 0..x for the largest m with m*m ≤ x — same template, different array." },
        { t: "code", lang: "python", src: `# first index of target (lc-34 first half)\nlo, hi, ans = 0, len(arr) - 1, -1\nwhile lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] >= target:\n        if arr[mid] == target: ans = mid\n        hi = mid - 1\n    else:\n        lo = mid + 1` },
      ]},
    ],
    traps: [
      "hi = mid (without −1) with lo = mid + 1 asymmetry → infinite loop.",
      "Forgetting the array must be sorted — binary search on unsorted input is nonsense.",
      "While condition lo <= hi for exact search; lo < hi for boundary search variants.",
    ],
    cheat: { head: ["Goal", "Adjustment"], rows: [
      ["Exact match", "return mid on equal"],
      ["First occurrence", "on equal: ans=mid; hi=mid−1"],
      ["Last occurrence", "on equal: ans=mid; lo=mid+1"],
      ["Insert position", "return lo when loop ends"],
      ["Integer sqrt", "bisect on m*m ≤ x"],
    ]},
    checkpoint: [
      { q: "Why mid = (lo+hi)//2 never loops forever with lo=mid+1, hi=mid−1?", a: "The search interval strictly shrinks every iteration." },
      { q: "Search insert position of 5 in [1,3,5,7]?", a: "Index 2 — return lo after the loop." },
      { q: "Binary search complexity?", a: "O(log n)." },
    ],
    problemIds: ["lc-704", "lc-35", "lc-34", "lc-69"],
  },
  {
    id: "C8", domainId: "C", title: "Stacks", minutes: 30,
    tldr: "LIFO: push/pop. Matching pairs, next-greater, undo patterns. Python list is the stack.",
    examTag: "MCQ + coding Q candidate",
    sections: [
      { h: "Matching pairs (parentheses)", blocks: [
        { t: "code", lang: "python", src: `# Valid Parentheses — lc-20\ns = input()\npairs = {')': '(', ']': '[', '}': '{'}\nst = []\nok = True\nfor ch in s:\n    if ch in '([{':\n        st.append(ch)\n    else:\n        if not st or st.pop() != pairs[ch]:\n            ok = False\n            break\nprint(ok and not st)   # leftover openers fail too` },
        { t: "p", md: "The two failure modes: popping an empty stack (closer with no opener) and a non-empty stack at the end (openers never closed). Both checks are one line each — exams test both." },
      ]},
      { h: "Next Greater Element", blocks: [
        { t: "p", md: "Walk the array keeping a stack of 'waiting' indices; when the current value beats the stack top, pop and record the current value as its answer. Monotonic stack: the stack stays decreasing. lc-496 with a nums2→nums1 mapping is the exam-level version." },
        { t: "code", lang: "python", src: `# Next Greater Element — lc-496 (within nums2)\nnums2 = list(map(int, input().split()))\nst, nge = [], {}\nfor x in nums2:\n    while st and x > st[-1]:\n        nge[st.pop()] = x\n    st.append(x)\nprint(nge)   # leftovers have no greater element` },
      ]},
    ],
    traps: [
      "Check `not st` BEFORE popping — popping empty list is the classic bug.",
      "Stack emptiness at the END matters for validity questions.",
      "list.pop() is O(1) from the end; insert(0, x) is O(n) — always push/pop at the right end.",
    ],
    cheat: { head: ["Need", "API"], rows: [
      ["Push", "st.append(x)"],
      ["Pop", "st.pop()"],
      ["Peek", "st[-1]"],
      ["Empty?", "not st / len(st)==0"],
    ]},
    checkpoint: [
      { q: "lc-20's two failure modes?", a: "Pop on empty stack; stack non-empty at the end." },
      { q: "Stack operations in Python lists?", a: "append (push), pop (pop), [-1] (peek) — all O(1)." },
      { q: "Next-greater uses a monotonic stack — monotonic in which order?", a: "Decreasing from bottom to top." },
    ],
    problemIds: ["lc-20", "lc-496"],
  },
  {
    id: "C9", domainId: "C", title: "Sorting Algorithms", minutes: 35,
    tldr: "Implement bubble/selection/insertion cold, know the complexity table, and know WHY sorted input unlocks other patterns.",
    examTag: "MCQ certainty",
    sections: [
      { h: "The three O(n²) sorts", blocks: [
        { t: "code", lang: "python", src: `def bubble(a):\n    n = len(a)\n    for i in range(n):\n        for j in range(n-1-i):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n\ndef selection(a):\n    for i in range(len(a)):\n        m = i\n        for j in range(i+1, len(a)):\n            if a[j] < a[m]: m = j\n        a[i], a[m] = a[m], a[i]\n\ndef insertion(a):\n    for i in range(1, len(a)):\n        key = a[i]; j = i-1\n        while j >= 0 and a[j] > key:\n            a[j+1] = a[j]; j -= 1\n        a[j+1] = key` },
        { t: "table", head: ["Sort", "Best", "Worst", "Stable", "One-liner"], rows: [
          ["Bubble", "O(n) w/ flag", "O(n²)", "yes", "swap adjacent inversions"],
          ["Selection", "O(n²)", "O(n²)", "no", "pick min, swap to front"],
          ["Insertion", "O(n)", "O(n²)", "yes", "insert into sorted prefix"],
          ["Merge", "O(n log n)", "O(n log n)", "yes", "split, sort, merge"],
          ["Quick", "O(n log n)", "O(n²)", "no", "partition around pivot"],
        ]},
      ]},
      { h: "Why sorting unlocks patterns", blocks: [
        { t: "p", md: "Sorted input enables two pointers and binary search (C2, C7). Squares of a sorted array (lc-977) uses the two-end trick because the largest squares live at both ends. Sort Colors (lc-75) is the Dutch-flag three-pointer partition. Remember: `sorted()` returns a new list; `.sort()` mutates — both O(n log n)." },
      ]},
    ],
    traps: [
      "Selection sort is NOT stable (equal keys can reorder).",
      "Bubble with early-exit flag is O(n) on sorted input; without, always O(n²).",
      "sorted(a) vs a.sort() — one returns, one mutates. Read the question's intent.",
    ],
    cheat: { head: ["Sort", "Worst"], rows: [
      ["Bubble/Selection/Insertion", "O(n²)"],
      ["Merge/Heap/Quick(avg)", "O(n log n)"],
      ["Stable sorts", "bubble, insertion, merge"],
      ["Python built-in", "Timsort, O(n log n), stable"],
    ]},
    checkpoint: [
      { q: "Which O(n²) sort is best on nearly-sorted input?", a: "Insertion — O(n) when inversions are few." },
      { q: "sorted([3,1,2]) vs [3,1,2].sort() — difference?", a: "sorted returns a new list; .sort() returns None and mutates." },
      { q: "Sort Colors' three pointers?", a: "low (0-boundary), mid (scan), high (2-boundary) — Dutch national flag." },
    ],
    problemIds: ["site-bubble", "site-selection", "site-insertion", "lc-75", "lc-977"],
  },
  {
    id: "C10", domainId: "C", title: "Recursion & Memoization", minutes: 30,
    tldr: "Base case first, trust the recursion, memoize the overlap. Mirrors B6 but now you WRITE the code.",
    examTag: "coding Q candidate",
    sections: [
      { h: "Writing recursion", blocks: [
        { t: "code", lang: "python", src: `def fib(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib(n-1, memo) + fib(n-2, memo)\n    return memo[n]\n\n# plain fib(30): ~1.6M calls — memoized: ~60` },
        { t: "p", md: "Recipe: 1) nail the base case, 2) assume f(n−1) already works, 3) combine. Memoization caches results in a dict keyed by the argument — the fix for exponential blow-up when subproblems repeat (fibonacci). Power of Two (lc-231) is divide-and-conquer thinking: n is a power of two iff n>0 and n/2 is (down to 1)." },
      ]},
      { h: "When memoization applies", blocks: [
        { t: "list", items: [
          "Same subproblem recomputed (overlapping subproblems)",
          "Pure function of its arguments (no global state)",
          "Args must be hashable — lists aren't; tuples are",
          "Exams test the CALL COUNT difference: fib(5) plain = 15 calls, memoized ≈ 9",
        ]},
      ]},
    ],
    traps: [
      "Missing/wrong base case → RecursionError (B6's trap, now in your code).",
      "Mutable default memo={} actually works here (shared cache) — but understand WHY, it's B5's trap.",
      "Recursion depth: default limit ~1000 — deep linear recursion should be a loop.",
    ],
    cheat: { head: ["Shape", "Structure"], rows: [
      ["Linear (fact/fib)", "f(n) = combine(f(n−1))"],
      ["Branching (fib)", "f(n) = f(n−1) + f(n−2)"],
      ["Memo", "memo[n] computed once, reused"],
    ]},
    checkpoint: [
      { q: "Base case of fib?", a: "n <= 1 → return n." },
      { q: "Why memoize fib?", a: "Overlapping subproblems: fib(n−2) computed many times; cache turns exponential into linear." },
      { q: "Is 1 a power of two?", a: "Yes — 2⁰." },
    ],
    problemIds: ["site-fib", "site-fact", "lc-231"],
  },
  {
    id: "C11", domainId: "C", title: "Math & Logic Shorts", minutes: 35,
    tldr: "Digit math, single-number XOR, carry loops, FizzBuzz — the quick kills you should never lose marks on.",
    examTag: "MCQ + easy coding Q",
    sections: [
      { h: "Digit operations", blocks: [
        { t: "code", lang: "python", src: `# Palindrome number, no strings — lc-9\nn = int(input())\nif n < 0: print(False)\nelse:\n    orig, rev = n, 0\n    while n:\n        rev = rev*10 + n % 10\n        n //= 10\n    print(rev == orig)\n\n# Plus One — lc-66 (carry loop)\nfor i in range(len(arr)-1, -1, -1):\n    if arr[i] < 9:\n        arr[i] += 1; break\n    arr[i] = 0\nelse:\n    arr = [1] + arr   # for-else on while-style carry` },
        { t: "p", md: "`n % 10` is the last digit; `n // 10` drops it. Reverse, digit-sum, digit-count all share this loop. FizzBuzz is pure condition order: divisible by 15 first, then 3, then 5, else the number." },
      ]},
      { h: "Quick kills", blocks: [
        { t: "list", items: [
          "Missing number (lc-268): expected_sum − actual_sum",
          "Majority element (lc-169): count with dict; answer = key with count > n//2",
          "Max consecutive ones (lc-485): streak reset on 0",
          "Single number (lc-136): XOR-fold everything (B7)",
          "Rotate array (lc-189): reverse whole, reverse first k, reverse rest",
        ]},
      ]},
    ],
    traps: [
      "Negative numbers: digit-reversal needs the sign handled separately.",
      "FizzBuzz condition order: check % 15 before % 3 / % 5.",
      "Rotate by k where k > n: use k %= n first.",
    ],
    cheat: { head: ["Problem", "One-liner idea"], rows: [
      ["Missing number", "n(n+1)/2 − sum(arr)"],
      ["Single number", "XOR fold"],
      ["Palindrome int", "reverse digits, compare"],
      ["Rotate array", "triple reversal"],
      ["Majority", "count dict, > n//2"],
    ]},
    checkpoint: [
      { q: "Missing number in [3,0,1]?", a: "Sum 0..3 = 6, actual 4 → 2? No: n=3 → 3×4/2=6, actual 3+0+1=4 → missing 2." },
      { q: "FizzBuzz on 15?", a: "'FizzBuzz' (15 condition first)." },
      { q: "Rotate [1,2,3,4,5] by 2?", a: "[4,5,1,2,3] (triple-reversal trick)." },
    ],
    problemIds: ["lc-9", "lc-136", "lc-66", "lc-412", "lc-268", "lc-169", "lc-485", "lc-189"],
  },
  {
    id: "C12", domainId: "C", title: "Exam-Day Coding Strategy + Leaders", minutes: 30,
    tldr: "The 60-minute plan for the coding round, the template bank to memorize, and the Leaders problem fully solved.",
    examTag: "meta — protects all 3 coding Qs",
    sections: [
      { h: "The 60-minute plan", blocks: [
        { t: "list", items: [
          "Minutes 0-5: read ALL three questions, pick order (SQL usually fastest → do it first mentally, but the interface may force order — know the rules on exam day)",
          "Language: Python. Java/C# not your languages — this was decided long ago.",
          "Hard rule: 20 minutes per question, then park it and move on. Partial marks beat zero.",
          "Last 30 seconds per question: hand-trace the smallest input [-2, 1]. If the trace fails, fix — don't panic-submit.",
        ]},
        { t: "callout", kind: "memo", md: "Submit rule (verbatim, yours): before submitting, spend the last 30 seconds hand-tracing the smallest input [-2, 1]. If the trace fails, fix, don't panic." },
      ]},
      { h: "Leaders in an array (your pending problem)", blocks: [
        { t: "p", md: "A leader is an element greater than **everything to its right**. The rightmost element is always a leader. Scan right→left tracking `max_so_far`; if current > max_so_far, it's a leader. Then REVERSE the collected list (leaders were found right to left). Input `16 17 4 3 5 2` → leaders **17 5 2**." },
        { t: "code", lang: "python", src: `# Leaders in an array\narr = list(map(int, input().split()))\nleaders = []\nmax_so_far = float('-inf')\nfor x in reversed(arr):\n    if x > max_so_far:\n        leaders.append(x)\n        max_so_far = x\nprint(*reversed(leaders))   # 17 5 2` },
      ]},
      { h: "Template bank to memorize", blocks: [
        { t: "table", head: ["Template", "From"], rows: [
          ["I/O five templates", "C1"],
          ["Kadane", "C3"],
          ["Two-pointer converge", "C2"],
          ["Sliding window", "C4"],
          ["dict count / seen set", "C5"],
          ["Binary search", "C7"],
          ["Stack matching", "C8"],
        ]},
      ]},
    ],
    traps: [
      "Spending 40 minutes on one hard question and failing to start the others — time-boxing IS the strategy.",
      "Leaders: forgetting to reverse the output (collected right-to-left).",
      "Panic-reading 'hard' statements: many are Kadane/two-pointer/window in costume.",
    ],
    cheat: { head: ["Minute", "Action"], rows: [
      ["0-5", "Read all 3, plan order"],
      ["5-25", "Q1 (fastest: SQL)"],
      ["25-45", "Q2 (DSA)"],
      ["45-58", "Q3 (HTML/CSS fix)"],
      ["58-60", "Traces + submit sweep"],
    ]},
    checkpoint: [
      { q: "Leaders of 16 17 4 3 5 2?", a: "17 5 2 — scan right→left with max_so_far, reverse at the end." },
      { q: "Why time-box 20 minutes per question?", a: "Three partials score more than one perfect plus two zeros." },
      { q: "Your pre-submit ritual?", a: "30-second hand-trace of the smallest input [-2, 1]." },
    ],
    problemIds: ["site-leaders", "lc-167"],
  },
];
