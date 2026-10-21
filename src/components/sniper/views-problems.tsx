"use client";

import { useState } from "react";
import { ArrowLeft, Flag } from "lucide-react";
import { go, PROBLEMS } from "@/lib/derive";
import { useSniper } from "@/lib/sniper-store";
import { problemById } from "@/content/problems";
import { domainById } from "@/content/domains";
import { topicById } from "@/content";
import { DiffChip, LeetCodeLink, Reveal, StatusPill, CodeBlock, Callout } from "./ui-bits";
import { PROBLEM_STATUS_META } from "./ui-bits";
import { toast } from "@/hooks/use-toast";

// ─── /problems ──────────────────────────────────────────────────────────
export function ProblemsIndexView() {
  const probStates = useSniper((s) => s.problems);
  const [fDomain, setFDomain] = useState<string>("ALL");
  const [fStatus, setFStatus] = useState<string>("ALL");
  const [fDiff, setFDiff] = useState<string>("ALL");
  const [q, setQ] = useState("");

  const filtered = PROBLEMS.filter((p) => {
    if (fDomain !== "ALL" && p.domainId !== fDomain) return false;
    if (fStatus !== "ALL" && (probStates[p.id]?.status ?? "TODO") !== fStatus) return false;
    if (fDiff !== "ALL" && p.difficulty !== fDiff) return false;
    if (q && !p.title.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="view-enter max-w-[1100px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Problem Bank</h1>
      <p className="text-[13px] text-muted-foreground mb-5">
        {PROBLEMS.length} problems — {filtered.length} shown. Solve on LeetCode, self-mark here.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title…"
          className="h-9 rounded-md border border-border bg-card px-3 text-[13px] outline-none focus:border-primary/60 w-44"
        />
        {[
          { label: "Domain", value: fDomain, set: setFDomain, opts: ["ALL", "C", "D", "E"] },
          { label: "Status", value: fStatus, set: setFStatus, opts: ["ALL", "TODO", "ATTEMPTED", "REVISIT", "SOLVED"] },
          { label: "Diff", value: fDiff, set: setFDiff, opts: ["ALL", "EASY", "MEDIUM"] },
        ].map((f) => (
          <select
            key={f.label} value={f.value} onChange={(e) => f.set(e.target.value)}
            className="h-9 rounded-md border border-border bg-card px-2 text-[13px] outline-none focus:border-primary/60"
          >
            {f.opts.map((o) => <option key={o} value={o}>{f.label}: {o}</option>)}
          </select>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((p) => {
          const st = probStates[p.id];
          const dom = domainById(p.domainId);
          return (
            <button
              key={p.id}
              onClick={() => go(`/problems/${p.id}`)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3 text-left hover:border-primary/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st ? statusColor(st.status) : "#5A6B7D" }} />
              <span className="font-mono text-[10.5px] text-muted-foreground w-[74px] shrink-0 hidden sm:block">
                {p.platform === "LEETCODE" ? p.id.toUpperCase() : "SITE"}
              </span>
              <span className="flex-1 min-w-0 truncate text-[14px]">{p.title}</span>
              <span className="hidden md:inline text-[11.5px] rounded px-1.5 py-0.5 shrink-0"
                style={{ color: dom.color, background: `${dom.color}12` }}>
                {p.pattern}
              </span>
              <DiffChip d={p.difficulty} />
              {st && <StatusPill status={st.status} kind="problem" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function statusColor(s: string): string {
  return s === "SOLVED" ? "#34D399" : s === "ATTEMPTED" ? "#FBBF24" : s === "REVISIT" ? "#C084FC" : "#5A6B7D";
}

// ─── /problems/:pid ─────────────────────────────────────────────────────
export function ProblemView({ pid }: { pid: string }) {
  const p = problemById(pid);
  const openProblem = useSniper((s) => s.openProblem);
  const setProblemStatus = useSniper((s) => s.setProblemStatus);
  const setNotes = useSniper((s) => s.setNotes);
  const st = useSniper((s) => s.problems[pid]);
  const settings = useSniper((s) => s.settings);
  const [revealedApproach, setRevealedApproach] = useState(false);

  if (!p) return <div className="p-8 text-muted-foreground">Unknown problem.</div>;
  const dom = domainById(p.domainId);

  const samePatternNext = PROBLEMS.find(
    (x) => x.pattern === p.pattern && x.id !== p.id &&
      (useSniper.getState().problems[x.id]?.status ?? "TODO") !== "SOLVED",
  );

  return (
    <div className="view-enter max-w-[820px] mx-auto px-4 md:px-6 py-6">
      <button onClick={() => go("/problems")} className="text-[13px] text-muted-foreground hover:text-primary mb-3 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Problem Bank
      </button>

      <div className="flex flex-wrap items-center gap-2 mb-2">
        <h1 className="text-2xl font-bold">{p.title}</h1>
        {st && <StatusPill status={st.status} kind="problem" />}
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground mb-4">
        <DiffChip d={p.difficulty} />
        <span className="rounded px-1.5 py-0.5" style={{ color: dom.color, background: `${dom.color}12` }}>{p.pattern}</span>
        {p.topicIds.map((tid) => {
          const t = topicById(tid);
          return t ? (
            <button key={tid} onClick={() => go(`/topics/${t.domainId}/${tid}`)} className="underline hover:text-primary">
              {tid} {t.title}
            </button>
          ) : null;
        })}
      </div>

      {/* status selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {Object.entries(PROBLEM_STATUS_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => {
              setProblemStatus(p.id, key as never);
              if (key === "SOLVED") toast({ title: "Solved — logged", description: p.title });
            }}
            className="rounded-md px-3 py-1.5 text-[12.5px] font-medium border transition-all"
            style={{
              color: (st?.status ?? "TODO") === key ? "#06202A" : meta.color,
              background: (st?.status ?? "TODO") === key ? meta.color : "transparent",
              borderColor: `${meta.color}55`,
            }}
          >
            {meta.label}
          </button>
        ))}
        <button
          onClick={() => setProblemStatus(p.id, "REVISIT")}
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-[12.5px] border border-[#C084FC]/40 text-[#C084FC] hover:bg-[#C084FC]/10"
        >
          <Flag size={12} /> Flag for Revisit
        </button>
      </div>

      {p.platform === "LEETCODE" && p.leetcodeUrl && (
        <div className="mb-5"><LeetCodeLink url={p.leetcodeUrl} /></div>
      )}

      {/* statement */}
      <section className="mb-6">
        <h2 className="text-[15px] font-bold mb-2">Statement</h2>
        <p className="text-[14.5px] leading-relaxed text-foreground/85">{p.statement}</p>
        <div className="mt-3 space-y-2">
          {p.examples.map((ex, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/40 p-3 text-[13.5px]">
              <div><span className="text-muted-foreground">Input:</span> <code className="font-mono text-primary">{ex.input}</code></div>
              <div><span className="text-muted-foreground">Output:</span> <code className="font-mono text-[#34D399]">{ex.output}</code></div>
              {ex.why && <div className="text-muted-foreground text-[12.5px] mt-1">{ex.why}</div>}
            </div>
          ))}
        </div>
        {p.constraints && (
          <ul className="list-disc pl-5 mt-3 space-y-1">
            {p.constraints.map((c, i) => <li key={i} className="text-[13px] text-muted-foreground">{c}</li>)}
          </ul>
        )}
      </section>

      {/* hints */}
      <section className="mb-6">
        <h2 className="text-[15px] font-bold mb-2">Hints (try before revealing)</h2>
        <div className="space-y-2">
          {p.hints.map((h, i) => (
            <Reveal
              key={i} index={i + 1} q={h} a={i < p.hints.length - 1 ? "…" : "You've got all the pieces — code it now."}
              onOpen={() => {
                openProblem(p.id);
                if ((st?.status ?? "TODO") === "TODO") setProblemStatus(p.id, "ATTEMPTED");
              }}
            />
          ))}
        </div>
      </section>

      {/* approach gate */}
      <section className="mb-6">
        <h2 className="text-[15px] font-bold mb-2">Approach</h2>
        {!revealedApproach ? (
          <button
            onClick={() => setRevealedApproach(true)}
            className="rounded-md border border-[#F87171]/50 bg-[#F87171]/10 px-4 py-2 text-[13px] font-medium text-[#F87171] hover:bg-[#F87171]/20"
          >
            Reveal approach — only if you&apos;ve tried for 20+ minutes
          </button>
        ) : (
          <>
            <Callout kind="tip" md={p.approach} />
            <CodeBlock src={p.solution} lang={p.solutionLang} />
            {p.complexity && <p className="text-[13px] text-muted-foreground mt-1"><span className="font-semibold">Complexity:</span> {p.complexity}</p>}
          </>
        )}
      </section>

      {/* notes */}
      <section className="mb-6">
        <h2 className="text-[15px] font-bold mb-2">Your notes</h2>
        <textarea
          value={st?.notes ?? ""}
          onChange={(e) => setNotes(p.id, e.target.value)}
          placeholder="What tripped you up? What's the one-line idea?"
          className="w-full min-h-[80px] rounded-md border border-border bg-card px-3 py-2 text-[13.5px] outline-none focus:border-primary/60"
        />
      </section>

      {samePatternNext && (
        <button
          onClick={() => go(`/problems/${samePatternNext.id}`)}
          className="text-[13px] text-primary hover:underline"
        >
          Next unsolved in {p.pattern}: {samePatternNext.title} →
        </button>
      )}
    </div>
  );
}
