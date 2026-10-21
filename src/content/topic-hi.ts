import type { Topic } from "./types";

// Domain H — CLOUD (weight 6). Strong domain; protect it.
export const TOPICS_H: Topic[] = [
  {
    id: "H1", domainId: "H", title: "Cloud Basics & Characteristics", minutes: 20,
    tldr: "Definition + NIST traits + opex vs capex. The 'which is NOT a cloud trait' MCQ family.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "Definition and the five traits", blocks: [
        { t: "p", md: "Cloud computing = on-demand delivery of compute/storage/services over the internet, pay-as-you-go. NIST traits: **on-demand self-service**, broad network access, **resource pooling** (multi-tenant), **rapid elasticity**, measured service (metered billing)." },
        { t: "list", items: [
          "Opex vs capex: cloud converts capital expenditure (buy servers) to operational expenditure (rent)",
          "Elasticity: scale UP and DOWN automatically with demand",
          "Multi-tenancy: many customers share physical hardware, logically isolated",
        ]},
      ]},
      { h: "When cloud is WRONG", blocks: [
        { t: "p", md: "Strict data-sovereignty laws, unpredictable ultra-steady workloads, ultra-low-latency requirements, or air-gapped environments — exams include a 'least suitable for cloud' option; the answer is the compliance/latency-constrained one." },
      ]},
    ],
    traps: [
      "'Buy hardware once, use for 10 years' is capex thinking — the opposite of cloud.",
      "Resource pooling means SHARED hardware with logical isolation, not private hardware.",
      "Measured service = pay for what you USE, not flat rental.",
    ],
    cheat: { head: ["Trait", "One-liner"], rows: [
      ["On-demand", "provision yourself, minutes"],
      ["Elastic", "grow/shrink with load"],
      ["Pooled", "shared hardware, isolated tenants"],
      ["Measured", "metered billing"],
    ]},
    checkpoint: [
      { q: "Cloud turns IT spend from capex to…?", a: "Opex (operational expenditure)." },
      { q: "Which trait lets you handle a traffic spike automatically?", a: "Rapid elasticity." },
      { q: "A bank avoiding cloud due to data laws is constrained by…?", a: "Data sovereignty/compliance." },
    ],
    problemIds: [],
  },
  {
    id: "H2", domainId: "H", title: "IaaS / PaaS / SaaS", minutes: 30,
    tldr: "The pizza analogy + the responsibility matrix. The single most-asked cloud MCQ family.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The pizza analogy (verbatim from your lesson)", blocks: [
        { t: "table", head: ["Model", "Pizza version", "Cloud version", "Examples"], rows: [
          ["On-prem", "cook at home from scratch", "you manage everything", "own datacenter"],
          ["IaaS", "rented kitchen, you cook", "VMs/storage/network; YOU manage OS+apps", "AWS EC2, Azure VMs"],
          ["PaaS", "pizza delivered, you bake/eat", "runtime provided; you deploy CODE only", "Heroku, App Engine"],
          ["SaaS", "restaurant, just eat", "finished app; you only USE it", "Gmail, Salesforce, M365"],
        ]},
        { t: "p", md: "Responsibility flows: IaaS you manage OS→apps; PaaS you manage only data/apps; SaaS the vendor manages everything. As you climb I→P→S, **you manage less, the provider more**." },
        { t: "callout", kind: "trap", md: "'A developer deploys code without managing servers' → PaaS. 'A company rents virtual machines' → IaaS. 'Users edit documents in a browser' → SaaS. Match the VERB: rent=machines(I), deploy=code(P), use=app(S)." },
      ]},
    ],
    traps: [
      "In IaaS the customer patches the OS — the vendor only runs the hypervisor/hardware.",
      "Gmail is SaaS, not PaaS — users don't deploy anything.",
      "PaaS hides servers but you still write and own the application code/data.",
    ],
    cheat: { head: ["You manage…", "Model"], rows: [
      ["Apps + data + OS + runtime (VM only)", "IaaS"],
      ["Apps + data only", "PaaS"],
      ["Nothing (just use)", "SaaS"],
    ]},
    mnemonic: "Pizza: IaaS = rented kitchen · PaaS = delivered base, you bake · SaaS = restaurant, just eat.",
    checkpoint: [
      { q: "EC2 virtual machine — which model?", a: "IaaS." },
      { q: "Heroku/App Engine — which model?", a: "PaaS — you push code, platform runs it." },
      { q: "Who patches the OS in SaaS?", a: "The provider — you never touch it." },
    ],
    problemIds: [],
  },
  {
    id: "H3", domainId: "H", title: "Deployment Models", minutes: 25,
    tldr: "Public / Private / Hybrid / Community — match the scenario to the model.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "The four models", blocks: [
        { t: "table", head: ["Model", "Who uses it", "Trade-off"], rows: [
          ["Public", "everyone (AWS, Azure, GCP)", "cheap, less control"],
          ["Private", "ONE org, on/off-prem", "control + compliance, costly"],
          ["Hybrid", "mix: sensitive on private, burst on public", "flexible, complex"],
          ["Community", "several orgs with shared needs", "shared cost, niche"],
        ]},
        { t: "callout", kind: "trap", md: "Scenario matches: 'bank with regulatory needs' → Private (or Hybrid). 'Startup with spiky traffic, no capex' → Public. 'Government departments sharing one cloud' → Community. 'Keep data in-house, burst to cloud for campaigns' → Hybrid. These four sentences ARE the exam." },
      ]},
    ],
    traps: [
      "Private cloud ≠ on-prem only — it can be hosted off-site by a vendor for one org.",
      "Hybrid's whole point is mixing sensitivity levels and burst capacity.",
      "Public cloud can still be very secure — 'public' refers to sharing, not insecurity.",
    ],
    cheat: { head: ["Scenario", "Model"], rows: [
      ["Startup, spiky, no capex", "Public"],
      ["Bank, compliance-heavy", "Private/Hybrid"],
      ["Burst to cloud for peak", "Hybrid (cloud bursting)"],
      ["Universities sharing research cloud", "Community"],
    ]},
    checkpoint: [
      { q: "Cloud bursting is a feature of which model?", a: "Hybrid." },
      { q: "One org, isolated infrastructure — even if vendor-hosted?", a: "Private cloud." },
      { q: "Several hospitals sharing one platform?", a: "Community cloud." },
    ],
    problemIds: [],
  },
  {
    id: "H4", domainId: "H", title: "Virtualization & Hypervisors", minutes: 25,
    tldr: "Type 1 bare-metal vs Type 2 hosted — your known gap. VM vs container in one line.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "Hypervisor types", blocks: [
        { t: "table", head: ["Type", "Runs on", "Examples", "Where"], rows: [
          ["Type 1 (bare-metal)", "directly on hardware", "VMware ESXi, Xen, Hyper-V", "datacenters/production"],
          ["Type 2 (hosted)", "on a host OS", "VirtualBox, VMware Workstation", "laptops/dev"],
        ]},
        { t: "callout", kind: "trap", md: "The exam's favorite cloud question after SaaS/PaaS: 'Which is a Type 1 hypervisor?' — ESXi/Xen (bare-metal). VirtualBox is ALWAYS Type 2. Type 1 is faster/more secure because there's no host OS layer underneath." },
      ]},
      { h: "VM vs container, one line each", blocks: [
        { t: "list", items: [
          "VM: full OS per guest on a hypervisor — heavy isolation",
          "Container: shares the host kernel — light, seconds to start (Docker)",
          "Snapshot: point-in-time state of a VM (disk+memory) — fast rollback",
          "Thin provisioning: allocate storage on demand, not upfront",
        ]},
      ]},
    ],
    traps: [
      "VirtualBox = Type 2, always.",
      "Containers virtualize the OS, hypervisors virtualize the hardware.",
      "Type 1 sits on bare metal — no host OS — hence 'bare-metal'.",
    ],
    cheat: { head: ["Item", "Answer"], rows: [
      ["ESXi / Xen / Hyper-V", "Type 1"],
      ["VirtualBox / Workstation", "Type 2"],
      ["Shares host kernel", "Container"],
      ["Full guest OS", "VM"],
    ]},
    checkpoint: [
      { q: "VirtualBox — which type and why?", a: "Type 2 — it installs on top of a host OS." },
      { q: "Why is Type 1 preferred in datacenters?", a: "No host-OS layer → better performance/security." },
      { q: "VM vs container kernel sharing?", a: "Containers share the host kernel; VMs run their own." },
    ],
    problemIds: [],
  },
  {
    id: "H5", domainId: "H", title: "Providers & Services Tour", minutes: 20,
    tldr: "AWS/Azure/GCP name-mapping table + serverless one-liner. Light but reliable marks.",
    examTag: "≈1-2 of 45 MCQs",
    sections: [
      { h: "Name mapping", blocks: [
        { t: "table", head: ["Service", "AWS", "Azure", "GCP"], rows: [
          ["Compute (VM)", "EC2", "Virtual Machines", "Compute Engine"],
          ["Object storage", "S3", "Blob Storage", "Cloud Storage"],
          ["Serverless fn", "Lambda", "Functions", "Cloud Functions"],
          ["Managed DB (SQL)", "RDS", "SQL Database", "Cloud SQL"],
        ]},
        { t: "p", md: "**Serverless**: you upload code, the provider runs it per-request with zero server management and scales to zero — billing per invocation/duration, not per hour. 'Lambda is an example of…' → serverless compute (still under IaaS/PaaS umbrella discussions, but the exam answer is serverless/FaaS)." },
      ]},
    ],
    traps: [
      "S3 = object storage (infinite buckets), not block/disk storage.",
      "Lambda = functions-as-a-service; you never see the server.",
      "RDS is MANAGED relational DB — AWS patches it (PaaS-ish).",
    ],
    cheat: { head: ["Need", "AWS answer"], rows: [
      ["Rent a VM", "EC2"],
      ["Store files/objects", "S3"],
      ["Run code per-request", "Lambda"],
      ["Managed MySQL", "RDS"],
    ]},
    checkpoint: [
      { q: "Azure's VM service name?", a: "Azure Virtual Machines." },
      { q: "What does 'serverless' actually mean?", a: "No server management for YOU — servers exist, the provider runs them." },
      { q: "S3 storage type?", a: "Object storage." },
    ],
    problemIds: [],
  },
  {
    id: "H6", domainId: "H", title: "Cloud Pros, Cons & Rapid-Fire Traps", minutes: 25,
    tldr: "Ten rapid-fire MCQs mixing everything from H1–H5 — the final polish for a strong domain.",
    examTag: "mixed drill",
    sections: [
      { h: "Pros and cons", blocks: [
        { t: "list", items: [
          "Pros: scalability, elasticity, opex model, global reach, managed services, fast provisioning",
          "Cons: internet dependency, outage risk, vendor lock-in, compliance limits, ongoing cost at scale",
          "Vendor lock-in: deep integration with one provider makes migration expensive",
        ]},
      ]},
      { h: "Rapid-fire drill (cover answers, self-quiz)", blocks: [
        { t: "list", items: [
          "Multi-tenant but isolated → resource pooling",
          "Pay per second of usage → measured service",
          "Bank keeps core banking private, analytics on AWS → Hybrid",
          "VirtualBox → Type 2 hypervisor",
          "EC2 → IaaS · Heroku → PaaS · Gmail → SaaS",
          "Scales to zero, per-invocation billing → Serverless/FaaS",
          "DDoS on a SaaS provider hits which pillar → Availability",
          "Data sovereignty concern blocks which deployment → Public (jurisdiction)",
        ]},
      ]},
    ],
    traps: [
      "'Cloud is always cheaper' — FALSE option; steady huge workloads can be cheaper on-prem.",
      "'Cloud is only for big companies' — FALSE; startups benefit most from opex.",
      "Elasticity ≠ scalability: elastic = automatic in/out; scalable = can grow (possibly manually).",
    ],
    cheat: { head: ["Claim", "Verdict"], rows: [
      ["Cloud always cheaper", "False"],
      ["Multi-tenant = insecure", "False (logical isolation)"],
      ["Hybrid = private + public mix", "True"],
      ["Lambda = IaaS VM", "False (serverless)"],
    ]},
    checkpoint: [
      { q: "Elasticity vs scalability?", a: "Elastic: automatic scale both ways; scalable: ability to grow." },
      { q: "Biggest strategic downside of going all-in on one provider?", a: "Vendor lock-in." },
      { q: "'Rent machines' vs 'deploy code' vs 'just use' — models in order?", a: "IaaS, PaaS, SaaS." },
    ],
    problemIds: [],
  },
];

