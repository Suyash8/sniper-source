"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import type { Block, Section } from "@/content/types";
import { cn } from "@/lib/utils";

// ─── inline markdown: **bold** and `code` ────────────────────────────────
export function InlineMd({ md, className }: { md: string; className?: string }) {
  const parts = md.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**"))
          return <strong key={i} className="text-foreground font-semibold">{p.slice(2, -2)}</strong>;
        if (p.startsWith("`") && p.endsWith("`"))
          return (
            <code key={i} className="font-mono text-[13px] bg-secondary border border-border rounded px-1.5 py-0.5 text-primary">
              {p.slice(1, -1)}
            </code>
          );
        return <span key={i}>{p}</span>;
      })}
    </span>
  );
}

// ─── progress ring ──────────────────────────────────────────────────────
export function ProgressRing({ value, size = 56, stroke = 6, color = "#22D3EE", label }: {
  value: number; size?: number; stroke?: number; color?: string; label?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1F2A3A" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 400ms ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{label}</div>
    </div>
  );
}

// ─── thin progress bar ──────────────────────────────────────────────────
export function MiniBar({ value, color = "#22D3EE", h = 6 }: { value: number; color?: string; h?: number }) {
  return (
    <div className="w-full rounded-full bg-[#1F2A3A] overflow-hidden" style={{ height: h }}>
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, background: color, transition: "width 300ms ease-out" }}
      />
    </div>
  );
}

// ─── callout ────────────────────────────────────────────────────────────
const CALLOUT_STYLE: Record<string, { border: string; bg: string; label: string; labelColor: string }> = {
  trap: { border: "#F87171", bg: "rgba(248,113,113,0.06)", label: "TRAP", labelColor: "#F87171" },
  tip: { border: "#22D3EE", bg: "rgba(34,211,238,0.06)", label: "TIP", labelColor: "#22D3EE" },
  memo: { border: "#F59E0B", bg: "rgba(245,158,11,0.07)", label: "MEMORIZE", labelColor: "#F59E0B" },
};

export function Callout({ kind, md }: { kind: "trap" | "tip" | "memo"; md: string }) {
  const s = CALLOUT_STYLE[kind];
  return (
    <div className="rounded-lg p-4 my-3" style={{ borderLeft: `3px solid ${s.border}`, background: s.bg }}>
      <div className="text-[11px] font-bold tracking-[0.15em] mb-1" style={{ color: s.labelColor }}>{s.label}</div>
      <p className="text-[14px] leading-relaxed text-foreground/90"><InlineMd md={md} /></p>
    </div>
  );
}

