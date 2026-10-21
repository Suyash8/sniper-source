import type { Topic } from "./types";

// Domain G — SECURITY (weight 8). Encryption solid after Lesson 1; keep it.
export const TOPICS_G: Topic[] = [
  {
    id: "G1", domainId: "G", title: "CIA Triad", minutes: 20,
    tldr: "Confidentiality, Integrity, Availability — the three pillars every security question secretly maps to.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "The triad", blocks: [
        { t: "table", head: ["Pillar", "Meaning", "Attacked by"], rows: [
          ["Confidentiality", "only authorized can READ", "eavesdropping, leaks"],
          ["Integrity", "data can't be silently CHANGED", "tampering, MITM"],
          ["Availability", "systems work WHEN needed", "DDoS, ransomware"],
        ]},
        { t: "p", md: "Authentication = proving WHO you are (password, biometric). Authorization = what you may DO (permissions). The exam's classic: 'DDoS attacks which pillar?' → Availability. 'Checksums protect…' → Integrity." },
      ]},
    ],
    traps: [
      "DDoS → Availability, always.",
      "Digital signatures → Integrity + non-repudiation.",
      "Encryption → Confidentiality (not integrity — that's hashing).",
    ],
    cheat: { head: ["Scenario", "Pillar"], rows: [
      ["Encrypted database", "Confidentiality"],
      ["Hash on download", "Integrity"],
      ["DDoS mitigation", "Availability"],
    ]},
    checkpoint: [
      { q: "DDoS attacks which pillar?", a: "Availability." },
      { q: "Authentication vs authorization?", a: "Who you are vs what you may do." },
      { q: "Downloading a file and checking its hash protects…?", a: "Integrity." },
    ],
    problemIds: [],
  },
  {
    id: "G2", domainId: "G", title: "Symmetric vs Asymmetric Encryption", minutes: 30,
    tldr: "Your Lesson-1 money. AES/DES same key; RSA/ECC key pairs. The exam tests exactly this split.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The two families", blocks: [
        { t: "table", head: ["", "Symmetric", "Asymmetric"], rows: [
          ["Keys", "ONE shared key", "public + private pair"],
          ["Speed", "fast", "slow (~1000×)"],
          ["Algorithms", "AES, DES, 3DES", "RSA, ECC, Diffie-Hellman"],
          ["Use", "bulk data (file/db/tls-body)", "key exchange, signatures"],
        ]},
        { t: "callout", kind: "memo", md: "RSA is asymmetric. MD5 is a hash, not encryption. The exam tests both confusions — your Lesson-1 verbatim rule." },
      ]},
      { h: "How they combine (TLS reality)", blocks: [
        { t: "p", md: "Real systems do a handshake dance: asymmetric crypto (slow, safe) exchanges a temporary **session key**; then symmetric AES encrypts the actual data (fast). 'Why not asymmetric for everything?' → too slow. 'Why not symmetric-only?' → key distribution problem — how do two strangers share a secret without meeting?" },
        { t: "list", items: [
          "Public key encrypts → private key decrypts (confidentiality)",
          "Private key signs → public key verifies (authenticity — G4)",
          "DES is old/broken (56-bit key); AES is the modern standard (128/192/256-bit)",
        ]},
      ]},
    ],
    traps: [
      "RSA is ASYMMETRIC — the exact option-trap you corrected in your diagnostic.",
      "AES = symmetric; DES = symmetric (but obsolete).",
      "Same key both directions = symmetric; key pair = asymmetric.",
    ],
    cheat: { head: ["Algorithm", "Family"], rows: [
      ["AES / DES / 3DES", "Symmetric"],
      ["RSA / ECC / DH", "Asymmetric"],
      ["MD5 / SHA-256", "Hash (neither!)"],
    ]},
    checkpoint: [
      { q: "AES: symmetric or asymmetric?", a: "Symmetric — one shared key." },
      { q: "Why does TLS use both?", a: "Asymmetric to exchange the session key; symmetric for bulk speed." },
      { q: "RSA: encrypt with which key?", a: "Recipient's PUBLIC key; decrypt with private." },
    ],
    problemIds: [],
  },
  {
    id: "G3", domainId: "G", title: "Hashing & Integrity", minutes: 25,
    tldr: "One-way fingerprints: MD5 broken, SHA-256 fine. Hashing ≠ encryption — the favorite trap.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The properties", blocks: [
        { t: "p", md: "A hash: fixed-size output, same input → same output, **one-way** (can't reverse), tiny input change → totally different output (avalanche). Uses: password storage (with salt), file integrity, digital signatures' inner step, blockchain." },
        { t: "table", head: ["Hash", "Size", "Status"], rows: [
          ["MD5", "128-bit", "BROKEN (collisions found)"],
          ["SHA-1", "160-bit", "deprecated"],
          ["SHA-256", "256-bit", "secure, current standard"],
        ]},
        { t: "callout", kind: "trap", md: "MD5 is a HASH — 128-bit, broken, never encryption. Your diagnostic miss retold: options asked 'MD5 is an encryption algorithm' — FALSE. It doesn't decrypt because it never encrypts." },
      ]},
      { h: "Salt & password storage", blocks: [
        { t: "p", md: "Storing raw password hashes is weak against rainbow tables. A **salt** (random per-user value) prepends the password before hashing — identical passwords then hash differently, and precomputed tables die. Slow hashes (bcrypt/scrypt) add GPU-proof friction." },
      ]},
    ],
    traps: [
      "Hashing is one-way; encryption is two-way (reversible with key).",
      "MD5 = 128-bit AND broken.",
      "Same password + different salts → different stored hashes.",
    ],
    cheat: { head: ["Tool", "Job"], rows: [
      ["SHA-256", "integrity / signatures"],
      ["MD5", "legacy only — broken"],
      ["Salt + bcrypt", "password storage"],
      ["Checksum", "corruption detection"],
    ]},
    checkpoint: [
      { q: "Why can't a hash be 'decrypted'?", a: "It's one-way — information is discarded, not locked." },
      { q: "MD5 output size and status?", a: "128-bit, cryptographically broken." },
      { q: "What does a salt prevent?", a: "Rainbow-table/precomputed attacks; identical passwords hash differently." },
    ],
    problemIds: [],
  },
  {
    id: "G4", domainId: "G", title: "Digital Signatures & Certificates", minutes: 25,
    tldr: "Sign with PRIVATE key, verify with PUBLIC. Certificates chain to CAs. Opposite direction of encryption!",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "The direction flip", blocks: [
        { t: "p", md: "Encryption: public encrypts, private decrypts (secrecy). Signatures: **private signs, public verifies** (authenticity). The signature is a hash of the message encrypted with the signer's private key — anyone with the public key can check it, and only the private holder could have made it. Gives integrity + **non-repudiation** (can't later deny signing)." },
        { t: "table", head: ["Goal", "Direction"], rows: [
          ["Keep secret", "public encrypts, private decrypts"],
          ["Prove origin", "private signs, public verifies"],
        ]},
      ]},
      { h: "Certificates & the chain", blocks: [
        { t: "p", md: "A certificate = identity (domain) + public key, signed by a Certificate Authority. Browsers ship with trusted root CAs; your bank's cert chains: bank cert ← intermediate CA ← root CA. Expired/untrusted cert = browser warning = potential MITM. Ties back to F7's TLS handshake." },
      ]},
    ],
    traps: [
      "Signature uses the signer's PRIVATE key (not public) — the #1 signature trap.",
      "Non-repudiation comes from signatures, not from encryption.",
      "A cert binds a public key to an identity — it's not the private key's container.",
    ],
    cheat: { head: ["Action", "Key used"], rows: [
      ["Encrypt for someone", "their public key"],
      ["Decrypt your mail", "your private key"],
      ["Sign", "your private key"],
      ["Verify signature", "signer's public key"],
    ]},
    checkpoint: [
      { q: "Which key signs a document?", a: "The signer's private key." },
      { q: "What two properties do signatures give beyond integrity?", a: "Authentication and non-repudiation." },
      { q: "Who vouches for a website's certificate?", a: "A Certificate Authority (chained to a trusted root)." },
    ],
    problemIds: [],
  },
  {
    id: "G5", domainId: "G", title: "Firewalls & Security Devices", minutes: 25,
    tldr: "Packet-filter vs stateful vs proxy; IDS detects, IPS prevents. Where they sit in the network.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "Firewall generations", blocks: [
        { t: "table", head: ["Type", "Decides by"], rows: [
          ["Packet-filtering", "per-packet: IP, port, protocol (stateless)"],
          ["Stateful", "connection state — tracks sessions"],
          ["Application/Proxy", "actual content, per app (L7)"],
        ]},
        { t: "p", md: "A DMZ is a buffer subnet for public-facing servers (web/mail) so a breach there can't reach the internal LAN. **IDS** (Intrusion Detection System) only alerts; **IPS** (Prevention) actively blocks. Placement: firewall at the network edge between LAN and internet." },
      ]},
    ],
    traps: [
      "IDS detects and alerts; IPS blocks inline — the single most-asked difference.",
      "Packet-filtering firewalls can't see application content (that's proxy/L7).",
      "DMZ hosts PUBLIC servers, not internal user machines.",
    ],
    cheat: { head: ["Device", "Role"], rows: [
      ["Packet-filter FW", "IP/port rules"],
      ["Stateful FW", "session-aware rules"],
      ["Proxy FW", "L7 content control"],
      ["IDS / IPS", "alert / block"],
      ["DMZ", "public-server buffer zone"],
    ]},
    checkpoint: [
      { q: "IDS vs IPS in one line?", a: "IDS detects and alerts; IPS sits inline and blocks." },
      { q: "Where do public web servers usually live?", a: "In the DMZ." },
      { q: "Which firewall type inspects HTTP content?", a: "Application (proxy) firewall, L7." },
    ],
    problemIds: [],
  },
  {
    id: "G6", domainId: "G", title: "Attack Types", minutes: 30,
    tldr: "Phishing, MITM, DoS/DDoS, SQLi, XSS — one 'spot the attack' scenario each. SQLi ties back to your SQL domain.",
    examTag: "≈3 of 45 MCQs",
    sections: [
      { h: "The five you must name on sight", blocks: [
        { t: "table", head: ["Attack", "Signature scenario"], rows: [
          ["Phishing", "fake login page / urgent email asking credentials"],
          ["MITM", "attacker relays between you and server (café Wi-Fi)"],
          ["DoS / DDoS", "flood service until it dies (many sources = D)"],
          ["SQL Injection", "input like ' OR 1=1 -- breaks a query"],
          ["XSS", "malicious <script> injected into a page for other users"],
        ]},
        { t: "p", md: "SQLi defense: **parameterized queries / prepared statements** — user input never becomes SQL code. XSS defense: escape/sanitize output, Content-Security-Policy. MITM defense: TLS everywhere (certificates catch the impostor). DDoS defense: rate limiting, CDNs, scrubbing." },
      ]},
      { h: "Social engineering family", blocks: [
        { t: "list", items: [
          "Phishing: mass fake emails",
          "Spear phishing: targeted at one person",
          "Vishing/Smishing: voice/SMS variants",
          "Tailgating: walking in behind an employee (physical)",
        ]},
        { t: "callout", kind: "tip", md: "Exam pattern: the scenario mentions people/trust/urgency → social engineering. Mentions interception → MITM. Mentions traffic/volume → DoS. Mentions quotes in input → SQLi. Mentions script tags → XSS." },
      ]},
    ],
    traps: [
      "DoS = one source; DDoS = distributed many sources.",
      "SQLi is server-side code injection; XSS is client-side script injection — don't swap.",
      "HTTPS does NOT stop SQLi or XSS — input validation does.",
    ],
    cheat: { head: ["Clue", "Attack"], rows: [
      ["Urgent credential email", "Phishing"],
      ["Intercepted session", "MITM"],
      ["Traffic flood", "DDoS"],
      ["' OR 1=1 --", "SQL Injection"],
      ["<script> in comment", "XSS"],
    ]},
    checkpoint: [
      { q: "Best defense against SQL injection?", a: "Parameterized queries / prepared statements." },
      { q: "XSS vs SQLi injection target?", a: "XSS injects into pages (client-side); SQLi into queries (server-side)." },
      { q: "A thousand bots flooding a server is…?", a: "DDoS — attacks availability." },
    ],
    problemIds: [],
  },
  {
    id: "G7", domainId: "G", title: "Authentication & 2FA", minutes: 20,
    tldr: "Know / Have / Are — the three factors. OTP, biometrics, SSO. Cheap, predictable marks.",
    examTag: "≈2 of 45 MCQs",
    sections: [
      { h: "The three factors", blocks: [
        { t: "table", head: ["Factor", "Examples"], rows: [
          ["Something you KNOW", "password, PIN"],
          ["Something you HAVE", "OTP token, phone, smart card"],
          ["Something you ARE", "fingerprint, face, retina"],
        ]},
        { t: "p", md: "2FA/MFA = factors from **different** categories. Password + PIN is still single-factor (both knowledge). Password + OTP = true 2FA. SSO (Google login) delegates authentication to one identity provider — convenience + one strong gate. Biometric downsides: can't be rotated if leaked." },
      ]},
    ],
    traps: [
      "Password + security question ≠ 2FA (both are 'know').",
      "OTP is 'something you HAVE' (the device), not 'you are'.",
      "Biometrics are 'something you ARE' — the exam tests the category.",
    ],
    cheat: { head: ["Example", "Factor"], rows: [
      ["PIN", "know"],
      ["Authenticator app code", "have"],
      ["Fingerprint", "are"],
      ["Password+OTP", "true 2FA"],
    ]},
    checkpoint: [
      { q: "Password + fingerprint = how many factors?", a: "Two (know + are) — genuine 2FA." },
      { q: "Factor of a hardware OTP token?", a: "Something you have." },
      { q: "Why is password+PIN not 2FA?", a: "Same category (knowledge) — different factors are required." },
    ],
    problemIds: [],
  },
];