// Domain I — OFFICE & CLI (weight 5). Weakest 'easy' domain — VLOOKUP day.
export const TOPICS_I: Topic[] = [
  {
    id: "I1", domainId: "I", title: "Excel Functions (VLOOKUP day)", minutes: 35,
    tldr: "You have NEVER learned VLOOKUP. This is the single highest-value Office topic. TODAY vs NOW was your exact MCQ miss.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "VLOOKUP — finally", blocks: [
        { t: "code", lang: "text", src: `=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])\n\n=VLOOKUP("A102", A2:D50, 4, FALSE)\n         ↑ find this   ↑ the table  ↑ 4th column  ↑ EXACT match\n\n# Reads: "find A102 in the FIRST column of A2:D50;\n#  return the value from the 4th column of that row."` },
        { t: "callout", kind: "trap", md: "VLOOKUP's last argument: FALSE = exact match, TRUE = approximate (and needs sorted data). Default is TRUE — it WILL betray you on unsorted data. Always write FALSE. And the lookup value must be in the FIRST column of the range — VLOOKUP only looks right, never left." },
        { t: "list", items: [
          "#N/A means: value not found in the first column (or wrong exact/approx mode)",
          "col_index_num counts from the LEFT EDGE of table_array, not from column A",
          "HLOOKUP is the same thing sideways (searches first ROW, returns from row n)",
          "XLOOKUP is the modern replacement (both directions) — know the name",
        ]},
      ]},
      { h: "The conditional family", blocks: [
        { t: "code", lang: "text", src: `=COUNTIF(A1:A100, ">80")          → count cells > 80\n=SUMIF(B:B, "North", C:C)        → sum C where B = North\n=AVERAGEIF(A:A, "Pass", B:B)     → avg B where A = Pass\n=IF(B2>=40, "Pass", "Fail")      → condition, then, else\n=IF(B2>=90,"A",IF(B2>=75,"B","C"))  → nested IF\n=CONCATENATE(A2, " ", B2)  or  =A2 & " " & B2\n=LEN(A2)   =LEFT(A2,3)   =RIGHT(A2,2)   =MID(A2,2,4)` },
      ]},
      { h: "TODAY vs NOW (your miss, verbatim)", blocks: [
        { t: "callout", kind: "trap", md: "TODAY() gives the date. NOW() gives date AND time. The MCQ showed both and asked 'returns current date and time' — the answer was NOW(), not TODAY(). VLOOKUP's last argument is FALSE for exact match — default TRUE will betray you. Both of these are yours now." },
        { t: "table", head: ["Function", "Returns"], rows: [
          ["TODAY()", "current date (updates daily)"],
          ["NOW()", "current date AND time"],
          ["COUNT / COUNTA", "numbers / non-empty cells"],
          ["ROUND(x, 2)", "round to 2 decimals"],
        ]},
      ]},
    ],
    traps: [
      "VLOOKUP default is approximate (TRUE) — exam options count on you forgetting.",
      "VLOOKUP can't look left — that's XLOOKUP's selling point.",
      "TODAY() has no arguments; typing TODAY() wrong is a #NAME? error.",
      "COUNT counts numbers only; COUNTA counts any non-empty cell.",
    ],
    cheat: { head: ["Task", "Formula"], rows: [
      ["Fetch price by ID", "=VLOOKUP(id, range, col, FALSE)"],
      ["Count > 80", "=COUNTIF(range, \">80\")"],
      ["Sum by region", "=SUMIF(B:B,\"North\",C:C)"],
      ["Pass/Fail", "=IF(B2>=40,\"Pass\",\"Fail\")"],
      ["Date only", "=TODAY()"],
      ["Date + time", "=NOW()"],
    ]},
    mnemonic: "TODAY = date. NOW = now-with-time. VLOOKUP: FALSE for exact — default TRUE will betray you.",
    checkpoint: [
      { q: "VLOOKUP('A102', A2:D50, 4, FALSE) — what does 4 mean?", a: "Return the 4th column of the range A2:D50 (i.e., column D)." },
      { q: "Which function returns date and time?", a: "NOW()." },
      { q: "Sum C2:C100 where B says 'North'?", a: "=SUMIF(B:B,\"North\",C:C)." },
    ],
    problemIds: [],
  },
  {
    id: "I2", domainId: "I", title: "Excel Essentials & Shortcuts", minutes: 25,
    tldr: "Cell refs (the $ trap), fill handle, sorting vs filtering, and the ten shortcuts exams quote.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "References", blocks: [
        { t: "table", head: ["Ref", "Copied down/right →"], rows: [
          ["A1", "both change (relative)"],
          ["$A$1", "never changes (absolute)"],
          ["$A1", "column frozen, row moves"],
          ["A$1", "row frozen, column moves"],
        ]},
        { t: "p", md: "The $ freezes whichever coordinate it prefixes. F4 cycles through the four states while editing a formula. Fill handle = the little square at a selection's corner; double-click it to copy down alongside neighboring data." },
      ]},
      { h: "Shortcuts that appear as MCQs", blocks: [
        { t: "list", items: [
          "Ctrl+C / V / X / Z — copy/paste/cut/undo",
          "Ctrl+Shift+L — toggle filter",
          "F2 — edit cell",
          "Ctrl+; — insert today's date (static!)",
          "Ctrl+Home — jump to A1",
          "Alt+= — AutoSum",
        ]},
        { t: "p", md: "Sorting rearranges rows permanently (within the sort); filtering HIDES non-matching rows without moving anything. Freeze Panes locks header rows/columns while scrolling. Conditional formatting colors cells by rule — no formula writing needed." },
      ]},
    ],
    traps: [
      "Ctrl+; inserts a STATIC date — TODAY() is dynamic. Different answers to 'insert current date'.",
      "Filter hides; sort moves. Read the question's verb.",
      "$A1 vs A$1 — the $ is right before what it freezes.",
    ],
    cheat: { head: ["Keys", "Action"], rows: [
      ["Ctrl+Shift+L", "filter toggle"],
      ["F2", "edit cell"],
      ["Ctrl+;", "static today"],
      ["Alt+=", "AutoSum"],
      ["F4", "cycle $ refs"],
    ]},
    checkpoint: [
      { q: "Keep column A fixed while copying right?", a: "$A1 — $ before the column letter." },
      { q: "Shortcut to toggle filters?", a: "Ctrl+Shift+L." },
      { q: "Static date vs dynamic date?", a: "Ctrl+; static · =TODAY() dynamic." },
    ],
    problemIds: [],
  },
  {
    id: "I3", domainId: "I", title: "Word & PowerPoint Essentials", minutes: 20,
    tldr: "Styles vs manual formatting, TOC, track changes; slide master, presenter view. Small, easy marks.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "Word", blocks: [
        { t: "list", items: [
          "Styles (Heading 1/2) drive automatic Table of Contents — manual formatting doesn't",
          "Track Changes records every edit with author + time; Accept/Reject finalizes",
          "Mail merge: one template + data source → personalized letters",
          "Ctrl+Enter = page break (Ctrl+Shift+N new doc in some versions — know Ctrl+Enter)",
        ]},
      ]},
      { h: "PowerPoint", blocks: [
        { t: "list", items: [
          "Slide Master: edit once, applies to all slides using that layout",
          "Presenter View: notes + next slide on YOUR screen only",
          "Transitions = between slides; Animations = on objects — the swap trap",
          "Ctrl+M new slide; F5 from start, Shift+F5 from current slide",
        ]},
      ]},
    ],
    traps: [
      "Transitions are slide-to-slide; animations are element-level — reversed options are the trap.",
      "TOC needs Heading STYLES, not bold text.",
      "Presenter view shows notes privately — audience sees only the slide.",
    ],
    cheat: { head: ["Feature", "App"], rows: [
      ["Track Changes", "Word"],
      ["Mail Merge", "Word"],
      ["Slide Master", "PowerPoint"],
      ["Presenter View", "PowerPoint"],
    ]},
    checkpoint: [
      { q: "Auto TOC requires what?", a: "Heading styles applied to titles." },
      { q: "Transitions vs animations?", a: "Transitions between slides; animations on objects." },
      { q: "Feature recording who changed what?", a: "Track Changes." },
    ],
    problemIds: [],
  },
  {
    id: "I4", domainId: "I", title: "Command Line", minutes: 30,
    tldr: "ipconfig/ping/tracert/nslookup and file commands. 'Which shows your IP' is the trap you must not fall for.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "Network commands (Windows)", blocks: [
        { t: "table", head: ["Command", "Shows"], rows: [
          ["ipconfig", "YOUR IP, subnet, gateway"],
          ["ipconfig /all", "+ MAC, DHCP, DNS servers"],
          ["ping host", "reachability + round-trip time"],
          ["tracert host", "hop-by-hop route to host"],
          ["nslookup name", "DNS resolution of a name"],
        ]},
        { t: "callout", kind: "trap", md: "'Which command shows YOUR machine's IP address?' → ipconfig, NOT ping. ping tests REACHABILITY of a target. tracert shows the PATH. nslookup resolves NAMES. Four commands, four jobs — the exam mixes their definitions in the options." },
      ]},
      { h: "File system commands", blocks: [
        { t: "code", lang: "bash", src: `# Windows CMD / PowerShell\ncd ..          # up one dir\ndir            # list (cmd)\nmkdir sniper   # make dir\ndel file.txt   # delete file\ncls            # clear screen\n\n# Linux glance\nls / pwd / cd / mkdir / rm\ncat file       # print file\nchmod +x run.sh # make executable (one-liner only)` },
        { t: "p", md: "Mapping: dir (Win) = ls (Linux); cls = clear; del = rm. `ping 127.0.0.1` tests your own TCP/IP stack. The exam pairs each command with its purpose and shuffles them — learn purpose-first." },
      ]},
    ],
    traps: [
      "ipconfig shows YOUR IP; ping checks ANOTHER host's reachability.",
      "nslookup does DNS lookups, not connectivity.",
      "tracert lists routers (hops) between you and the target.",
    ],
    cheat: { head: ["Goal", "Command"], rows: [
      ["My IP", "ipconfig"],
      ["Is host alive", "ping host"],
      ["Route hops", "tracert host"],
      ["Name → IP", "nslookup name"],
      ["Full adapter info", "ipconfig /all"],
    ]},
    checkpoint: [
      { q: "Show your machine's IP configuration?", a: "ipconfig." },
      { q: "See every router between you and google.com?", a: "tracert google.com." },
      { q: "Check whether a name resolves and to what?", a: "nslookup." },
    ],
    problemIds: [],
  },
];