// ─── code block ─────────────────────────────────────────────────────────
export function CodeBlock({ src, lang }: { src: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard unavailable */ }
  };
  const lines = src.split("\n");
  return (
    <div className="my-3 rounded-lg border border-border bg-[#0d131c] overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{lang ?? "code"}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="code-scroll overflow-x-auto p-3">
        <pre className="font-mono text-[13px] leading-[1.45]">
          {lines.map((l, i) => (
            <div key={i} className="flex">
              <span className="select-none text-[#3d4f63] w-8 shrink-0 text-right pr-3">{i + 1}</span>
              <span className="whitespace-pre text-[#cfe3f3]">{l || " "}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

// ─── content block renderer ─────────────────────────────────────────────
export function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "p":
      return <p className="text-[15px] leading-relaxed text-foreground/85 my-2"><InlineMd md={b.md} /></p>;
    case "list":
      return (
        <ul className="list-disc pl-5 space-y-1.5 my-3">
          {b.items.map((it, i) => (
            <li key={i} className="text-[14.5px] leading-relaxed text-foreground/85"><InlineMd md={it} /></li>
          ))}
        </ul>
      );
    case "code":
      return <CodeBlock src={b.src} lang={b.lang} />;
    case "table":
      return (
        <div className="code-scroll overflow-x-auto my-3 rounded-lg border border-border">
          <table className="w-full text-[13.5px]">
            <thead>
              <tr className="bg-secondary">
                {b.head.map((h, i) => (
                  <th key={i} className="text-left px-3 py-2 font-semibold text-foreground/90 border-b border-border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.rows.map((row, ri) => (
                <tr key={ri} className="border-b border-border/60 last:border-0">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 text-foreground/80"><InlineMd md={cell} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return <Callout kind={b.kind} md={b.md} />;
  }
}

export function SectionView({ s, onSeen }: { s: Section; onSeen?: (h: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !onSeen) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && onSeen(s.h)),
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onSeen, s.h]);
  return (
    <section ref={ref} id={s.h.replace(/\s+/g, "-").toLowerCase()} className="scroll-mt-24">
      <h2 className="text-[19px] font-bold mt-8 mb-2 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-primary inline-block" />
        {s.h}
      </h2>
      {s.blocks.map((b, i) => <BlockView key={i} b={b} />)}
    </section>
  );
}

// ─── collapsible (checkpoint / hint) ────────────────────────────────────
export function Reveal({ q, a, onOpen, index }: { q: string; a: string; onOpen?: () => void; index?: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <button
        onClick={() => {
          if (!open) onOpen?.();
          setOpen(!open);
        }}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left bg-secondary/50 hover:bg-secondary transition-colors"
      >
        <span className="text-[14px] font-medium">
          {index !== undefined && <span className="text-primary mr-2 font-mono">{String(index).padStart(2, "0")}</span>}
          {q}
        </span>
        <ChevronDown size={16} className={cn("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 py-3 text-[14px] text-foreground/85 border-t border-border bg-card">
          <InlineMd md={a} />
        </div>
      )}
    </div>
  );
}

// ─── status pill ────────────────────────────────────────────────────────
export const TOPIC_STATUS_META: Record<string, { label: string; color: string }> = {
  NOT_STARTED: { label: "Not started", color: "#5A6B7D" },
  READING: { label: "Reading", color: "#FBBF24" },
  LEARNED: { label: "Learned", color: "#22D3EE" },
  MASTERED: { label: "Mastered", color: "#34D399" },
};

export const PROBLEM_STATUS_META: Record<string, { label: string; color: string }> = {
  TODO: { label: "To do", color: "#5A6B7D" },
  ATTEMPTED: { label: "Attempted", color: "#FBBF24" },
  REVISIT: { label: "Revisit", color: "#C084FC" },
  SOLVED: { label: "Solved", color: "#34D399" },
};

export function StatusPill({ status, kind }: { status: string; kind: "topic" | "problem" }) {
  const meta = (kind === "topic" ? TOPIC_STATUS_META : PROBLEM_STATUS_META)[status];
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border"
      style={{ color: meta.color, borderColor: `${meta.color}55`, background: `${meta.color}12` }}
    >
      {meta.label}
    </span>
  );
}

export function DiffChip({ d }: { d: string }) {
  const color = d === "EASY" ? "#34D399" : "#FBBF24";
  return (
    <span className="rounded px-1.5 py-0.5 text-[10.5px] font-bold tracking-wide" style={{ color, background: `${color}14`, border: `1px solid ${color}40` }}>
      {d}
    </span>
  );
}

export function LeetCodeLink({ url }: { url: string }) {
  return (
    <a
      href={url} target="_blank" rel="noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-[#22D3EE]/40 bg-[#22D3EE]/10 px-3 py-1.5 text-[13px] font-medium text-primary hover:bg-[#22D3EE]/20 transition-colors"
    >
      <ExternalLink size={14} /> Open on LeetCode
    </a>
  );
}

// ─── confetti (hand-rolled canvas, 800ms burst) ─────────────────────────
export function fireConfetti(colors: string[] = ["#22D3EE", "#34D399", "#F59E0B", "#F472B6"]) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.style.cssText = "position:fixed;inset:0;z-index:9999;pointer-events:none";
  cv.width = window.innerWidth;
  cv.height = window.innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d")!;
  const parts = Array.from({ length: 30 }, () => ({
    x: window.innerWidth / 2, y: window.innerHeight * 0.45,
    vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 12 - 4,
    r: Math.random() * 5 + 2, color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI,
  }));
  const start = performance.now();
  const tick = (now: number) => {
    const t = now - start;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.45; p.rot += 0.1;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - t / 800);
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      ctx.restore();
    }
    if (t < 800) requestAnimationFrame(tick);
    else cv.remove();
  };
  requestAnimationFrame(tick);
}
