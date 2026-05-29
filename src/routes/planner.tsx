import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Wand2, Clock, Brain, Target, Zap, ChevronRight, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Planner — StudyFlow AI" },
      { name: "description", content: "Smart study recommendations, priority-based scheduling and daily optimization." },
    ],
  }),
  component: Planner,
});

const defaultPlan = [
  { time: "08:30", dur: "45m", title: "Active recall: Biology Ch.4", tag: "Memory", priority: "high",
    why: "Quiz in 2 days · spaced repetition window opens this morning" },
  { time: "09:30", dur: "1h 30m", title: "Deep work: Calculus integration", tag: "Deep Work", priority: "high",
    why: "Highest cognitive load — scheduled in your peak focus window" },
  { time: "11:15", dur: "20m", title: "Break + walk", tag: "Recovery", priority: "low",
    why: "Reset attention before next session" },
  { time: "11:35", dur: "1h", title: "CS project — auth module", tag: "Build", priority: "med",
    why: "Project due in 8 days · broken into focused chunks" },
  { time: "14:00", dur: "45m", title: "History essay outline", tag: "Writing", priority: "med",
    why: "Easier creative task for post-lunch dip" },
  { time: "15:30", dur: "30m", title: "Spanish vocab deck", tag: "Practice", priority: "low",
    why: "Maintain daily streak with low effort review" },
];

const recs = [
  { icon: Brain, title: "Front-load tough subjects", desc: "Your focus peaks 9–11 AM. Schedule Math & Physics there." },
  { icon: Zap, title: "Shorter Pomodoros today", desc: "Yesterday's data shows attention dipped after 30m. Try 25/5." },
  { icon: Target, title: "Catch up on History", desc: "You're 2.5h behind weekly target. We added a 45m block." },
];

function priorityDot(p: string) {
  const map: Record<string, string> = {
    high: "bg-rose-400",
    med: "bg-amber-300",
    low: "bg-emerald-300",
  };
  return map[p];
}

function Planner() {
  const [goal, setGoal] = useState("Ace my calculus midterm + finish CS project");
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState(defaultPlan);

  const regenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setPlan((p) => [...p].sort(() => Math.random() - 0.5));
      setGenerating(false);
    }, 900);
  };

  return (
    <AppShell>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Planner
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Your <span className="gradient-text">optimized day</span>, generated.
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what you want to achieve — we balance priority, deadlines and your energy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Goal composer */}
        <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">Today's goal</label>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/60"
              placeholder="e.g. Finish chemistry lab + revise vocab"
            />
            <button
              onClick={regenerate}
              className="inline-flex items-center justify-center gap-2 rounded-xl gradient-primary px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02]"
            >
              <Wand2 className={cn("h-4 w-4", generating && "animate-spin")} />
              {generating ? "Generating…" : "Generate Plan"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Exam in 3 days", "Low energy day", "Group project", "Catch up mode"].map((c) => (
              <button key={c} className="rounded-full bg-white/5 px-3 py-1 text-xs text-muted-foreground hover:bg-white/10">
                + {c}
              </button>
            ))}
          </div>
        </div>

        {/* Daily score */}
        <div className="glass rounded-2xl p-6">
          <div className="text-xs text-muted-foreground">Daily optimization</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-4xl font-bold gradient-text">94</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Balanced across priority, breaks and subject variety. Nice work.
          </p>
          <div className="mt-4 space-y-2">
            {[
              { l: "Focus alignment", v: 96 },
              { l: "Break ratio", v: 88 },
              { l: "Deadline coverage", v: 92 },
            ].map((m) => (
              <div key={m.l}>
                <div className="flex justify-between text-[11px] text-muted-foreground">
                  <span>{m.l}</span><span>{m.v}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full gradient-primary" style={{ width: `${m.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule timeline */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Today's schedule</h2>
            <button className="inline-flex items-center gap-1 rounded-lg glass px-3 py-1.5 text-xs hover:bg-white/10">
              <Plus className="h-3 w-3" /> Add block
            </button>
          </div>

          <ol className="relative space-y-3 border-l border-white/10 pl-5">
            {plan.map((b, i) => (
              <li key={i} className="group relative animate-fade-up">
                <span className={cn("absolute -left-[26px] top-3 h-2.5 w-2.5 rounded-full ring-4 ring-background", priorityDot(b.priority))} />
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" /> {b.time} · {b.dur}
                    </div>
                    <span className="rounded-full bg-gradient-to-r from-primary/30 to-accent/30 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-primary-foreground">
                      {b.tag}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-medium">{b.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{b.why}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Recommendations */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Smart recommendations</h2>
          <p className="text-xs text-muted-foreground">Based on your last 14 days</p>
          <div className="mt-4 space-y-3">
            {recs.map((r) => (
              <button
                key={r.title}
                className="flex w-full items-start gap-3 rounded-xl bg-white/5 p-3 text-left transition hover:bg-white/10"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg gradient-primary">
                  <r.icon className="h-4 w-4 text-white" />
                </span>
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{r.desc}</div>
                </div>
                <ChevronRight className="mt-2 h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}