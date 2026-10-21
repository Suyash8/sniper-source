"use client";

import { useEffect, useState } from "react";
import { TOPICS } from "@/content";
import { PROBLEMS } from "@/content/problems";
import { DOMAINS, domainById } from "@/content/domains";
import type { TopicStatus, ProblemStatus } from "@/content/types";
import { useSniper } from "./sniper-store";
import { TOPIC_MASTERY } from "./engine";

// ─── hash router ────────────────────────────────────────────────────────
export type Route =
  | { v: "dashboard" }
  | { v: "today" }
  | { v: "topics" }
  | { v: "domain"; domainId: string }
  | { v: "topic"; domainId: string; topicId: string }
  | { v: "problems" }
  | { v: "problem"; pid: string }
  | { v: "roadmap" }
  | { v: "stats" }
  | { v: "settings" };

export function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, "");
  const seg = h.split("/").filter(Boolean);
  if (seg.length === 0) return { v: "dashboard" };
  switch (seg[0]) {
    case "today": return { v: "today" };
    case "topics":
      if (seg[1] && seg[2]) return { v: "topic", domainId: seg[1], topicId: seg[2] };
      if (seg[1]) return { v: "domain", domainId: seg[1] };
      return { v: "topics" };
    case "problems":
      if (seg[1]) return { v: "problem", pid: seg[1] };
      return { v: "problems" };
    case "roadmap": return { v: "roadmap" };
    case "stats": return { v: "stats" };
    case "settings": return { v: "settings" };
    default: return { v: "dashboard" };
  }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === "undefined" ? { v: "dashboard" as const } : parseHash(),
  );
  useEffect(() => {
    const on = () => {
      setRoute(parseHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export function go(path: string) {
  window.location.hash = path;
}

// ─── derived stats ──────────────────────────────────────────────────────
export function useDerived() {
  const topics = useSniper((s) => s.topics);
  const problems = useSniper((s) => s.problems);
  const profile = useSniper((s) => s.profile);

  const topicMastery = (t: { status?: TopicStatus }) =>
    TOPIC_MASTERY[t?.status ?? "NOT_STARTED"];

  const domainMastery = (domId: string) => {
    const domTopics = TOPICS.filter((t) => t.domainId === domId);
    const domProblems = PROBLEMS.filter((p) => p.domainId === domId);
    const tm = domTopics.reduce((a, t) => a + topicMastery(topics[t.id]), 0) / (domTopics.length || 1);
    let pr: number;
    if (domProblems.length === 0) {
      pr = tm; // no problems → topic mastery only
    } else {
      pr = domProblems.reduce((a, p) => {
        const st = problems[p.id]?.status ?? "TODO";
        return a + (st === "SOLVED" ? 1 : st === "TODO" ? 0 : 0.3);
      }, 0) / domProblems.length;
    }
    return 0.6 * tm + 0.4 * pr;
  };

  const readiness = DOMAINS.reduce((a, d) => a + domainMastery(d.id) * d.weight, 0);

  const solved = PROBLEMS.filter((p) => problems[p.id]?.status === "SOLVED").length;
  const mastered = TOPICS.filter((t) => topics[t.id]?.status === "MASTERED").length;
  const learned = TOPICS.filter((t) =>
    topics[t.id]?.status === "LEARNED" || topics[t.id]?.status === "MASTERED").length;

  // weakest flank: lowest weighted shortfall
  const weakest = DOMAINS.map((d) => ({ d, gap: d.weight * (1 - domainMastery(d.id)) }))
    .sort((a, b) => b.gap - a.gap)[0].d;

  const dLeft = (() => {
    const [y, m, d] = profile.examDate.split("-").map(Number);
    const now = new Date();
    const ms = Date.UTC(y, m - 1, d) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round(ms / 86400000);
  })();

  return { topics, problems, profile, domainMastery, readiness, solved, mastered, learned, weakest, dLeft };
}

export function topicsOfDomain(domId: string) {
  return TOPICS.filter((t) => t.domainId === domId);
}
export function problemsOfDomain(domId: string) {
  return PROBLEMS.filter((p) => p.domainId === domId);
}
export { DOMAINS, domainById, TOPICS, PROBLEMS };
export type { TopicStatus, ProblemStatus };
