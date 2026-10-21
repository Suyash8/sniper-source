"use client";

import { useState } from "react";
import { Download, Upload, Trash2 } from "lucide-react";
import { useSniper } from "@/lib/sniper-store";
import { go, useDerived, DOMAINS, TOPICS, PROBLEMS } from "@/lib/derive";
import { ROADMAP } from "@/content/roadmap";
import { todayStr } from "@/lib/engine";
import { ProgressRing, MiniBar } from "./ui-bits";

// ─── /roadmap ───────────────────────────────────────────────────────────
export function RoadmapView() {
  const { profile } = useDerived();
  const days = useSniper((s) => s.days);
  const [sel, setSel] = useState(0);
  // roadmap day i maps to calendar date firstLaunch + i
  const first = profile.firstLaunch || todayStr();
  const dateFor = (i: number) => {
    const [y, m, d] = first.split("-").map(Number);
    const dt = new Date(y, m - 1, d + i);
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
  };
  const today = todayStr();
  const activeIdx = ROADMAP.findIndex((r) => dateFor(r.offset) === today);
  const current = sel !== null ? sel : Math.max(0, activeIdx);
  const day = ROADMAP[current];

  return (
    <div className="view-enter max-w-[900px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Roadmap — D-9 to D-0</h1>
      <p className="text-[13px] text-muted-foreground mb-5">The full campaign. Today is highlighted; every prior day shows its completion state.</p>
      <div className="flex gap-2 overflow-x-auto code-scroll pb-2 mb-5">
        {ROADMAP.map((r) => {
          const date = dateFor(r.offset);
          const plan = days[date];
          const total = plan?.blocks.reduce((a, b) => a + b.tasks.length, 0) ?? 0;
          const done = plan?.blocks.reduce((a, b) => a + b.tasks.filter((t) => t.status === "DONE").length, 0) ?? 0;
          const isToday = date === today;
          const complete = total > 0 && done === total;
          return (
            <button
              key={r.offset}
              onClick={() => setSel(r.offset)}
              className={
                "shrink-0 rounded-lg border px-3 py-2 text-center transition-all " +
                (current === r.offset ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/40")
              }
            >
              <div className="text-[11px] font-mono text-muted-foreground">D-{9 - r.offset}</div>
              <div className="text-[16px]">{complete ? "✓" : isToday ? "●" : r.offset === 9 ? "🎯" : "·"}</div>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-mono text-[12px] rounded px-2 py-0.5 border border-border text-muted-foreground">D-{9 - day.offset}</span>
          <h2 className="font-bold text-[15px]">{day.label}</h2>
        </div>
        <div className="space-y-3">
          {day.blocks.map((b, i) => (
            <div key={i} className="rounded-lg border border-border/70 bg-secondary/40 p-3">
              <span className="text-[11px] font-bold tracking-wider text-primary">{b.type}</span>
              <p className="text-[13.5px] mt-1">{b.note}</p>
              {b.topicIds && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {b.topicIds.map((tid) => (
                    <button key={tid} onClick={() => go(`/topics/C/${tid}`)} className="text-[11.5px] font-mono rounded border border-border px-1.5 py-0.5 hover:border-primary/50">
                      {tid}
                    </button>
                  ))}
                </div>
              )}
              {b.problemIds && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {b.problemIds.map((pid) => (
                    <button key={pid} onClick={() => go(`/problems/${pid}`)} className="text-[11.5px] font-mono rounded border border-border px-1.5 py-0.5 hover:border-primary/50">
                      {pid}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── /stats ─────────────────────────────────────────────────────────────
export function StatsView() {
  const { domainMastery, readiness, solved } = useDerived();
  const days = useSniper((s) => s.days);
  const problemStates = useSniper((s) => s.problems);

  // XP-ish timeline: tasks done per day, last 10 days
  const timeline = Array.from({ length: 10 }, (_, i) => {
    const [ty, tm, td] = todayStr().split("-").map(Number);
    const dt = new Date(ty, tm - 1, td - (9 - i));
    const ds = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    const plan = days[ds];
    const done = plan?.blocks.reduce((a, b) => a + b.tasks.filter((t) => t.status === "DONE").length, 0) ?? 0;
    return { ds, done };
  });
  const maxDone = Math.max(1, ...timeline.map((t) => t.done));

  const byPattern = new Map<string, { total: number; solved: number }>();
  for (const p of PROBLEMS) {
    const cur = byPattern.get(p.pattern) ?? { total: 0, solved: 0 };
    cur.total += 1;
    if (problemStates[p.id]?.status === "SOLVED") cur.solved += 1;
    byPattern.set(p.pattern, cur);
  }

  const weakest3 = DOMAINS.map((d) => ({ d, m: domainMastery(d.id) })).sort((a, b) => a.m - b.m).slice(0, 3);

  return (
    <div className="view-enter max-w-[1100px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Stats</h1>
      <p className="text-[13px] text-muted-foreground mb-6">Readiness {Math.round(readiness)}% · {solved} problems solved.</p>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3 mb-8">
        {DOMAINS.map((d) => (
          <button key={d.id} onClick={() => go(`/topics/${d.id}`)} className="rounded-xl border border-border bg-card p-3 flex flex-col items-center gap-2 hover:-translate-y-0.5 transition-all">
            <ProgressRing
              value={domainMastery(d.id)} size={48} stroke={5} color={d.color}
              label={<span className="text-[10px] font-bold" style={{ color: d.color }}>{Math.round(domainMastery(d.id) * 100)}</span>}
            />
            <span className="text-[10.5px] text-muted-foreground text-center leading-tight">{d.name}</span>
          </button>
        ))}
      </div>

      <h2 className="font-bold text-[15px] mb-3">Tasks done — last 10 days</h2>
      <div className="rounded-xl border border-border bg-card p-5 mb-8">
        <div className="flex items-end gap-2 h-28">
          {timeline.map((t) => (
            <div key={t.ds} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t bg-primary/80" style={{ height: `${(t.done / maxDone) * 100}%`, minHeight: t.done ? 4 : 2 }} />
              <span className="text-[9.5px] text-muted-foreground font-mono">{t.ds.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div>
          <h2 className="font-bold text-[15px] mb-3">Solved vs total per pattern</h2>
          <div className="space-y-2 max-h-80 overflow-y-auto code-scroll pr-1">
            {[...byPattern.entries()].sort((a, b) => b[1].total - a[1].total).map(([pat, v]) => (
              <div key={pat} className="grid grid-cols-[130px_1fr_50px] items-center gap-2 text-[12.5px]">
                <span className="truncate text-muted-foreground">{pat}</span>
                <MiniBar value={v.solved / v.total} color="#34D399" />
                <span className="text-right font-mono text-muted-foreground">{v.solved}/{v.total}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-[15px] mb-3">Weakest 3 — fix these first</h2>
          <div className="space-y-2">
            {weakest3.map(({ d, m }) => (
              <button key={d.id} onClick={() => go(`/topics/${d.id}`)} className="w-full rounded-lg border border-border bg-card p-3 flex items-center gap-3 text-left hover:border-primary/40">
                <span className="font-bold text-[13px] w-6" style={{ color: d.color }}>{Math.round(m * 100)}%</span>
                <span className="flex-1 text-[13.5px]">{d.name}</span>
                <span className="text-[11.5px] text-muted-foreground">{d.weight}% weight</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── /settings ──────────────────────────────────────────────────────────
export function SettingsView() {
  const { profile } = useDerived();
  const setExamDate = useSniper((s) => s.setExamDate);
  const setBudget = useSniper((s) => s.setBudget);
  const settings = useSniper((s) => s.settings);
  const setSettings = useSniper((s) => s.setSettings);
  const exportData = useSniper((s) => s.exportData);
  const importData = useSniper((s) => s.importData);
  const resetAll = useSniper((s) => s.resetAll);
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  const doExport = () => {
    const blob = new Blob([exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sniper-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Backup downloaded.");
  };

  return (
    <div className="view-enter max-w-[700px] mx-auto px-4 md:px-6 py-6">
      <h1 className="text-xl font-bold mb-1">Settings</h1>
      <p className="text-[13px] text-muted-foreground mb-6">All data lives in this browser&apos;s localStorage — nothing ever leaves the machine.</p>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-[14px] mb-3">Exam</h2>
          <label className="block text-[12.5px] text-muted-foreground mb-1">Exam date (drives the D-n counter)</label>
          <input
            type="date" value={profile.examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-[13.5px] outline-none focus:border-primary/60"
          />
          <label className="block text-[12.5px] text-muted-foreground mt-4 mb-1">Daily budget: {profile.dailyBudget} minutes</label>
          <input
            type="range" min={60} max={360} step={15} value={profile.dailyBudget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-[#22D3EE]"
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-[14px] mb-3">Effects</h2>
          {[
            { key: "confetti" as const, label: "Confetti on mastery / day clear" },
            { key: "toasts" as const, label: "XP toasts" },
          ].map((row) => (
            <label key={row.key} className="flex items-center justify-between py-1.5 text-[13.5px]">
              {row.label}
              <input
                type="checkbox" checked={settings[row.key]}
                onChange={(e) => setSettings({ [row.key]: e.target.checked })}
                className="w-4 h-4 accent-[#22D3EE]"
              />
            </label>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="font-bold text-[14px] mb-3">Data</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={doExport} className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-[13px] hover:border-primary/50">
              <Download size={14} /> Export backup JSON
            </button>
            <label className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-3 py-2 text-[13px] hover:border-primary/50 cursor-pointer">
              <Upload size={14} /> Import backup
              <input
                type="file" accept="application/json" className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const ok = importData(await f.text());
                  setMsg(ok ? "Backup restored." : "Invalid backup file.");
                }}
              />
            </label>
          </div>
          {msg && <p className="text-[12.5px] text-primary mt-2">{msg}</p>}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[13px] text-[#F87171] font-medium mb-2">Danger zone</p>
            <div className="flex gap-2">
              <input
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Type RESET to burn everything"
                className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-[13px] outline-none focus:border-[#F87171]/60"
              />
              <button
                disabled={confirm !== "RESET"}
                onClick={() => { resetAll(); setConfirm(""); setMsg("Everything burned. Fresh start."); }}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[13px] font-semibold bg-[#F87171]/15 text-[#F87171] border border-[#F87171]/40 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 size={14} /> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 text-[12.5px] text-muted-foreground">
          <h2 className="font-bold text-[14px] mb-2 text-foreground">About your data</h2>
          Progress, notes and plans are stored under the <code className="font-mono text-primary">sniper:v1:*</code> keys
          in localStorage. Export before switching browsers or clearing site data. {TOPICS.length} topics and{" "}
          {PROBLEMS.length} problems ship inside the app itself — they work fully offline.
        </div>
      </div>
    </div>
  );
}
