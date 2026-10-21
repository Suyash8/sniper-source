"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard, CalendarCheck, Library, ListChecks, Route, BarChart3, Settings as SettingsIcon,
  Crosshair, ChevronDown,
} from "lucide-react";
import { useRoute, go, DOMAINS, useDerived } from "@/lib/derive";
import { useSniper } from "@/lib/sniper-store";
import { cn } from "@/lib/utils";
import { DashboardView, HeaderBits } from "./views-dashboard";
import { TodayView } from "./views-today";
import { TopicsIndexView, DomainView, TopicView } from "./views-topics";
import { ProblemsIndexView, ProblemView } from "./views-problems";
import { RoadmapView, StatsView, SettingsView } from "./views-misc";

const NAV = [
  { path: "/", label: "Today's board", icon: LayoutDashboard, match: (v: string) => v === "dashboard" },
  { path: "/today", label: "Battle Plan", icon: CalendarCheck, match: (v: string) => v === "today" },
  { path: "/topics", label: "Topics", icon: Library, match: (v: string) => v.startsWith("topic") || v === "domain" },
  { path: "/problems", label: "Problems", icon: ListChecks, match: (v: string) => v.startsWith("problem") },
  { path: "/roadmap", label: "Roadmap", icon: Route, match: (v: string) => v === "roadmap" },
  { path: "/stats", label: "Stats", icon: BarChart3, match: (v: string) => v === "stats" },
  { path: "/settings", label: "Settings", icon: SettingsIcon, match: (v: string) => v === "settings" },
];

function NavRail({ route }: { route: { v: string } }) {
  const [topicsOpen, setTopicsOpen] = useState(true);
  const { domainMastery } = useDerived();
  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-border bg-card/60 min-h-screen sticky top-0 h-screen overflow-y-auto code-scroll">
      <button
        onClick={() => go("/")}
        className="flex items-center gap-3 px-5 h-16 border-b border-border text-left"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 border border-primary/30">
          <Crosshair size={18} className="text-primary" />
        </span>
        <span>
          <span className="block font-bold tracking-[0.18em] text-[14px] text-primary">SNIPER</span>
          <span className="block text-[10.5px] text-muted-foreground">Accenture D-9</span>
        </span>
      </button>
      <nav className="p-3 space-y-0.5">
        {NAV.map((n) => (
          <button
            key={n.path}
            onClick={() => go(n.path)}
            className={cn(
              "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition-colors",
              n.match(route.v) ? "bg-primary/10 text-primary font-medium" : "text-foreground/75 hover:bg-secondary",
            )}
          >
            <n.icon size={16} />
            {n.label}
          </button>
        ))}
        <button
          onClick={() => setTopicsOpen((o) => !o)}
          className="w-full flex items-center justify-between rounded-lg px-3 py-2 mt-2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
        >
          Domains
          <ChevronDown size={13} className={cn("transition-transform", topicsOpen && "rotate-180")} />
        </button>
        {topicsOpen && DOMAINS.map((d) => {
          const m = domainMastery(d.id);
          return (
            <button
              key={d.id}
              onClick={() => go(`/topics/${d.id}`)}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[12.5px] text-foreground/70 hover:bg-secondary"
            >
              <span className="w-1.5 h-6 rounded-full shrink-0" style={{ background: d.color, opacity: 0.35 + m * 0.65 }} />
              <span className="flex-1 text-left truncate">{d.name}</span>
              <span className="font-mono text-[10.5px] text-muted-foreground">{Math.round(m * 100)}%</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto p-4 text-[10.5px] text-muted-foreground border-t border-border">
        Everything local. Nothing tracked. Just you vs the clock.
      </div>
    </aside>
  );
}

function MobileTabs({ route }: { route: { v: string } }) {
  const tabs = NAV.filter((n) => ["/", "/today", "/topics", "/problems", "/stats"].includes(n.path));
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      {tabs.map((n) => (
        <button
          key={n.path}
          onClick={() => go(n.path)}
          className={cn(
            "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px]",
            n.match(route.v) ? "text-primary" : "text-muted-foreground",
          )}
        >
          <n.icon size={18} />
          {n.label.split(" ")[0]}
        </button>
      ))}
    </nav>
  );
}

export function SniperApp() {
  const route = useRoute();
  const hydrated = useSniper((s) => s.hydrated);

  // guard: default exam date for very first launch
  const profile = useSniper((s) => s.profile);
  useEffect(() => {
    if (hydrated && !profile.examDate) {
      useSniper.setState((s) => ({ profile: { ...s.profile, examDate: s.profile.examDate || profile.examDate } }));
    }
  }, [hydrated, profile.examDate]);

  let view: React.ReactNode;
  switch (route.v) {
    case "today": view = <TodayView />; break;
    case "topics": view = <TopicsIndexView />; break;
    case "domain": view = <DomainView domainId={(route as { domainId: string }).domainId} />; break;
    case "topic": {
      const r = route as { topicId: string };
      view = <TopicView topicId={r.topicId} />;
      break;
    }
    case "problems": view = <ProblemsIndexView />; break;
    case "problem": view = <ProblemView pid={(route as { pid: string }).pid} />; break;
    case "roadmap": view = <RoadmapView />; break;
    case "stats": view = <StatsView />; break;
    case "settings": view = <SettingsView />; break;
    default: view = <DashboardView />;
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Crosshair size={20} className="text-primary animate-spin" style={{ animationDuration: "2s" }} />
          <span className="text-sm font-mono">loading sniper…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <NavRail route={route} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* header */}
          <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/90 backdrop-blur flex items-center justify-between px-4 md:px-6">
            <button onClick={() => go("/")} className="flex items-center gap-2 lg:hidden">
              <Crosshair size={18} className="text-primary" />
              <span className="font-bold tracking-[0.15em] text-[13px] text-primary">SNIPER</span>
            </button>
            <div className="hidden lg:block text-[12px] text-muted-foreground">
              &quot;Mastered is earned: all linked problems solved, box ≥ 3.&quot;
            </div>
            <div className="flex items-center gap-3">
              <HeaderBits />
            </div>
          </header>
          <main className="flex-1 pb-20 lg:pb-0">{view}</main>
        </div>
      </div>
      <MobileTabs route={route} />
    </div>
  );
}
