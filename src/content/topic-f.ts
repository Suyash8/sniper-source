import type { Topic } from "./types";

// Domain F — NETWORKING (weight 10). Concepts solid; the port table is the gap.
export const TOPICS_F: Topic[] = [
  {
    id: "F1", domainId: "F", title: "Network Fundamentals & Topologies", minutes: 25,
    tldr: "LAN/MAN/WAN scale ladder, the four topologies with one pro/con each. Easy MCQ marks.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "Scale ladder", blocks: [
        { t: "table", head: ["Type", "Span", "Example"], rows: [
          ["PAN", "personal (~10 m)", "Bluetooth headset"],
          ["LAN", "building/campus", "College lab network"],
          ["MAN", "city", "Cable TV network"],
          ["WAN", "country/world", "The Internet"],
        ]},
        { t: "p", md: "Client-server: dedicated servers provide services. Peer-to-peer: every node is both client and server (file sharing). Bandwidth = capacity (bits/s); latency = delay — a wide pipe can still be slow." },
      ]},
      { h: "Topologies", blocks: [
        { t: "table", head: ["Topology", "Shape", "Weak point"], rows: [
          ["Star", "all nodes → central hub/switch", "the center dies = all die"],
          ["Bus", "one backbone cable", "backbone break splits net"],
          ["Ring", "each node → 2 neighbors", "one break can stop ring"],
          ["Mesh", "everything ↔ everything", "cost & cabling (n(n−1)/2 links)"],
        ]},
        { t: "p", md: "Exam defaults: office network = star; internet backbone vibes = mesh; 'most fault-tolerant' = mesh; 'cheapest to install' = bus." },
      ]},
    ],
    traps: [
      "Star's single point of failure is the central device — not the nodes.",
      "Mesh links formula n(n−1)/2 for full mesh.",
      "LAN ≠ internet: internet is the biggest WAN.",
    ],
    cheat: { head: ["Ask", "Answer"], rows: [
      ["Office/building network", "LAN"],
      ["Central device failure kills all", "Star topology"],
      ["Most reliable, most expensive", "Mesh"],
      ["City-scale", "MAN"],
    ]},
    checkpoint: [
      { q: "College lab full of PCs sharing a switch?", a: "LAN (star topology)." },
      { q: "Weak point of star topology?", a: "The central hub/switch." },
      { q: "Links in a full mesh of 5 nodes?", a: "5×4/2 = 10." },
    ],
    problemIds: [],
  },
  {
    id: "F2", domainId: "F", title: "OSI 7 Layers", minutes: 30,
    tldr: "Layer story + which protocols/devices live where. The single most predictable networking MCQ family.",
    examTag: "≈4 of 45 MCQs",
    sections: [
      { h: "The layers, bottom-up", blocks: [
        { t: "table", head: ["#", "Layer", "Job", "Lives here"], rows: [
          ["7", "Application", "user-facing protocols", "HTTP, FTP, SMTP, DNS"],
          ["6", "Presentation", "format/encrypt/compress", "TLS/SSL, JPEG"],
          ["5", "Session", "open/manage/close dialogs", "session mgmt, RPC"],
          ["4", "Transport", "end-to-end delivery", "TCP, UDP, ports"],
          ["3", "Network", "routing, logical addressing", "IP, ICMP, routers"],
          ["2", "Data Link", "node-to-node frames, MAC", "switches, Ethernet"],
          ["1", "Physical", "bits on the wire", "cables, hubs, voltages"],
        ]},
        { t: "callout", kind: "memo", md: "Mnemonic: Please Do Not Throw Sausage Pizza Away (bottom → top). Story: the courier packs your gift (data) — box by box (segments→packets→frames), each layer adds its own wrapper; the receiver unwraps in reverse." },
      ]},
      { h: "Encapsulation order", blocks: [
        { t: "p", md: "Data → Segment (L4, add ports) → Packet (L3, add IPs) → Frame (L2, add MACs) → Bits (L1). The exam asks 'in what unit does layer 3 carry data?' → Packet. And 'which layer does a router work at?' → Layer 3 — the exact B12 question you corrected." },
      ]},
    ],
    traps: [
      "Router = L3 (Network). Switch = L2 (Data Link). Hub = L1 (Physical). This exact triple was your one MCQ miss.",
      "TCP/UDP and ports are Transport (L4); IP is Network (L3) — don't mix.",
      "Encryption often lands on Presentation (L6) in exam answers.",
    ],
    cheat: { head: ["Layer", "Device/Protocol"], rows: [
      ["L1 Physical", "hub, cables, repeater"],
      ["L2 Data Link", "switch, MAC, Ethernet"],
      ["L3 Network", "router, IP, ICMP"],
      ["L4 Transport", "TCP, UDP, ports"],
      ["L7 Application", "HTTP, DNS, SMTP, FTP"],
    ]},
    mnemonic: "Please Do Not Throw Sausage Pizza Away — Physical, Data link, Network, Transport, Session, Presentation, Application.",
    checkpoint: [
      { q: "Router works at which layer?", a: "Layer 3 — Network (your B12 fix)." },
      { q: "TCP lives at layer…?", a: "4 — Transport." },
      { q: "PDU at layer 3?", a: "Packet." },
    ],
    problemIds: [],
  },
  {
    id: "F3", domainId: "F", title: "TCP vs UDP", minutes: 25,
    tldr: "Reliable connection vs fast fire-and-forget. Handshake steps and the app-to-protocol mapping.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The two transports", blocks: [
        { t: "table", head: ["", "TCP", "UDP"], rows: [
          ["Connection", "connection-oriented (3-way handshake)", "connectionless"],
          ["Reliability", "guaranteed, ordered, retransmits", "best-effort, may drop"],
          ["Speed", "slower (overhead)", "faster"],
          ["Use", "web, email, files", "DNS, video, gaming, VoIP"],
        ]},
        { t: "p", md: "Three-way handshake: **SYN → SYN-ACK → ACK**. Browser (client) opens with SYN; server acknowledges + opens its own (SYN-ACK); client confirms (ACK). Exams ask the order and the count (3)." },
      ]},
      { h: "Which app uses which", blocks: [
        { t: "list", items: [
          "HTTP/HTTPS, SMTP, FTP, SSH → TCP (can't lose data)",
          "DNS lookup, DHCP → UDP (small, fast queries)",
          "Live video/voice, online games → UDP (fresh beats complete)",
          "File transfer → TCP (integrity matters)",
        ]},
      ]},
    ],
    traps: [
      "DNS uses UDP (port 53) despite being 'important' — small queries don't need TCP.",
      "Video streaming uses UDP because timeliness > completeness.",
      "Handshake is SYN, SYN-ACK, ACK — not SYN, ACK, SYN.",
    ],
    cheat: { head: ["App", "Protocol"], rows: [
      ["Web browsing", "TCP (80/443)"],
      ["DNS", "UDP (53)"],
      ["Email send", "TCP SMTP (25)"],
      ["Video call", "UDP"],
      ["File download", "TCP"],
    ]},
    checkpoint: [
      { q: "Three-way handshake order?", a: "SYN → SYN-ACK → ACK." },
      { q: "Why UDP for live video?", a: "Fresh frames beat complete ones — no time to retransmit." },
      { q: "Which transport guarantees ordered delivery?", a: "TCP." },
    ],
    problemIds: [],
  },
  {
    id: "F4", domainId: "F", title: "Network Devices", minutes: 25,
    tldr: "Hub shouts, switch remembers, router routes. One line each — and it was your only Round-2 MCQ miss.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The ladder", blocks: [
        { t: "table", head: ["Device", "Layer", "One-liner"], rows: [
          ["Hub", "L1", "dumb repeater — blasts every bit to every port"],
          ["Switch", "L2", "learns MAC→port table, forwards frames only where needed"],
          ["Router", "L3", "routes packets between networks using IP addresses"],
          ["Modem", "—", "modulates digital ↔ analog (ISP bridge)"],
          ["Access Point", "L2", "adds Wi-Fi to a wired LAN"],
        ]},
        { t: "callout", kind: "memo", md: "Hub L1 shouts. Switch L2 remembers MACs. Router L3 speaks IP. Your B12 miss was 'router is which layer' — it's Layer 3, Network. Never again." },
      ]},
      { h: "Collision domains", blocks: [
        { t: "p", md: "Hub = ONE collision domain for everyone (collisions everywhere). Switch = one collision domain PER port (collisions vanish). Router additionally separates **broadcast domains**. 'Which device reduces collisions?' → switch. 'Which separates broadcast domains?' → router." },
      ]},
    ],
    traps: [
      "Router = L3, not L2 — the question you missed.",
      "Switch uses MAC addresses (L2); router uses IPs (L3).",
      "Hub creates one giant collision domain; a switch carves one per port.",
    ],
    cheat: { head: ["Device", "Address it uses"], rows: [
      ["Hub", "none (blind repeat)"],
      ["Switch", "MAC (L2)"],
      ["Router", "IP (L3)"],
      ["Firewall", "IP/rules (L3-L7)"],
    ]},
    checkpoint: [
      { q: "Which device learns a MAC address table?", a: "Switch (Layer 2)." },
      { q: "Which device separates broadcast domains?", a: "Router (Layer 3)." },
      { q: "Why is a hub wasteful?", a: "It repeats every frame to every port — one collision domain." },
    ],
    problemIds: [],
  },
  {
    id: "F5", domainId: "F", title: "IP Addressing", minutes: 30,
    tldr: "IPv4 structure, private ranges, classes. Subnetting basics: network vs host bits.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "IPv4 anatomy", blocks: [
        { t: "p", md: "32 bits, four dotted octets (0-255 each): 192.168.1.10. The subnet mask splits network | host: /24 = 255.255.255.0 = first 3 octets are the network. Hosts all-zero = network address, all-ones = broadcast — neither is assignable." },
      ]},
      { h: "Private ranges (memorize)", blocks: [
        { t: "table", head: ["Class", "Private range", "Default mask"], rows: [
          ["A", "10.0.0.0 – 10.255.255.255", "/8"],
          ["B", "172.16.0.0 – 172.31.255.255", "/16"],
          ["C", "192.168.0.0 – 192.168.255.255", "/24"],
        ]},
        { t: "p", md: "Private IPs aren't routable on the internet; **NAT** translates them to the public IP at the router. DHCP hands out IPs automatically vs static manual configuration. IPv6 = 128-bit, eight hex groups, solves exhaustion. Loopback 127.0.0.1 = localhost." },
      ]},
    ],
    traps: [
      "172.16.x.x is private; 172.32.x.x is public — the range ends at 31.",
      "127.0.0.1 is loopback, not a network address.",
      "Class C private starts 192.168 — the exam's favorite.",
    ],
    cheat: { head: ["Item", "Value"], rows: [
      ["IPv4 size", "32 bits"],
      ["Private C", "192.168.0.0/16"],
      ["Loopback", "127.0.0.1"],
      ["/24 mask", "255.255.255.0"],
      ["IPv6 size", "128 bits"],
    ]},
    checkpoint: [
      { q: "Which of 10.5.5.5 / 172.32.1.1 / 192.169.1.1 is private?", a: "10.5.5.5 only (172.32 > 31, 192.169 ≠ 192.168)." },
      { q: "What does NAT do?", a: "Translates private LAN IPs to the shared public IP." },
      { q: "/24 means?", a: "24 network bits → 255.255.255.0." },
    ],
    problemIds: [],
  },
  {
    id: "F6", domainId: "F", title: "The Ports Table", minutes: 30,
    tldr: "The gap in your networking armor. Three chunk-groups + elimination strategy = full marks.",
    examTag: "≈2 of 45 MCQs (guaranteed ask)",
    sections: [
      { h: "Three chunks, one table", blocks: [
        { t: "callout", kind: "memo", md: "Ports in three chunks: 21/22/23 are siblings (FTP/SSH/Telnet). 25/110/143 is the mail line — 143 = I-love-you (IMAP). 80/443 is the web pair. Learn the CHUNKS, not 9 random numbers." },
        { t: "table", head: ["Port", "Protocol", "Chunk"], rows: [
          ["21", "FTP (file transfer)", "siblings"],
          ["22", "SSH (secure shell)", "siblings"],
          ["23", "Telnet (insecure shell)", "siblings"],
          ["25", "SMTP (send mail)", "mail line"],
          ["53", "DNS", "solo — 5+3, phone-book of the net"],
          ["80", "HTTP", "web pair"],
          ["110", "POP3 (download mail)", "mail line"],
          ["143", "IMAP (sync mail)", "I-love-you"],
          ["443", "HTTPS (HTTP+TLS)", "web pair"],
        ]},
      ]},
      { h: "Elimination strategy", blocks: [
        { t: "list", items: [
          "Options for HTTPS: 22, 80, 443, 8080 → 443 (80 is plain HTTP; 22 is SSH — siblings chunk)",
          "Mail questions: SEND = 25 (SMTP), DOWNLOAD = 110 (POP3), SYNC = 143 (IMAP)",
          "Anything 'secure remote login' = 22 (SSH); 'insecure' = 23 (Telnet)",
          "Sedond-tier: MySQL 3306, RDP 3389 — know they exist, not cold",
        ]},
      ]},
    ],
    traps: [
      "SMTP 25 SENDS mail; it doesn't receive — the classic swap with POP3/IMAP.",
      "HTTPS is 443, HTTP is 80 — never reverse.",
      "Telnet 23 is plaintext; SSH 22 is encrypted.",
    ],
    cheat: { head: ["Port", "Protocol"], rows: [
      ["21/22/23", "FTP/SSH/Telnet"],
      ["25/110/143", "SMTP/POP3/IMAP"],
      ["53", "DNS"], ["80/443", "HTTP/HTTPS"],
      ["3306", "MySQL"], ["3389", "RDP"],
    ]},
    mnemonic: "21/22/23 siblings · mail line 25/110/143 (143 = I-love-you) · web pair 80/443.",
    checkpoint: [
      { q: "IMAP port and why it sticks?", a: "143 — 'I-love-you' (I-M-A-P ~ I-L-Y on a phone pad vibe)." },
      { q: "Protocol that SENDS email and its port?", a: "SMTP, port 25." },
      { q: "HTTPS port?", a: "443." },
    ],
    problemIds: [],
  },
  {
    id: "F7", domainId: "F", title: "HTTP/HTTPS & DNS", minutes: 30,
    tldr: "Methods, status codes, the TLS upgrade, and how a name becomes an IP.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "HTTP methods & status codes", blocks: [
        { t: "table", head: ["Method", "Meaning"], rows: [
          ["GET", "fetch a resource"],
          ["POST", "submit data (create)"],
          ["PUT", "replace a resource"],
          ["DELETE", "remove a resource"],
        ]},
        { t: "table", head: ["Code", "Meaning"], rows: [
          ["200", "OK"],
          ["301", "moved permanently (redirect)"],
          ["404", "not found"],
          ["500", "server error"],
          ["403", "forbidden"],
        ]},
      ]},
      { h: "HTTPS & DNS flow", blocks: [
        { t: "p", md: "HTTPS = HTTP inside TLS: certificate from a **Certificate Authority** proves the server's identity, keys are exchanged, everything after is encrypted. HTTP stateless + cookies for state. DNS flow: browser cache → OS cache → resolver → root → TLD (.com) → authoritative → answer. Port 53, usually UDP." },
        { t: "list", items: [
          "Type 'google.com' → DNS resolves to IP → TCP connect (443) → TLS handshake → HTTP request → response",
          "Certificate warning = identity can't be verified (MITM risk)",
        ]},
      ]},
    ],
    traps: [
      "404 = resource missing (client-side); 500 = server broke (server-side).",
      "HTTPS encrypts transport, not the URL's domain (SNI) — MCQ-level nuance.",
      "DNS primarily runs over UDP 53.",
    ],
    cheat: { head: ["Code", "Class"], rows: [
      ["2xx", "success"],
      ["3xx", "redirect"],
      ["4xx", "client error"],
      ["5xx", "server error"],
      ["443", "HTTPS port"],
    ]},
    checkpoint: [
      { q: "Status code for 'page not found'?", a: "404." },
      { q: "What does a CA certificate prove?", a: "The server's identity — you're talking to the real site." },
      { q: "First step after typing a URL?", a: "DNS resolution (name → IP)." },
    ],
    problemIds: [],
  },
  {
    id: "F8", domainId: "F", title: "Email Protocols", minutes: 20,
    tldr: "SMTP sends; POP3 downloads; IMAP syncs. One sentence each + the port triple from F6.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "The trio", blocks: [
        { t: "table", head: ["Protocol", "Port", "Job"], rows: [
          ["SMTP", "25 (465/587 secure)", "SEND/push mail between clients & servers"],
          ["POP3", "110", "DOWNLOAD to one device, usually deletes server copy"],
          ["IMAP", "143 (993 secure)", "SYNC across devices, mail stays on server"],
        ]},
        { t: "p", md: "Memory: SMTP = 'Simple Mail Transfer' — transfer = send. POP3 = 'Post Office Protocol' — collect your letters and take them home. IMAP = 'Internet Message Access Protocol' — mail lives at the office, you view it anywhere (why phone+laptop stay in sync)." },
        { t: "callout", kind: "trap", md: "'Which protocol receives email?' → POP3 or IMAP, NEVER SMTP. 'Which keeps messages on the server for multi-device sync?' → IMAP. These two questions cover 90% of email MCQs." },
      ]},
    ],
    traps: [
      "SMTP is for sending (and server-to-server relay), not for reading.",
      "POP3 typically deletes after download; IMAP keeps everything server-side.",
      "Secure variants ride 465/587 (SMTP), 993 (IMAPS), 995 (POP3S).",
    ],
    cheat: { head: ["Action", "Protocol:Port"], rows: [
      ["Send", "SMTP:25"],
      ["Download (one device)", "POP3:110"],
      ["Sync (many devices)", "IMAP:143"],
    ]},
    checkpoint: [
      { q: "Reading mail on phone AND laptop — which protocol?", a: "IMAP (server-side sync)." },
      { q: "SMTP's port?", a: "25." },
      { q: "POP3 vs IMAP core difference?", a: "POP3 downloads (usually removes); IMAP leaves mail on the server." },
    ],
    problemIds: [],
  },
];
