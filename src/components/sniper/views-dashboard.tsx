"use client";

import { Flame, Target, BookOpenCheck, Zap } from "lucide-react";
import { useSniper } from "@/lib/sniper-store";
import { go, useDerived, DOMAINS, TOPICS, PROBLEMS } from "@/lib/derive";
import { ProgressRing, MiniBar } from "./ui-bits";
import { levelFor, todayStr } from "@/lib/engine";

const topicStatus = (topicId: string): string =>
  useSniper.getState().topics[topicId]?.status ?? "NOT_STARTED";

export function DashboardView() {
  const { profile, domainMastery, readiness, solved, mastered, dLeft } = useDerived();
  const generateDay = useSniper((s) => s.generateDay);
  const days = useSniper((s) => s.days);
  const today = todayStr();
  const plan = days[today];
  const level = levelFor(profile.xp);
  const totalProblems = PROBLEMS.length;
  const totalTopics = TOPICS.length;

  const nextTopic = TOPICS.find(
    (t) => t.domainId === weakestId() && !["LEARNED", "MASTERED"].includes(topicStatus(t.id)),
  );

  function weakestId(): string {
    return DOMAINS.map((d) => ({ d, gap: d.weight * (1 - domainMastery(d.id)) }))
      .sort((a, b) => b.gap - a.gap)[0].d.id;
  }

  const recent = Object.entries(days).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 5);
  const weakestDomain = DOMAINS.find((d) => d.id === weakestId()) ?? DOMAINS[0];

  return (
    <div className="view-enter max-w-[1200px] mx-auto px-4 md:px-6 py-6">
      {!plan && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mb-6">
          <h1 className="text-2xl font-bold text-primary mb-1">
            {dLeft} days. {totalTopics} topics. {totalProblems} problems. Zero excuses.
          </h1>
          <p className="text-muted-foreground text-sm mb-4">
            Weakest flank: {weakestDomain.name} ({weakestDomain.weight}% of the score). The engine
            feeds you one lesson, fresh problems and due revisions every day until contact.
          </p>
          <button
            onClick={() => { generateDay(today); go("/today"); }}
            className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:brightness-110 transition-all"
          >
            Generate today&apos;s plan
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <ProgressRing
            value={readiness / 100} size={72} stroke={7}
            label={<span className="text-[15px] font-bold text-primary">{Math.round(readiness)}%</span>}
          />
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Readiness</div>
            <div className="text-[12px] text-muted-foreground">weighted by exam</div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Days left</div>
          <div className="text-4xl font-bold mt-1">{dLeft >= 0 ? `D-${dLeft}` : "D-DAY"}</div>
          <div className="text-[12px] text-muted-foreground mt-1">contact {profile.examDate}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Target size={12} /> Problems solved
          </div>
          <div className="text-2xl font-bold mt-2">{solved} <span className="text-muted-foreground text-base">/ {totalProblems}</span></div>
          <div className="mt-2"><MiniBar value={solved / totalProblems} /></div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BookOpenCheck size={12} /> Topics mastered
          </div>
          <div className="text-2xl font-bold mt-2">{mastered} <span className="text-muted-foreground text-base">/ {totalTopics}</span></div>
          <div className="mt-2"><MiniBar value={mastered / totalTopics} color="#34D399" /></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[15px]">Today&apos;s Battle Plan</h2>
            <button onClick={() => go("/today")} className="text-[13px] text-primary hover:underline">
              Open full plan →
            </button>
          </div>
          {plan ? (
            <ul className="space-y-2">
              {plan.blocks.map((b, bi) => (
                <li key={bi} className="flex items-center justify-between text-[13.5px] bg-secondary/60 rounded-lg px-3 py-2">
                  <span className="font-medium">{b.type}</span>
                  <span className="text-muted-foreground">
                    {b.tasks.filter((t) => t.status === "DONE").length}/{b.tasks.length} tasks ·{" "}
                    {b.tasks.reduce((a, t) => a + t.minutes, 0)}m
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13.5px] text-muted-foreground">Nothing generated yet — the day will not fight itself.</p>
          )}
        </div>
        <div className="rounded-xl border border-[#F87171]/30 bg-[#F87171]/5 p-5">
          <div className="text-[11px] font-bold tracking-[0.15em] text-[#F87171] mb-2">WEAKEST FLANK</div>
          <h2 className="text-xl font-bold mb-1">{weakestDomain.name}</h2>
          <p className="text-[13.5px] text-muted-foreground mb-4">{weakestDomain.blurb}</p>
          {nextTopic && (
            <button
              onClick={() => go(`/topics/${weakestDomain.id}/${nextTopic.id}`)}
              className="rounded-md border border-border bg-secondary px-3 py-2 text-[13px] hover:border-primary/50 transition-colors"
            >
              Next: {nextTopic.title} →
            </button>
          )}
        </div>
      </div>

      <h2 className="font-bold text-[15px] mb-3">Domains</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {DOMAINS.map((d) => {
          const m = domainMastery(d.id);
          const domTopics = TOPICS.filter((t) => t.domainId === d.id);
          const next = domTopics.find(
            (t) => !["LEARNED", "MASTERED"].includes(topicStatus(t.id)),
          );
          return (
            <button
              key={d.id}
              onClick={() => go(`/topics/${d.id}`)}
              className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 text-left hover:-translate-y-0.5 transition-all duration-150"
            >
              <ProgressRing
                value={m} size={56} stroke={6} color={d.color}
                label={<span className="text-[11px] font-bold" style={{ color: d.color }}>{Math.round(m * 100)}</span>}
              />
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-[14.5px] truncate">{d.name}</div>
                <div className="text-[11.5px] text-muted-foreground mb-1.5">{d.weight}% of score</div>
                {next && <div className="text-[12px] text-primary truncate">Next: {next.title} →</div>}
              </div>
            </button>
          );
        })}
      </div>

      <h2 className="font-bold text-[15px] mb-3">Recent days</h2>
      {recent.length > 0 ? (
        <div className="space-y-2">
          {recent.map(([date, p]) => {
            const total = p.blocks.reduce((a, b) => a + b.tasks.length, 0);
            const done = p.blocks.reduce((a, b) => a + b.tasks.filter((t) => t.status === "DONE").length, 0);
            return (
              <div key={date} className="grid grid-cols-[90px_1fr_100px] items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-[13px]">
                <span className="font-mono">{date}</span>
                <MiniBar value={total ? done / total : 0} />
                <span className="text-muted-foreground text-right">{done}/{total} done</span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[13px] text-muted-foreground">No history yet. Day one starts now.</p>
      )}

      <div className="mt-8 pt-4 border-t border-border flex items-center justify-between text-[12px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><Zap size={12} style={{ color: "#F59E0B" }} /> {profile.xp} XP · {level.name} · all data stays in this browser</span>
        <button onClick={() => go("/settings")} className="hover:text-primary transition-colors">Settings / Export</button>
      </div>
    </div>
  );
}

export function HeaderBits() {
  const { profile, dLeft } = useDerived();
  const level = levelFor(profile.xp);
  const plan = useSniper((s) => s.days[todayStr()]);
  const dayCleared = plan?.blocks.length
    ? plan.blocks.every((b) => b.tasks.every((t) => t.status === "DONE"))
    : false;
  const atRisk = !dayCleared && new Date().getHours() >= 20;
  return (
    <>
      <div className="hidden md:flex items-center gap-1.5 text-[13px]">
        <Zap size={13} style={{ color: "#F59E0B" }} />
        <span className="font-semibold">{profile.xp} XP</span>
        <span className="text-muted-foreground hidden lg:inline">· {level.name}</span>
      </div>
      <div className="flex items-center gap-1 text-[13px]" title="streak">
        <Flame size={15} className={atRisk ? "" : "flame-pulse"} style={{ color: atRisk ? "#5A6B7D" : "#F59E0B" }} />
        <span className="font-semibold">{profile.streak}</span>
      </div>
      <button
        onClick={() => go("/roadmap")}
        className="rounded-md border border-border bg-card px-2.5 py-1 text-[12.5px] font-mono hover:border-primary/50 transition-colors"
      >
        {dLeft >= 0 ? `D-${dLeft}` : "D-DAY"}
      </button>
    </>
  );
}
