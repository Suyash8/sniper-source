"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { go, useDerived, DOMAINS, topicsOfDomain, problemsOfDomain } from "@/lib/derive";
import { useSniper } from "@/lib/sniper-store";
import { topicById } from "@/content";
import { TOPICS } from "@/content";
import { problemById } from "@/content/problems";
import { ProgressRing, MiniBar, SectionView, Reveal, StatusPill, DiffChip, Callout, fireConfetti } from "./ui-bits";
import { toast } from "@/hooks/use-toast";

// ─── /topics ────────────────────────────────────────────────────────────
export function TopicsIndexView() {
  const { domainMastery } = useDerived();
  return (
    <div className="view-enter max-w-[1200px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Topic Library</h1>
      <p className="text-[13px] text-muted-foreground mb-6">
        {TOPICS.length} lessons across 9 domains — each one complete, permanent, yours forever.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DOMAINS.map((d) => {
          const domTopics = topicsOfDomain(d.id);
          const m = domainMastery(d.id);
          const learned = domTopics.filter((t) => ["LEARNED", "MASTERED"].includes(
            useSniper.getState().topics[t.id]?.status ?? "NOT_STARTED",
          )).length;
          return (
            <button
              key={d.id}
              onClick={() => go(`/topics/${d.id}`)}
              className="rounded-xl border border-border bg-card p-5 text-left hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <ProgressRing
                  value={m} size={54} stroke={6} color={d.color}
                  label={<span className="text-[11px] font-bold" style={{ color: d.color }}>{Math.round(m * 100)}</span>}
                />
                <div>
                  <div className="font-bold text-[15px]">{d.name}</div>
                  <div className="text-[11.5px] text-muted-foreground">{learned}/{domTopics.length} topics · {d.weight}% of score</div>
                </div>
              </div>
              <MiniBar value={learned / domTopics.length} color={d.color} />
              <p className="text-[12.5px] text-muted-foreground mt-3">{d.blurb}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── /topics/:domain ────────────────────────────────────────────────────
export function DomainView({ domainId }: { domainId: string }) {
  const dom = DOMAINS.find((d) => d.id === domainId);
  if (!dom) return <div className="p-8 text-muted-foreground">Unknown domain.</div>;
  const domTopics = topicsOfDomain(domainId);
  const domProblems = problemsOfDomain(domainId);
  return (
    <div className="view-enter max-w-[900px] mx-auto px-4 md:px-6 py-6">
      <button onClick={() => go("/topics")} className="text-[13px] text-muted-foreground hover:text-primary mb-3 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Topic Library
      </button>
      <div className="rounded-xl border border-border bg-card p-6 mb-6" style={{ borderLeft: `4px solid ${dom.color}` }}>
        <h1 className="text-2xl font-bold mb-1">{dom.name}</h1>
        <p className="text-[13.5px] text-muted-foreground mb-3">{dom.blurb}</p>
        <span className="text-[12px] font-medium rounded px-2 py-0.5"
          style={{ color: dom.color, background: `${dom.color}14`, border: `1px solid ${dom.color}40` }}>
          {dom.weight}% of your score
        </span>
      </div>

      <h2 className="font-bold text-[15px] mb-3">Lessons</h2>
      <div className="space-y-2 mb-8">
        {domTopics.map((t) => {
          const st = useSniper.getState().topics[t.id];
          return (
            <button
              key={t.id}
              onClick={() => go(`/topics/${domainId}/${t.id}`)}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 flex items-center gap-3 text-left hover:border-primary/40 transition-colors"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: st ? statusColor(st.status) : "#5A6B7D" }} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-medium truncate">{t.title}</div>
                <div className="text-[11.5px] text-muted-foreground">{t.examTag} · {t.minutes} min</div>
              </div>
              {st && <StatusPill status={st.status} kind="topic" />}
              <ArrowRight size={15} className="text-muted-foreground shrink-0" />
            </button>
          );
        })}
      </div>

      {domProblems.length > 0 && (
        <>
          <h2 className="font-bold text-[15px] mb-3">Problems in this domain</h2>
          <div className="space-y-2">
            {domProblems.map((p) => {
              const st = useSniper.getState().problems[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => go(`/problems/${p.id}`)}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 flex items-center gap-3 text-left hover:border-primary/40 transition-colors text-[13.5px]"
                >
                  <span className="font-mono text-[11px] text-muted-foreground w-20 shrink-0">
                    {p.platform === "LEETCODE" ? p.id.toUpperCase() : "SITE"}
                  </span>
                  <span className="flex-1 truncate">{p.title}</span>
                  <DiffChip d={p.difficulty} />
                  {st && <StatusPill status={st.status} kind="problem" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function statusColor(s: string): string {
  return s === "MASTERED" ? "#34D399" : s === "LEARNED" ? "#22D3EE" : s === "READING" ? "#FBBF24" : "#5A6B7D";
}

// ─── /topics/:domain/:topic ─────────────────────────────────────────────
export function TopicView({ topicId }: { topicId: string }) {
  const topic = topicById(topicId);
  const openTopic = useSniper((s) => s.openTopic);
  const setReadPct = useSniper((s) => s.setReadPct);
  const revealCheckpoint = useSniper((s) => s.revealCheckpoint);
  const markLearned = useSniper((s) => s.markLearned);
  const markMastered = useSniper((s) => s.markMastered);
  const tState = useSniper((s) => s.topics[topicId]);
  const probStates = useSniper((s) => s.problems);
  const settings = useSniper((s) => s.settings);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (topic) openTopic(topic.id);
     
  }, [topicId]);

  const markSeen = useMemo(() => (h: string) => {
    setSeen((prev) => {
      if (prev.has(h)) return prev;
      const next = new Set(prev);
      next.add(h);
      return next;
    });
  }, []);

  // reading progress: seen sections / total sections
  useEffect(() => {
    if (!topic) return;
    const pct = Math.round((seen.size / Math.max(1, topic.sections.length)) * 100);
    if (pct > 0) setReadPct(topic.id, pct);
     
  }, [seen.size, topicId]);

  if (!topic) return <div className="p-8 text-muted-foreground">Unknown topic.</div>;

  const dom = DOMAINS.find((d) => d.id === topic.domainId)!;
  const totalCP = topic.checkpoint.length;
  const revealed = tState?.revealed ?? 0;
  const readPct = tState?.readPct ?? 0;
  const canLearn = readPct >= 100 && revealed >= totalCP;
  const allSolved = topic.problemIds.every(
    (pid) => (probStates[pid]?.status ?? "TODO") === "SOLVED",
  );
  const canMaster = (tState?.status === "LEARNED") && allSolved && (tState?.box ?? 1) >= 3;

  const idx = TOPICS.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? TOPICS[idx - 1] : undefined;
  const next = idx < TOPICS.length - 1 ? TOPICS[idx + 1] : undefined;

  return (
    <div className="view-enter max-w-[1200px] mx-auto px-4 md:px-6 py-6 flex gap-8">
      {/* TOC rail */}
      <aside className="hidden lg:block w-[220px] shrink-0">
        <div className="sticky top-20">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">On this page</div>
          <MiniBar value={readPct / 100} color={dom.color} />
          <nav className="mt-3 space-y-1">
            {topic.sections.map((s) => (
              <a
                key={s.h}
                href={`#${s.h.replace(/\s+/g, "-").toLowerCase()}`}
                className={
                  "block text-[12.5px] py-1 hover:text-primary transition-colors truncate " +
                  (seen.has(s.h) ? "text-foreground/80" : "text-muted-foreground")
                }
              >
                {s.h}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* content */}
      <article className="flex-1 min-w-0 max-w-[768px]">
        <button onClick={() => go(`/topics/${dom.id}`)} className="text-[13px] text-muted-foreground hover:text-primary mb-3 inline-flex items-center gap-1">
          <ArrowLeft size={14} /> {dom.name}
        </button>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">{topic.title}</h1>
          {tState && <StatusPill status={tState.status} kind="topic" />}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground mb-4">
          <span className="rounded px-1.5 py-0.5" style={{ color: dom.color, background: `${dom.color}12` }}>{topic.examTag}</span>
          <span>· {topic.minutes} min</span>
          <span>· box {tState?.box ?? 1}/5</span>
        </div>

        {/* TL;DR */}
        <div className="rounded-lg border border-border bg-secondary/40 p-4 mb-4 text-[14px] leading-relaxed">
          {topic.tldr}
        </div>

        {topic.mnemonic && <Callout kind="memo" md={topic.mnemonic} />}

        {topic.sections.map((s) => (
          <SectionView key={s.h} s={s} onSeen={markSeen} />
        ))}

        {/* traps */}
        <section className="mt-8">
          <h2 className="text-[19px] font-bold mt-8 mb-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#F87171] inline-block" /> Exam Traps
          </h2>
          <ul className="list-disc pl-5 space-y-1.5">
            {topic.traps.map((tr, i) => (
              <li key={i} className="text-[14.5px] leading-relaxed text-foreground/85">{tr}</li>
            ))}
          </ul>
        </section>

        {/* cheat sheet */}
        <section className="mt-8">
          <h2 className="text-[19px] font-bold mt-8 mb-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-[#F59E0B] inline-block" /> Cheat Sheet
          </h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-[13.5px]">
              <thead>
                <tr className="bg-secondary">
                  {topic.cheat.head.map((h, i) => (
                    <th key={i} className="text-left px-3 py-2 font-semibold border-b border-border">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topic.cheat.rows.map((row, ri) => (
                  <tr key={ri} className="border-b border-border/60 last:border-0">
                    {row.map((c, ci) => <td key={ci} className="px-3 py-2 text-foreground/80">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* checkpoint */}
        <section className="mt-8">
          <h2 className="text-[19px] font-bold mt-8 mb-2 flex items-center gap-2">
            <span className="h-4 w-1 rounded-full bg-primary inline-block" /> Checkpoint
          </h2>
          <p className="text-[13px] text-muted-foreground mb-3">
            Reveal each answer only after saying it out loud. All {totalCP} must be revealed before &quot;Mark as Learned&quot;.
          </p>
          <div className="space-y-2">
            {topic.checkpoint.map((cp, i) => (
              <Reveal key={i} index={i + 1} q={cp.q} a={cp.a} onOpen={() => revealCheckpoint(topic.id)} />
            ))}
          </div>
        </section>

        {/* linked problems */}
        {topic.problemIds.length > 0 && (
          <section className="mt-8">
            <h2 className="text-[19px] font-bold mt-8 mb-2 flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-[#34D399] inline-block" /> Linked Problems
            </h2>
            <div className="space-y-2">
              {topic.problemIds.map((pid) => {
                const p = problemById(pid);
                if (!p) return null;
                const st = probStates[pid];
                return (
                  <button
                    key={pid}
                    onClick={() => go(`/problems/${pid}`)}
                    className="w-full rounded-lg border border-border bg-card px-4 py-2.5 flex items-center gap-3 text-left hover:border-primary/40 transition-colors text-[13.5px]"
                  >
                    <span className="flex-1 truncate">{p.title}</span>
                    <DiffChip d={p.difficulty} />
                    {st && <StatusPill status={st.status} kind="problem" />}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* gating messages + actions */}
        <div className="mt-10 rounded-xl border border-border bg-card p-5 space-y-3">
          {!canLearn && (
            <p className="text-[13px] text-muted-foreground flex items-center gap-2">
              <Lock size={13} /> Mastered is earned: finish the read ({readPct}%) and reveal all checkpoints ({revealed}/{totalCP}).
            </p>
          )}
          {canLearn && tState?.status !== "MASTERED" && (
            <div className="flex flex-wrap gap-3">
              {tState?.status === "READING" && (
                <button
                  onClick={() => { markLearned(topic.id); toast({ title: `+40 XP · Learned`, description: topic.title }); }}
                  className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:brightness-110"
                >
                  Mark as Learned
                </button>
              )}
              {tState?.status === "LEARNED" && (
                <button
                  disabled={!canMaster}
                  onClick={() => {
                    if (!canMaster) return;
                    markMastered(topic.id);
                    if (settings.confetti) fireConfetti([dom.color, "#F59E0B", "#34D399"]);
                    toast({ title: `+100 XP · MASTERED`, description: topic.title });
                  }}
                  className={
                    "rounded-md px-4 py-2 text-sm font-semibold transition-all " +
                    (canMaster ? "bg-[#34D399] text-[#06202A] hover:brightness-110" : "bg-secondary text-muted-foreground cursor-not-allowed")
                  }
                >
                  {canMaster ? "Mark as Mastered" : allSolved ? "Mastered gate: box ≥ 3" : "Mastered gate: solve linked problems"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* prev/next */}
        <div className="flex items-center justify-between mt-8 pb-10">
          {prev ? (
            <button onClick={() => go(`/topics/${prev.domainId}/${prev.id}`)} className="text-[13px] text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              <ArrowLeft size={14} /> {prev.title}
            </button>
          ) : <span />}
          {next ? (
            <button onClick={() => go(`/topics/${next.domainId}/${next.id}`)} className="text-[13px] text-muted-foreground hover:text-primary inline-flex items-center gap-1">
              {next.title} <ArrowRight size={14} />
            </button>
          ) : <span />}
        </div>
      </article>
    </div>
  );
}
