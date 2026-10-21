import type { Topic } from "./types";

// Domain D — SQL (weight 14). Exam = 3-table joins, ORDER BY, aggregates.
// Running schema: students(id,name), courses(id,title), enrollments(student_id,course_id,marks),
// employees(id,name,salary,dept_id), departments(id,dept_name)
export const TOPICS_D: Topic[] = [
  {
    id: "D1", domainId: "D", title: "SELECT Basics", minutes: 30,
    tldr: "SELECT…FROM…WHERE…ORDER BY…LIMIT is the skeleton of every SQL answer, including the hard ones.",
    examTag: "1 of 3 coding Qs foundation",
    sections: [
      { h: "The skeleton", blocks: [
        { t: "code", lang: "sql", src: `SELECT name, marks\nFROM students\nWHERE marks >= 80\nORDER BY marks DESC, name ASC\nLIMIT 5;` },
        { t: "p", md: "WHERE filters rows **before** grouping; comparison operators =, <>, IN, BETWEEN, LIKE all live here. `LIKE 'A%'` starts-with-A, `'%a'` ends-with-a, `'_at'` exactly-three-letters-ending-at. DISTINCT kills duplicate rows in the output." },
      ]},
      { h: "NULL logic (the eternal trap)", blocks: [
        { t: "p", md: "`NULL = NULL` is not true — it's unknown. Testing for NULL uses **IS NULL / IS NOT NULL**. Any comparison with NULL yields unknown, so `WHERE bonus <> 100` silently drops rows with NULL bonus. Exams test this every single time." },
        { t: "code", lang: "sql", src: `SELECT name FROM employees WHERE bonus IS NULL;\n-- NOT: WHERE bonus = NULL   (always empty)` },
      ]},
    ],
    traps: [
      "WHERE bonus = NULL returns nothing — IS NULL only.",
      "ORDER BY is ascending by default; DESC must be written.",
      "LIMIT after ORDER BY — order of clauses is fixed: SELECT FROM WHERE GROUP BY HAVING ORDER BY LIMIT.",
      "<> is 'not equal' (=! also works in some dialects; <> is the portable one).",
    ],
    cheat: { head: ["Clause", "Job"], rows: [
      ["WHERE", "filter rows (pre-group)"],
      ["ORDER BY x DESC", "sort"],
      ["LIMIT n", "first n rows"],
      ["IS NULL", "null test"],
      ["LIKE 'a%'", "prefix match"],
    ]},
    checkpoint: [
      { q: "How to find rows where bonus is missing?", a: "WHERE bonus IS NULL." },
      { q: "Top 3 salaries query shape?", a: "SELECT salary FROM employees ORDER BY salary DESC LIMIT 3." },
      { q: "Names starting with 'K'?", a: "WHERE name LIKE 'K%'." },
    ],
    problemIds: ["lc-595", "lc-620", "lc-610", "lc-1148"],
  },
  {
    id: "D2", domainId: "D", title: "Aggregates, GROUP BY, HAVING", minutes: 35,
    tldr: "WHERE filters rows, HAVING filters groups. Your Q2b mistake died exactly here — this is the lesson that fixes it.",
    examTag: "1 of 3 coding Qs core",
    sections: [
      { h: "The five aggregates", blocks: [
        { t: "p", md: "COUNT(*), SUM, AVG, MIN, MAX — all ignore NULLs inside their argument (COUNT(*) counts rows). AVG of (10, NULL, 90) is 50, not 33.3. COUNT(col) vs COUNT(*): the first skips NULL values in that column." },
      ]},
      { h: "GROUP BY then HAVING", blocks: [
        { t: "code", lang: "sql", src: `-- average marks per student, best first\nSELECT s.name, AVG(e.marks) AS avg_marks\nFROM students s\nJOIN enrollments e ON e.student_id = s.id\nGROUP BY s.id, s.name\nHAVING AVG(e.marks) > 75\nORDER BY avg_marks DESC;` },
        { t: "p", md: "Execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT. You cannot use a SELECT alias in WHERE (too early) but can in ORDER BY (later). **WHERE filters rows before grouping; HAVING filters groups after** — putting AVG() in WHERE is a syntax error everywhere." },
        { t: "callout", kind: "trap", md: "Your Q2b autopsy: 'student with the LOWEST average marks' needed ORDER BY AVG(marks) DESC + LIMIT 1 to get the HIGHEST — you returned the lowest because DESC was missing. DESC is the whole question. Read the direction twice." },
      ]},
    ],
    traps: [
      "Aggregate in WHERE = error. Use HAVING for group conditions.",
      "Columns in SELECT must be in GROUP BY or inside an aggregate.",
      "Missing DESC flips the answer — exactly your Q2b bug.",
      "AVG ignores NULLs.",
    ],
    cheat: { head: ["Ask", "Query shape"], rows: [
      ["Per-group number", "GROUP BY … COUNT(*)"],
      ["Groups above X", "… HAVING AVG(x) > X"],
      ["Best group", "ORDER BY AVG(x) DESC LIMIT 1"],
      ["Worst group", "ORDER BY AVG(x) ASC LIMIT 1"],
    ]},
    checkpoint: [
      { q: "WHERE vs HAVING in one line?", a: "WHERE filters rows before grouping; HAVING filters groups after." },
      { q: "AVG(10, NULL, 90)?", a: "50 — NULLs ignored." },
      { q: "Student with lowest average marks — full shape?", a: "JOIN, GROUP BY student, ORDER BY AVG(marks) ASC, LIMIT 1." },
    ],
    problemIds: ["site-avg-marks-desc", "site-lowest-avg"],
  },
  {
    id: "D3", domainId: "D", title: "Joins (the exam's favorite)", minutes: 40,
    tldr: "The coding question is usually a 3-table chain join. INNER for matches-only, LEFT to keep orphans.",
    examTag: "1 of 3 coding Qs — near certain",
    sections: [
      { h: "The four joins", blocks: [
        { t: "table", head: ["Join", "Keeps"], rows: [
          ["INNER JOIN", "only rows matching in BOTH tables"],
          ["LEFT JOIN", "all left rows; NULLs where no match"],
          ["RIGHT JOIN", "all right rows; NULLs where no match"],
          ["FULL JOIN", "all rows from both sides"],
        ]},
        { t: "code", lang: "sql", src: `-- 3-table chain: student → enrollment → course\nSELECT s.name, c.title, e.marks\nFROM students s\nJOIN enrollments e ON e.student_id = s.id\nJOIN courses    c ON c.id = e.course_id\nORDER BY e.marks DESC;` },
        { t: "p", md: "Read joins as 'row multiplication guarded by the ON condition'. Every enrollment row pairs with its student and course. INNER drops students with zero enrollments; LEFT keeps them with NULL marks — the exam phrase 'include students even if they enrolled in nothing' is the LEFT JOIN signal." },
      ]},
      { h: "Choosing the join", blocks: [
        { t: "list", items: [
          "'who ordered / who enrolled (at least once)' → INNER",
          "'…or never did' → LEFT JOIN + WHERE right.id IS NULL",
          "'count per group including zero counts' → LEFT JOIN + COUNT(right.id) (not COUNT(*))",
          "Alias every table (s, e, c) — 3-table queries are unreadable without aliases",
        ]},
        { t: "callout", kind: "tip", md: "COUNT(e.student_id) counts matched enrollments only — a LEFT-Joined student with no enrollments correctly counts 0. COUNT(*) would wrongly count their NULL-extended row as 1." },
      ]},
    ],
    traps: [
      "LEFT JOIN + WHERE right.col = value silently becomes an INNER join (NULL rows fail the test) — put the condition in ON or use IS NULL.",
      "Forgetting the ON condition → cartesian product (n × m rows).",
      "Ambiguous column names in multi-table queries — always qualify: s.id vs e.id.",
    ],
    cheat: { head: ["Need", "Join"], rows: [
      ["Matches only", "INNER JOIN"],
      ["Keep left orphans", "LEFT JOIN"],
      ["Never matched", "LEFT JOIN … WHERE r.id IS NULL"],
      ["Count incl. zeros", "LEFT JOIN + COUNT(r.id)"],
    ]},
    checkpoint: [
      { q: "Students who never enrolled — query shape?", a: "LEFT JOIN enrollments … WHERE e.student_id IS NULL." },
      { q: "3-table chain order for students-courses?", a: "students JOIN enrollments ON student_id JOIN courses ON course_id." },
      { q: "Why COUNT(r.id) not COUNT(*) with LEFT JOIN?", a: "COUNT(*) counts NULL-extended rows too; COUNT(r.id) skips NULLs." },
    ],
    problemIds: ["lc-175", "lc-577", "lc-1280", "site-no-enrollment"],
  },
  {
    id: "D4", domainId: "D", title: "Subqueries", minutes: 30,
    tldr: "A query inside a query: scalar, IN, EXISTS, correlated. 'Above average' is the canonical exam pattern.",
    examTag: "MCQ + coding Q support",
    sections: [
      { h: "The four shapes", blocks: [
        { t: "code", lang: "sql", src: `-- scalar (one value)\nSELECT name FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);\n\n-- IN (a list)\nSELECT name FROM students WHERE id IN\n  (SELECT student_id FROM enrollments WHERE course_id = 2);\n\n-- EXISTS (correlated — row-by-row)\nSELECT name FROM customers c WHERE EXISTS\n  (SELECT 1 FROM orders o WHERE o.customer_id = c.id);` },
        { t: "p", md: "Scalar subqueries must return exactly one value. IN handles a list. The **correlated** subquery references the outer row and runs once per row — EXISTS is the fast way to ask 'does at least one matching row exist?'. 'Above the average of their own department' is the classic correlated pattern." },
      ]},
      { h: "Subquery in FROM", blocks: [
        { t: "p", md: "Wrap an aggregate query and treat it as a table: `FROM (SELECT dept, AVG(sal) a FROM emp GROUP BY dept) t WHERE t.a > 50000`. Remember to alias the derived table (t) — every dialect requires it." },
      ]},
    ],
    traps: [
      "Scalar subquery returning multiple rows → runtime error.",
      "NOT IN with NULLs in the inner list matches nothing — prefer NOT EXISTS.",
      "Correlated = references outer alias; uncorrelated = independent (runs once).",
    ],
    cheat: { head: ["Need", "Shape"], rows: [
      ["Above overall avg", "> (SELECT AVG…)"],
      ["In a set", "IN (SELECT …)"],
      ["Has at least one", "EXISTS (correlated)"],
      ["Compare group avgs", "FROM (subquery) t"],
    ]},
    checkpoint: [
      { q: "'Salary above average' — which subquery type?", a: "Scalar in the WHERE clause." },
      { q: "Why does NOT IN break with NULLs?", a: "x NOT IN (…, NULL) is never TRUE — unknown kills the match." },
      { q: "Correlated vs uncorrelated — execution count?", a: "Correlated: once per outer row. Uncorrelated: once total." },
    ],
    problemIds: ["lc-183", "lc-184"],
  },
  {
    id: "D5", domainId: "D", title: "Window Functions: RANK family", minutes: 30,
    tldr: "ROW_NUMBER vs RANK vs DENSE_RANK decide ties differently — and DENSE_RANK is the clean answer to '2nd highest'.",
    examTag: "coding Q differentiator",
    sections: [
      { h: "Three rankers, one tie", blocks: [
        { t: "table", head: ["Function", "Salaries 100,100,90"], rows: [
          ["ROW_NUMBER", "1, 2, 3 (arbitrary tie-break)"],
          ["RANK", "1, 1, 3 (gaps after ties)"],
          ["DENSE_RANK", "1, 1, 2 (no gaps)"],
        ]},
        { t: "code", lang: "sql", src: `-- 2nd highest distinct salary (way 3 of D6)\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) t\nWHERE rnk = 2;` },
        { t: "p", md: "PARTITION BY resets the ranking per group — 'top earner in each department' = DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) then filter rnk = 1. Window functions run AFTER grouping; they never collapse rows like GROUP BY does." },
      ]},
    ],
    traps: [
      "RANK leaves gaps (1,1,3); DENSE_RANK doesn't (1,1,2). '2nd highest' wants DENSE_RANK = 2.",
      "ROW_NUMBER gives no tie handling — wrong tool for salary ties.",
      "Window functions can't go in WHERE — wrap in a subquery and filter outside.",
    ],
    cheat: { head: ["Goal", "Tool"], rows: [
      ["2nd highest salary", "DENSE_RANK … WHERE rnk=2"],
      ["Top per group", "PARTITION BY group … rnk=1"],
      ["Unique row numbers", "ROW_NUMBER"],
    ]},
    checkpoint: [
      { q: "100,100,90 — DENSE_RANK values?", a: "1, 1, 2." },
      { q: "Why wrap in a subquery to filter rnk?", a: "Window results aren't available to WHERE; only to an outer query." },
      { q: "Top salary per department shape?", a: "DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) = 1." },
    ],
    problemIds: ["lc-176", "lc-177", "lc-184"],
  },
  {
    id: "D6", domainId: "D", title: "Classic Patterns Vault", minutes: 35,
    tldr: "2nd-highest-salary THREE ways, duplicates, never-ordered customers — the exam recycles these five shapes.",
    examTag: "direct exam patterns",
    sections: [
      { h: "2nd highest salary — three ways", blocks: [
        { t: "code", lang: "sql", src: `-- 1) LIMIT/OFFSET (fails when fewer rows exist)\nSELECT DISTINCT salary FROM employees\nORDER BY salary DESC LIMIT 1 OFFSET 1;\n\n-- 2) MAX below MAX (survives empty result → NULL)\nSELECT MAX(salary) FROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- 3) DENSE_RANK (generalizes to Nth highest)\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) r\n  FROM employees) t WHERE r = 2;` },
        { t: "p", md: "Know all three and WHEN each breaks: way 1 returns nothing when there's no 2nd salary; way 2 returns NULL (usually the expected answer); way 3 generalizes but needs the subquery wrapper. LC 176 expects NULL — that's a hint about which way the grader wants." },
      ]},
      { h: "Duplicates & never-matched", blocks: [
        { t: "code", lang: "sql", src: `-- duplicate emails (lc-182)\nSELECT email FROM people\nGROUP BY email HAVING COUNT(*) > 1;\n\n-- customers who never ordered (lc-183)\nSELECT c.name FROM customers c\nLEFT JOIN orders o ON o.customer_id = c.id\nWHERE o.id IS NULL;` },
      ]},
    ],
    traps: [
      "DISTINCT before LIMIT/OFFSET or repeated salaries break the offset count.",
      "HAVING COUNT(*) > 1 needs GROUP BY — writing it without is an error.",
      "'Never' questions are always LEFT JOIN + IS NULL, never NOT IN (NULL trap from D4).",
    ],
    cheat: { head: ["Pattern", "Skeleton"], rows: [
      ["2nd highest", "3 ways above"],
      ["Duplicates", "GROUP BY … HAVING COUNT(*)>1"],
      ["Never matched", "LEFT JOIN … IS NULL"],
      ["Dept top", "DENSE_RANK PARTITION BY dept"],
    ]},
    checkpoint: [
      { q: "Which 2nd-highest way returns NULL when it doesn't exist?", a: "Way 2 — MAX below MAX." },
      { q: "Find duplicate emails?", a: "GROUP BY email HAVING COUNT(*) > 1." },
      { q: "OFFSET 1 with LIMIT 1 means…?", a: "Skip the first row, take the next — the 2nd row." },
    ],
    problemIds: ["lc-176", "lc-177", "lc-182", "lc-183", "lc-184"],
  },
  {
    id: "D7", domainId: "D", title: "DDL vs DML vs DCL", minutes: 25,
    tldr: "Command categories and the TRUNCATE-vs-DELETE trap. Pure MCQ marks, zero coding.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The four families", blocks: [
        { t: "table", head: ["Family", "Commands", "Does"], rows: [
          ["DDL", "CREATE, ALTER, DROP, TRUNCATE", "defines structure"],
          ["DML", "SELECT, INSERT, UPDATE, DELETE", "manipulates data"],
          ["DCL", "GRANT, REVOKE", "permissions"],
          ["TCL", "COMMIT, ROLLBACK", "transactions"],
        ]},
        { t: "p", md: "The favorite trap: **DELETE vs TRUNCATE** — DELETE is DML, row-by-row, can have WHERE, can be rolled back; TRUNCATE is DDL, removes ALL rows instantly, no WHERE, typically not logged per-row. DROP removes the table itself (structure AND data)." },
      ]},
      { h: "Keys", blocks: [
        { t: "list", items: [
          "PRIMARY KEY: unique + not null, one per table",
          "FOREIGN KEY: references another table's PK; enforces referential integrity",
          "UNIQUE: no duplicates but (unlike PK) usually allows one NULL",
          "ALTER TABLE t ADD COLUMN x INT; — the standard DDL edit",
        ]},
      ]},
    ],
    traps: [
      "TRUNCATE is DDL, not DML. No WHERE clause exists for it.",
      "DROP deletes structure + data; DELETE/TRUNCATE keep the structure.",
      "GRANT/REVOKE are DCL — the options love mixing them into DML.",
    ],
    cheat: { head: ["Command", "Family"], rows: [
      ["CREATE/ALTER/DROP/TRUNCATE", "DDL"],
      ["INSERT/UPDATE/DELETE/SELECT", "DML"],
      ["GRANT/REVOKE", "DCL"],
      ["COMMIT/ROLLBACK", "TCL"],
    ]},
    checkpoint: [
      { q: "TRUNCATE's family and the reason?", a: "DDL — it deallocates the table's pages rather than deleting row-by-row." },
      { q: "Remove all rows but keep the table?", a: "TRUNCATE (or unconditional DELETE)." },
      { q: "Give a user read permission?", a: "GRANT SELECT ON table TO user (DCL)." },
    ],
    problemIds: [],
  },
  {
    id: "D8", domainId: "D", title: "Set Ops, CASE, String/Date Funcs", minutes: 25,
    tldr: "UNION vs UNION ALL, CASE WHEN, and the string/date helpers that finish off odd MCQs.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "Set operations", blocks: [
        { t: "p", md: "UNION removes duplicates (costly sort), UNION ALL keeps everything (fast). Both need the same number and compatible types of columns. INTERSECT = rows in both; EXCEPT/MINUS = rows in the first not in the second." },
      ]},
      { h: "CASE and helpers", blocks: [
        { t: "code", lang: "sql", src: `SELECT name,\n  CASE WHEN marks >= 90 THEN 'A'\n       WHEN marks >= 75 THEN 'B'\n       ELSE 'C' END AS grade\nFROM students;\n\n-- helpers: UPPER, LOWER, LENGTH, CONCAT\n-- dates: YEAR(d), DATEDIFF(a,b), NOW(), CURDATE()` },
        { t: "p", md: "CASE evaluates top-down and stops at the first true branch. Rising Temperature (lc-197) is the standard date self-join: find rows whose date = yesterday of another row — DATEDIFF(a.date, b.date) = 1." },
      ]},
    ],
    traps: [
      "UNION deduplicates; UNION ALL doesn't — 'include all rows' in the question means ALL.",
      "CASE without a matching ELSE gives NULL.",
      "Column counts must match for any set operation.",
    ],
    cheat: { head: ["Tool", "Note"], rows: [
      ["UNION", "dedupes"],
      ["UNION ALL", "keeps dupes, faster"],
      ["CASE WHEN … THEN … END", "conditional column"],
      ["CONCAT(a,b)", "glue strings"],
      ["DATEDIFF(a,b)", "a − b in days"],
    ]},
    checkpoint: [
      { q: "Fast way to combine two result sets keeping duplicates?", a: "UNION ALL." },
      { q: "CASE with no ELSE and no match returns?", a: "NULL." },
      { q: "lc-197's date condition?", a: "DATEDIFF(a.recordDate, b.recordDate) = 1 with a.temperature > b.temperature." },
    ],
    problemIds: ["lc-197", "lc-577"],
  },
];
