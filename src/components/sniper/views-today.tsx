"use client";

import { useEffect } from "react";
import { useSniper } from "@/lib/sniper-store";
import { go, topicsOfDomain } from "@/lib/derive";
import type { DayBlock } from "@/content/types";
import { topicById } from "@/content";
import { problemById } from "@/content/problems";
import { todayStr } from "@/lib/engine";
import { MiniBar, StatusPill, fireConfetti } from "./ui-bits";
import { toast } from "@/hooks/use-toast";

const BLOCK_META: Record<DayBlock["type"], { color: string; note: string }> = {
  REVISE: { color: "#A78BFA", note: "Due for revision — Leitner spaced" },
  LEARN: { color: "#22D3EE", note: "New lesson" },
  PRACTICE: { color: "#34D399", note: "Problems — solve before peeking" },
  DRILL: { color: "#FBBF24", note: "Speed drill — paper only" },
};

export function TodayView() {
  const generateDay = useSniper((s) => s.generateDay);
  const setTaskStatus = useSniper((s) => s.setTaskStatus);
  const dropBox = useSniper((s) => s.dropBox);
  const settings = useSniper((s) => s.settings);
  const profile = useSniper((s) => s.profile);
  const dayDone = useSniper((s) => s.dayDone);
  const today = todayStr();
  const plan = useSniper((s) => s.days[today]);
  const cleared = dayDone(today);

  useEffect(() => {
    if (!plan && profile) generateDay(today);
     
  }, [plan === undefined]);

  useEffect(() => {
    if (cleared && settings.confetti) fireConfetti();
     
  }, [cleared]);

  const totalMin = plan?.blocks.reduce((a, b) => a + b.tasks.reduce((x, t) => x + t.minutes, 0), 0) ?? 0;

  return (
    <div className="view-enter max-w-[900px] mx-auto px-4 md:px-6 py-6">
      <div className="flex flex-wrap items-center gap-3 mb-1">
        <h1 className="text-xl font-bold">Today&apos;s Battle Plan</h1>
        <span className="font-mono text-[12.5px] text-muted-foreground border border-border rounded px-2 py-0.5">{today}</span>
      </div>
      <p className="text-[13px] text-muted-foreground mb-6">
        {totalMin} minutes planned · budget {profile.dailyBudget}m · clear every block to keep the streak safe.
      </p>

      {!plan && <p className="text-sm text-muted-foreground">Generating…</p>}

      {plan?.blocks.map((block, bi) => {
        const meta = BLOCK_META[block.type];
        const done = block.tasks.every((t) => t.status === "DONE");
        return (
          <div
            key={bi}
            className="rounded-xl border border-border bg-card mb-4 overflow-hidden"
            style={done ? { borderColor: "#34D39955" } : undefined}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/40">
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-bold tracking-wider rounded px-2 py-0.5"
                  style={{ color: meta.color, background: `${meta.color}15`, border: `1px solid ${meta.color}40` }}>
                  {block.type}
                </span>
                <span className="text-[12px] text-muted-foreground hidden sm:inline">{meta.note}</span>
              </div>
              <span className="text-[12px] text-muted-foreground font-mono">
                {block.tasks.reduce((a, t) => a + t.minutes, 0)}m
              </span>
            </div>
            <ul>
              {block.tasks.map((task, ti) => {
                const topic = task.kind === "topic" ? topicById(task.refId) : undefined;
                const prob = task.kind === "problem" ? problemById(task.refId) : undefined;
                const title = topic?.title ?? prob?.title ?? task.refId;
                const isDone = task.status === "DONE";
                return (
                  <li key={ti} className="flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0">
                    <button
                      aria-label={isDone ? "Mark pending" : "Mark done"}
                      onClick={() => {
                        const next = isDone ? "PENDING" : "DONE";
                        setTaskStatus(today, bi, ti, next);
                        if (next === "PENDING" && task.kind === "topic") dropBox(task.refId);
                        if (next === "DONE") {
                          toast({ title: `+${task.kind === "topic" ? 10 : 30} XP`, description: title });
                        }
                      }}
                      className={
                        "w-5 h-5 shrink-0 rounded border flex items-center justify-center transition-all " +
                        (isDone ? "bg-[#34D399] border-[#34D399]" : "border-[#3d4f63] hover:border-primary")
                      }
                    >
                      {isDone && (
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6.5L4.8 9L10 3.5" stroke="#06202A" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() =>
                        go(task.kind === "topic" ? `/topics/${topic?.domainId ?? "C"}/${task.refId}` : `/problems/${task.refId}`)
                      }
                      className={"flex-1 text-left text-[14px] hover:text-primary transition-colors " + (isDone ? "line-through text-muted-foreground" : "")}
                    >
                      {title}
                    </button>
                    <span className="text-[11px] text-muted-foreground shrink-0">{task.minutes}m</span>
                    {prob && <StatusPill status={useSniper.getState().problems[prob.id]?.status ?? "TODO"} kind="problem" />}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}

      {plan && plan.blocks.length > 0 && (
        <div className="flex items-center gap-4 mt-6">
          <MiniBar value={plan.blocks.reduce((a, b) => a + b.tasks.filter((t) => t.status === "DONE").length, 0) /
            plan.blocks.reduce((a, b) => a + b.tasks.length, 0)} />
          <span className="text-[13px] font-medium shrink-0">
            {cleared ? "Day cleared. Streak safe. Sleep." : "Keep pushing."}
          </span>
        </div>
      )}
    </div>
  );
}
