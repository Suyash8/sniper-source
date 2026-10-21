import type { Domain } from "./types";

export const DOMAINS: Domain[] = [
  {
    id: "A", name: "Aptitude", color: "#A78BFA", weight: 5,
    blurb: "Round-1 gamified warm-up. Your strength — keep it sharp with speed drills only.",
  },
  {
    id: "B", name: "Pseudocode MCQ", color: "#F472B6", weight: 20,
    blurb: "The single biggest MCQ share. Output tracing, operators, loops, recursion, bit tricks.",
  },
  {
    id: "C", name: "Python DSA", color: "#22D3EE", weight: 22,
    blurb: "Your weakest flank (baseline 25%). 1 of 3 coding questions. Python ONLY.",
  },
  {
    id: "D", name: "SQL", color: "#34D399", weight: 14,
    blurb: "1 of 3 coding questions — usually a 3-table join. Baseline 65%, fixable to 95%.",
  },
  {
    id: "E", name: "Web: HTML/CSS/JS", color: "#FBBF24", weight: 10,
    blurb: "1 of 3 coding questions is a fix-it task. Plus MCQs. Your JS gap starts today.",
  },
  {
    id: "F", name: "Networking", color: "#60A5FA", weight: 10,
    blurb: "OSI, TCP/UDP, devices, ports. Concepts solid — the port table is the gap.",
  },
  {
    id: "G", name: "Security", color: "#F87171", weight: 8,
    blurb: "Encryption/hashing MCQs. Your Lesson-1 money: RSA asymmetric, MD5 is a hash.",
  },
  {
    id: "H", name: "Cloud", color: "#C084FC", weight: 6,
    blurb: "IaaS/PaaS/SaaS, deployment models, hypervisors. Strong — protect it.",
  },
  {
    id: "I", name: "Office & CLI", color: "#94A3B8", weight: 5,
    blurb: "Excel functions (VLOOKUP!), shortcuts, ipconfig/ping. Your weakest 'easy' domain.",
  },
];

export const domainById = (id: string) => DOMAINS.find((d) => d.id === id)!;
