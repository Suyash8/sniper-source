import type { Topic } from "./types";

// Domain E — WEB: HTML/CSS + JS survival (weight 10). Coding Q3 = fix-it task.
export const TOPICS_E: Topic[] = [
  {
    id: "E1", domainId: "E", title: "HTML Structure & Semantics", minutes: 30,
    tldr: "Boilerplate, heading order, semantic tags. The fix-it question usually starts with wrong or missing structure.",
    examTag: "1 of 3 coding Qs + MCQs",
    sections: [
      { h: "Boilerplate (write it from memory)", blocks: [
        { t: "code", lang: "html", src: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Page title</title>\n</head>\n<body>\n  <h1>Main heading</h1>\n</body>\n</html>` },
        { t: "p", md: "One h1 per page, headings in order (h1→h2→h3, never skip levels for font size — that's CSS's job). `<div>` is a meaningless box; `<header> <nav> <main> <section> <article> <footer>` tell browsers and screen readers what each region IS. `<span>` is the inline equivalent of div." },
      ]},
      { h: "Links & images", blocks: [
        { t: "code", lang: "html", src: `<a href="https://example.com" target="_blank">external</a>\n<a href="#section2">jump to section2</a>\n<img src="pic.jpg" alt="A description for screen readers">\n<!-- alt text is the accessibility answer -->` },
        { t: "p", md: "Anchor links jump to elements with a matching `id` (`<h2 id=\"section2\">`). `target=\"_blank\"` opens a new tab. The exam loves: which attribute describes an image (alt), which tag creates a hyperlink (a), what href does." },
      ]},
    ],
    traps: [
      "Skipping heading levels for styling — headings are structure, not style.",
      "Missing alt attribute = accessibility fail (a favorite MCQ).",
      "<br> is a line break, not a paragraph separator — use <p>.",
    ],
    cheat: { head: ["Tag", "Meaning"], rows: [
      ["<header>/<footer>", "page/section boundaries"],
      ["<nav>", "navigation links"],
      ["<main>", "one per page, main content"],
      ["<article>/<section>", "self-contained / thematic group"],
      ["<a href='#id'>", "in-page jump"],
      ["alt", "image text alternative"],
    ]},
    checkpoint: [
      { q: "How many <main> elements per page?", a: "One." },
      { q: "Attribute for screen-reader image description?", a: "alt." },
      { q: "What does target='_blank' do?", a: "Opens the link in a new tab." },
    ],
    problemIds: ["site-html-boiler", "site-html-semantics", "site-nav"],
  },
  {
    id: "E2", domainId: "E", title: "Forms & Inputs", minutes: 30,
    tldr: "Input types, label-for, name vs id. The registration-form build is a classic SITE problem.",
    examTag: "MCQ + coding Q candidate",
    sections: [
      { h: "A complete form", blocks: [
        { t: "code", lang: "html", src: `<form action="/submit" method="post">\n  <label for="email">Email</label>\n  <input type="email" id="email" name="email" required>\n\n  <input type="password" name="pass" placeholder="Password">\n  <input type="number" name="age" min="1" max="120">\n  <input type="radio" name="plan" value="pro"> Pro\n  <input type="checkbox" name="tos"> Agree\n  <select name="city"><option>Chennai</option></select>\n  <textarea name="bio"></textarea>\n  <button type="submit">Register</button>\n</form>` },
        { t: "p", md: "`label for` must equal the input's `id` — clicking the label focuses the field (the accessibility MCQ). `name` is what gets SENT to the server; `id` is for labels/JS/CSS. Radios sharing a `name` form an exclusive group; checkboxes are independent." },
      ]},
      { h: "Validation attributes", blocks: [
        { t: "list", items: [
          "required — blocks empty submit",
          "min / max / maxlength — range limits",
          "placeholder — hint text (NOT a label substitute)",
          "type=email/number/date give free validation + mobile keyboards",
        ]},
      ]},
    ],
    traps: [
      "name vs id: name goes to the server, id stays in the browser.",
      "Radio buttons need the SAME name to be mutually exclusive.",
      "placeholder is not a label — it disappears on typing (accessibility trap).",
    ],
    cheat: { head: ["Attribute", "Purpose"], rows: [
      ["for / id", "label↔input binding"],
      ["name", "server-side key"],
      ["required", "can't submit empty"],
      ["value", "default / submitted value"],
    ]},
    checkpoint: [
      { q: "Which attribute links a label to its input?", a: "for (matching the input's id)." },
      { q: "Radio vs checkbox?", a: "Radios with the same name are exclusive; checkboxes are independent." },
      { q: "Which attribute value reaches the server?", a: "name (paired with value)." },
    ],
    problemIds: ["site-form"],
  },
  {
    id: "E3", domainId: "E", title: "Tables & Media", minutes: 25,
    tldr: "thead/tbody structure, th vs td, colspan/rowspan. Marks table problems are one join away from SQL questions.",
    examTag: "MCQ",
    sections: [
      { h: "Table anatomy", blocks: [
        { t: "code", lang: "html", src: `<table>\n  <thead>\n    <tr><th>Name</th><th colspan=\"2\">Marks</th></tr>\n  </thead>\n  <tbody>\n    <tr><td>Asha</td><td>88</td><td>92</td></tr>\n  </tbody>\n</table>` },
        { t: "p", md: "th = header cell (bold, centered by default), td = data cell. colspan spans columns, rowspan spans rows. Tables are for TABULAR data — never layout (that's the 2005 answer exams still test)." },
      ]},
      { h: "Media", blocks: [
        { t: "list", items: [
          "<img src alt width height> — self-closing, alt mandatory for a11y",
          "<video controls src> · <audio controls>",
          "<iframe src> embeds another page",
          "Loading attribute lazy defers offscreen images",
        ]},
      ]},
    ],
    traps: [
      "th is inside tr like td — it's a cell type, not a row type.",
      "colspan=2 means THIS cell takes two columns (rows don't shift automatically).",
      "Tables are not for page layout.",
    ],
    cheat: { head: ["Tag/Attr", "Meaning"], rows: [
      ["<th>/<td>", "header/data cell"],
      ["<thead>/<tbody>", "header/body groups"],
      ["colspan / rowspan", "cell span"],
      ["<img alt>", "text alternative"],
    ]},
    checkpoint: [
      { q: "Header cell tag?", a: "<th>." },
      { q: "A cell spanning two columns?", a: "colspan=\"2\"." },
      { q: "Correct use of tables?", a: "Tabular data only — never page layout." },
    ],
    problemIds: ["site-table"],
  },
  {
    id: "E4", domainId: "E", title: "Box Model", minutes: 30,
    tldr: "content+padding+border+margin, and box-sizing:border-box. Centering a div has three answers — know them all.",
    examTag: "1 of 3 coding Qs core",
    sections: [
      { h: "The four layers", blocks: [
        { t: "p", md: "From inside out: content → padding (inside the border) → border → margin (outside, pushes neighbors away). Default box-sizing is content-box: width=200px + padding 20px = 240px actual. **box-sizing: border-box** makes width include padding and border — the sane default every modern page sets." },
        { t: "code", lang: "css", src: `* { box-sizing: border-box; }  /* width includes pad+border */\n\n.card {\n  padding: 20px;      /* space inside */\n  border: 1px solid #333;\n  margin: 16px auto;  /* auto centers a block with a set width */\n  width: 300px;\n}` },
      ]},
      { h: "Centering — three ways", blocks: [
        { t: "list", items: [
          "Block with width: margin-left:auto; margin-right:auto (or margin: 0 auto)",
          "Flex parent: display:flex; justify-content:center; align-items:center",
          "Grid parent: display:grid; place-items:center",
        ]},
        { t: "callout", kind: "trap", md: "text-align:center centers INLINE content, not the box itself. And vertical centering is impossible with text-align — flex/grid is the answer. Margin collapse: adjacent vertical margins merge to the larger one, not add." },
      ]},
    ],
    traps: [
      "Default content-box: real width = width + padding + border.",
      "margin: auto needs a set width to center a block.",
      "Padding adds INSIDE the background; margin is transparent outside.",
      "Vertical margins collapse between siblings.",
    ],
    cheat: { head: ["Property", "Layer"], rows: [
      ["padding", "inside border, shows bg"],
      ["border", "the edge itself"],
      ["margin", "outside, transparent"],
      ["box-sizing: border-box", "width includes pad+border"],
      ["margin: 0 auto", "horizontal center"],
    ]},
    checkpoint: [
      { q: "width:200, padding:20, content-box — total width?", a: "240px (border-box would be 200)." },
      { q: "Which property pushes NEIGHBORS away?", a: "margin." },
      { q: "Two reliable ways to center vertically?", a: "flex align-items:center, or grid place-items:center." },
    ],
    problemIds: ["site-boxmodel"],
  },
  {
    id: "E5", domainId: "E", title: "Selectors & Specificity", minutes: 30,
    tldr: "id > class > element, plus pseudo-classes. Specificity decides fights; inheritance decides defaults.",
    examTag: "≈4 of 45 MCQs",
    sections: [
      { h: "Selector zoo", blocks: [
        { t: "code", lang: "css", src: `.card { }          /* class */\n#hero { }          /* id */\nnav a { }          /* descendant: any a inside nav */\nnav > a { }        /* direct child only */\na:hover { }        /* pseudo-class: mouse over */\nli:first-child { }\np.intro { }        /* p WITH class intro */\nh1, h2 { }         /* grouped */` },
        { t: "p", md: "Specificity ranking: inline style > id > class/pseudo-class > element. Tie → later rule wins. `!important` overrides everything (use as a last resort — the exam asks what it does, not to use it). Inherited properties: color, font, text-align. NOT inherited: margin, padding, border, width." },
      ]},
      { h: "The fight resolver", blocks: [
        { t: "table", head: ["Rule", "Score (id,class,elem)"], rows: [
          ["p", "0,0,1"],
          [".intro", "0,1,0"],
          ["p.intro", "0,1,1"],
          ["#hero", "1,0,0"],
          ["#hero p.intro", "1,1,1"],
        ]},
      ]},
    ],
    traps: [
      "nav > a matches direct children only; nav a matches ALL descendants.",
      "Two same-specificity rules: the LATER one in the stylesheet wins.",
      "!important beats id AND inline styles (but not another !important).",
      "Border/padding don't inherit — children don't get them automatically.",
    ],
    cheat: { head: ["Selector", "Type"], rows: [
      ["#id", "id (highest)"],
      [".class / :hover", "class-level"],
      ["element", "lowest"],
      ["A > B", "direct child"],
      ["A B", "any descendant"],
    ]},
    checkpoint: [
      { q: "Which wins: #a {color:red} later vs .b {color:blue} earlier?", a: "#a — id beats class regardless of order (same for ties only)." },
      { q: "nav > a vs nav a — difference?", a: "> = direct children only; space = all descendants." },
      { q: "Do margins inherit?", a: "No." },
    ],
    problemIds: [],
  },
  {
    id: "E6", domainId: "E", title: "Flexbox", minutes: 35,
    tldr: "One axis, two properties: justify-content (main axis) vs align-items (cross axis). Navbar recipe included.",
    examTag: "1 of 3 coding Qs candidate",
    sections: [
      { h: "The container properties", blocks: [
        { t: "code", lang: "css", src: `.nav {\n  display: flex;\n  justify-content: space-between; /* main axis */\n  align-items: center;            /* cross axis */\n  gap: 16px;\n  flex-wrap: wrap;                /* allow wrapping */\n}\n.logo { margin-right: auto; }     /* pushes the rest right */\n.grow { flex: 1; }                /* fill leftover space */` },
        { t: "p", md: "The eternal confusion: justify-content works ALONG the main axis (horizontal when flex-direction is row), align-items across it. Row direction: justify = left/right-ish (start/end/center/space-between/around), align = up/down. Column direction swaps them. `gap` replaces margin hacks between items." },
      ]},
      { h: "The two recipes you must write from memory", blocks: [
        { t: "code", lang: "css", src: `/* perfect horizontal+vertical centering */\n.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n/* sticky footer layout */\n.page { display: flex; flex-direction: column; min-height: 100vh; }\nmain { flex: 1; }   /* footer pushed to bottom */` },
      ]},
    ],
    traps: [
      "justify vs align swap when flex-direction changes to column.",
      "align-items: center centers CROSS-axis — for one-line vertical centering that's what you want.",
      "flex:1 on an item makes it absorb free space (grow), not shrink others.",
    ],
    cheat: { head: ["Goal (row)", "Property"], rows: [
      ["Space between items", "justify-content: space-between"],
      ["Vertical center", "align-items: center"],
      ["Wrap items", "flex-wrap: wrap"],
      ["Fill leftovers", "flex: 1"],
      ["Both centers", "justify-content:center + align-items:center"],
    ]},
    checkpoint: [
      { q: "Row direction: which property moves items left/right?", a: "justify-content (main axis)." },
      { q: "Perfect centering duo?", a: "justify-content:center + align-items:center on the flex parent." },
      { q: "What does flex:1 do?", a: "Item grows to fill remaining free space." },
    ],
    problemIds: ["site-flexnav"],
  },
  {
    id: "E7", domainId: "E", title: "Grid & Positioning", minutes: 30,
    tldr: "grid-template-columns for 2D layouts; position for overlays. Static → sticky ladder with one-liners each.",
    examTag: "MCQ + layout Q",
    sections: [
      { h: "Grid basics", blocks: [
        { t: "code", lang: "css", src: `.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */\n  gap: 12px;\n}\n.hero { grid-column: span 2; }  /* item spans 2 columns */\n/* place-items: center; centers each item in its cell */` },
        { t: "p", md: "fr = fraction of free space. Grid is two-dimensional (rows AND columns) — flexbox is one-dimensional. Quick call: single row/line of things → flex; page/gallery scaffold → grid." },
      ]},
      { h: "position ladder", blocks: [
        { t: "table", head: ["Value", "Behavior"], rows: [
          ["static", "default, normal flow"],
          ["relative", "offset from own spot; anchor for absolute children"],
          ["absolute", "pinned to nearest positioned ancestor, out of flow"],
          ["fixed", "pinned to viewport, ignores scroll"],
          ["sticky", "scrolls until threshold, then sticks"],
        ]},
        { t: "p", md: "absolute needs a positioned ancestor (relative parent) or it anchors to the page. z-index only applies to positioned elements. The exam's classic: 'which position keeps its space in flow?' → relative. 'Which ignores scrolling?' → fixed." },
      ]},
    ],
    traps: [
      "absolute without a positioned ancestor anchors to <body>/page.",
      "z-index does nothing on static elements.",
      "sticky needs a threshold (top: 0) to do anything.",
    ],
    cheat: { head: ["Value", "Key fact"], rows: [
      ["relative", "keeps space, offsets visually"],
      ["absolute", "out of flow, nearest positioned ancestor"],
      ["fixed", "viewport-anchored"],
      ["sticky", "flow until threshold"],
      ["repeat(3, 1fr)", "3 equal grid columns"],
    ]},
    checkpoint: [
      { q: "Which position value keeps its space in the flow?", a: "relative." },
      { q: "Dropdown overlay uses which position pair?", a: "Parent relative, child absolute." },
      { q: "3 equal columns in grid?", a: "grid-template-columns: repeat(3, 1fr)." },
    ],
    problemIds: ["site-grid"],
  },
  {
    id: "E8", domainId: "E", title: "Units, Text & the Two Bugs You Shipped", minutes: 30,
    tldr: "px vs rem vs %, line-height WITHOUT px units, border-radius. Your actual Day-2 fixes live here.",
    examTag: "1 of 3 coding Qs — your bug",
    sections: [
      { h: "Units ladder", blocks: [
        { t: "table", head: ["Unit", "Relative to"], rows: [
          ["px", "fixed pixels"],
          ["%", "parent (width) / font (some props)"],
          ["em", "element's own font-size (compounds!)"],
          ["rem", "root font-size (predictable)"],
          ["vh / vw", "viewport height / width"],
        ]},
        { t: "p", md: "rem is the safe default for spacing/typography (root usually 16px: 1.5rem = 24px). em compounds through nesting — the exam tests that 1.2em inside 1.2em inside 1.2em is NOT 1.2×." },
      ]},
      { h: "The fix-it card (your two bugs)", blocks: [
        { t: "code", lang: "css", src: `/* BEFORE — your Day-2 bugs */\n.card { line-height: 10px; }        /* text squashed */\n\n/* AFTER */\n.card {\n  line-height: 1.5;   /* unitless = 1.5 × font-size. NEVER 10px */\n  border-radius: 6px; /* rounded corners — this was missing */\n}` },
        { t: "callout", kind: "trap", md: "Unitless line-height is the professional answer: 1.5 scales with font-size automatically. A fixed 10px line-height crushes 16px text — the exact bug you shipped on Day 2. And border-radius: 6px rounds corners; on a circle use 50%." },
        { t: "list", items: [
          "font-weight: 400 normal, 700 bold",
          "text-align: left/center/right — text INSIDE the element",
          "box-shadow: x-offset y-offset blur color",
          "border: 1px solid #333 — width style color in one line",
        ]},
      ]},
    ],
    traps: [
      "line-height in px doesn't scale — unitless 1.5 is correct.",
      "border-radius: 50% = circle (on a square element).",
      "em compounds; rem doesn't.",
      "text-align centers text, not the element box.",
    ],
    cheat: { head: ["Fix", "Value"], rows: [
      ["Readable line-height", "1.5 (unitless)"],
      ["Rounded corners", "border-radius: 6px"],
      ["Circle", "border-radius: 50%"],
      ["Root-relative unit", "rem"],
      ["Bold", "font-weight: 700"],
    ]},
    checkpoint: [
      { q: "Your line-height bug and fix?", a: "10px crushed text → line-height: 1.5 unitless." },
      { q: "Missing property that rounded the card corners?", a: "border-radius: 6px." },
      { q: "1.5rem in px (16px root)?", a: "24px." },
    ],
    problemIds: ["site-cardfix", "site-hover"],
  },
  {
    id: "E9", domainId: "E", title: "Transitions & Media Queries", minutes: 30,
    tldr: "transition on the BASE state, @keyframes for motion, @media for responsiveness. The hover-card SITE problem.",
    examTag: "MCQ + coding Q polish",
    sections: [
      { h: "Transitions", blocks: [
        { t: "code", lang: "css", src: `.btn {\n  background: #111;\n  transition: transform 0.2s ease, background 0.2s;\n}\n.btn:hover {\n  transform: translateY(-2px);\n  background: #333;\n}\n/* transition goes on the BASE state so it animates BOTH ways */` },
        { t: "p", md: "Four parts: property, duration, timing-function, delay. Putting transition only inside :hover is the classic bug — the 'un-hover' then snaps instantly. transform: translateY/scale/rotate is GPU-friendly; animating height/top is not." },
      ]},
      { h: "Keyframes & media queries", blocks: [
        { t: "code", lang: "css", src: `@keyframes pulse {\n  from { opacity: 1; }  to { opacity: 0.5; }\n}\n.flame { animation: pulse 2s infinite; }\n\n@media (max-width: 768px) {\n  .sidebar { display: none; }\n}` },
        { t: "p", md: "Mobile-first means base styles for small screens and `@media (min-width: …)` upgrades — but exams present max-width just as often. Know both readings: max-width: 768px = 'at most tablet width'." },
      ]},
    ],
    traps: [
      "transition declared inside :hover only animates hover-IN, not out.",
      "animation needs @keyframes to exist; transition doesn't.",
      "max-width vs min-width direction confusion in @media.",
    ],
    cheat: { head: ["Need", "Tool"], rows: [
      ["Smooth hover lift", "transition + :hover transform"],
      ["Looping effect", "@keyframes + animation"],
      ["Tablet style", "@media (max-width: 768px)"],
      ["Animate both ways", "transition on base state"],
    ]},
    checkpoint: [
      { q: "Where does transition go to animate hover in AND out?", a: "On the base rule, not inside :hover." },
      { q: "@media (max-width: 768px) applies when…?", a: "Viewport is at most 768px wide." },
      { q: "transition vs animation?", a: "Transition = state change; animation = keyframed sequence, can loop." },
    ],
    problemIds: ["site-hover"],
  },
  {
    id: "E10", domainId: "E", title: "JavaScript Survival Kit", minutes: 35,
    tldr: "querySelector, addEventListener, innerHTML — the minimal JS to read any exam script and build the counter/dark-mode problems.",
    examTag: "MCQs (your 0% gap — closes today)",
    sections: [
      { h: "Grab, listen, change", blocks: [
        { t: "code", lang: "html", src: `<button id="go">Click</button>\n<p id="out">0</p>\n<script>\n  const btn = document.querySelector("#go");\n  const out = document.getElementById("out");\n  let n = 0;\n  btn.addEventListener("click", () => {\n    n += 1;\n    out.innerHTML = n;         // write into the page\n    out.style.color = "green"; // change CSS from JS\n  });\n</script>` },
        { t: "p", md: "querySelector(\"#id\") / (\".class\") / (\"tag\") returns the first match; getElementById is the id-only shortcut. addEventListener(\"click\", fn) attaches behavior. innerHTML parses HTML; textContent writes plain text (safer). element.style.prop changes inline styles." },
      ]},
      { h: "Language minimum", blocks: [
        { t: "list", items: [
          "const/let (never var); template literals: `Hello ${name}`",
          "Arrow functions: (a, b) => a + b",
          "Arrays: push, length, map/filter (lazy evaluation — same lesson as Python's map!)",
          "document.querySelectorAll returns a NodeList — needs [...spread] or forEach",
        ]},
        { t: "callout", kind: "tip", md: "Dark-mode toggle in 3 lines: btn.onclick = () => document.body.classList.toggle('dark'); — classList.toggle/add/remove/remove is the exam-tested API. onclick = fn is the older but still-valid inline equivalent of addEventListener." },
      ]},
    ],
    traps: [
      "querySelector needs quotes and selector syntax: \"#id\", \".cls\" — no quotes = error.",
      "innerHTML overwrites ALL children — appending means += or createElement.",
      "const objects can't be reassigned but their contents CAN change.",
      "map/filter return new arrays; forgetting to use the result = the Python map lesson again.",
    ],
    cheat: { head: ["Task", "JS"], rows: [
      ["First .card", "document.querySelector('.card')"],
      ["On click", "el.addEventListener('click', fn)"],
      ["Set text", "el.textContent = 'hi'"],
      ["Set HTML", "el.innerHTML = '<b>hi</b>'"],
      ["Toggle class", "el.classList.toggle('dark')"],
      ["Inline style", "el.style.color = 'red'"],
    ]},
    checkpoint: [
      { q: "Two selectors for the element with id 'go'?", a: "document.querySelector('#go') or document.getElementById('go')." },
      { q: "innerHTML vs textContent?", a: "innerHTML parses/inserts HTML; textContent inserts raw text." },
      { q: "Three-line dark mode toggle?", a: "btn.onclick = () => document.body.classList.toggle('dark');" },
    ],
    problemIds: ["site-counter", "site-darkmode"],
  },
];
