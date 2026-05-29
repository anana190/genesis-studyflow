import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  CheckCircle2, Circle, Clock, Flame, BookOpen, Calendar as CalIcon,
  TrendingUp, Sparkles, ArrowUpRight,
} from "lucide-react";
import { useState } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, RadialBarChart, RadialBar, PolarAngleAxis,
} from "recharts";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudyFlow AI" },
      { name: "description", content: "Your study command center: tasks, deadlines, analytics and AI-generated schedule." },
    ],
  }),
  component: Dashboard,
});

const weekData = [
  { d: "Mon", focus: 95, target: 120 },
  { d: "Tue", focus: 140, target: 120 },
  { d: "Wed", focus: 80, target: 120 },
  { d: "Thu", focus: 165, target: 120 },
  { d: "Fri", focus: 120, target: 120 },
  { d: "Sat", focus: 60, target: 120 },
  { d: "Sun", focus: 110, target: 120 },
];

const subjectData = [
  { name: "Math", hrs: 8.5 },
  { name: "Physics", hrs: 6.2 },
  { name: "CS", hrs: 9.1 },
  { name: "History", hrs: 3.4 },
  { name: "English", hrs: 4.7 },
];

const progressData = [{ name: "progress", value: 76, fill: "url(#progressGrad)" }];

const initialTasks = [
  { id: 1, title: "Finish Calc problem set 4.2", subject: "Math", time: "45m", done: false, priority: "high" },
  { id: 2, title: "Read Chapter 6 — Quantum Mechanics", subject: "Physics", time: "1h 20m", done: false, priority: "med" },
  { id: 3, title: "Outline history essay", subject: "History", time: "30m", done: true, priority: "med" },
  { id: 4, title: "Practice algorithms (Leetcode 3x)", subject: "CS", time: "1h", done: false, priority: "high" },
  { id: 5, title: "Review Spanish vocab deck", subject: "Spanish", time: "20m", done: true, priority: "low" },
];

const deadlines = [
  { title: "Calculus Midterm", course: "MATH 201", days: 3, accent: "from-primary to-accent" },
  { title: "History Essay Due", course: "HIST 110", days: 5, accent: "from-accent to-primary" },
  { title: "CS Project Submission", course: "CS 161", days: 8, accent: "from-primary to-accent" },
  { title: "Physics Lab Report", course: "PHYS 220", days: 12, accent: "from-accent to-primary" },
];

const aiCards = [
  { time: "9:00 — 10:30", title: "Deep work: Calculus integration", reason: "Highest cognitive load — schedule peak hours" },
  { time: "11:00 — 11:45", title: "Active recall: Physics flashcards", reason: "Spaced repetition due today" },
  { time: "2:30 — 4:00", title: "Build: CS project module", reason: "Deadline in 8 days · break into 2 sessions" },
];

function priorityBadge(p: string) {
  const map: Record<string, string> = {
    high: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    med: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    low: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  };
  return map[p];
}

function Dashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const toggle = (id: number) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));

  const completed = tasks.filter((t) => t.done).length;

  return (
    <AppShell>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Good evening, Alex 👋</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            Your <span className="gradient-text">study flow</span> today
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 self-start rounded-full glass px-3 py-1.5 text-xs">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          12-day streak · keep it going
        </div>
      </div>

      {/* Stat row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Focus today", value: "2h 45m", icon: Clock, delta: "+18%" },
          { label: "Tasks done", value: `${completed}/${tasks.length}`, icon: CheckCircle2, delta: "On track" },
          { label: "Weekly goal", value: "76%", icon: TrendingUp, delta: "+4%" },
          { label: "Subjects active", value: "5", icon: BookOpen, delta: "Balanced" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.label}</span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-2xl font-semibold">{s.value}</div>
            <div className="mt-1 inline-flex items-center gap-1 text-xs text-emerald-300">
              <ArrowUpRight className="h-3 w-3" /> {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Focus chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Focus minutes this week</h2>
              <p className="text-xs text-muted-foreground">Target: 120 min/day</p>
            </div>
            <span className="rounded-full glass px-3 py-1 text-xs text-muted-foreground">Last 7 days</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 295)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="oklch(0.65 0.20 250)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis dataKey="d" tick={{ fill: "oklch(0.72 0.03 280)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.03 280)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.05 282 / 0.9)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    color: "white",
                  }}
                />
                <Area type="monotone" dataKey="focus" stroke="oklch(0.68 0.22 295)" strokeWidth={2} fill="url(#focusGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress radial */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Weekly goal</h2>
          <p className="text-xs text-muted-foreground">14 hours target</p>
          <div className="relative mx-auto mt-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={progressData} startAngle={90} endAngle={-270}>
                <defs>
                  <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 295)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.20 250)" />
                  </linearGradient>
                </defs>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "oklch(1 0 0 / 0.06)" }} dataKey="value" cornerRadius={20} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">76%</div>
                <div className="text-xs text-muted-foreground">10.6 / 14 h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Today's tasks</h2>
            <button className="rounded-lg glass px-3 py-1.5 text-xs hover:bg-white/10">+ Add task</button>
          </div>
          <ul className="divide-y divide-white/5">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center gap-3 py-3">
                <button onClick={() => toggle(t.id)} className="text-primary">
                  {t.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={cn("truncate text-sm", t.done && "line-through text-muted-foreground")}>{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.subject} · {t.time}</div>
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide", priorityBadge(t.priority))}>
                  {t.priority}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Deadlines */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-semibold">Upcoming deadlines</h2>
          <div className="mt-4 space-y-3">
            {deadlines.map((d) => (
              <div key={d.title} className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${d.accent} text-white`}>
                  <div className="text-center leading-none">
                    <div className="text-base font-semibold">{d.days}</div>
                    <div className="text-[9px] uppercase">days</div>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{d.title}</div>
                  <div className="text-xs text-muted-foreground">{d.course}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subjects bar chart */}
        <div className="glass rounded-2xl p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Hours by subject</h2>
            <span className="text-xs text-muted-foreground">This week</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.68 0.22 295)" />
                    <stop offset="100%" stopColor="oklch(0.65 0.20 250)" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.08)" />
                <XAxis dataKey="name" tick={{ fill: "oklch(0.72 0.03 280)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "oklch(0.72 0.03 280)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 0.05)" }}
                  contentStyle={{
                    background: "oklch(0.22 0.05 282 / 0.9)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                  }}
                />
                <Bar dataKey="hrs" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Schedule */}
        <div className="glass rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <div>
              <h2 className="font-semibold leading-tight">AI Schedule</h2>
              <p className="text-xs text-muted-foreground">Optimized for today</p>
            </div>
          </div>
          <div className="space-y-3">
            {aiCards.map((c) => (
              <div key={c.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="text-xs text-primary">{c.time}</div>
                <div className="mt-1 text-sm font-medium">{c.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{c.reason}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Calendar mini */}
        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalIcon className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Study calendar</h2>
            </div>
            <span className="text-xs text-muted-foreground">December 2026</span>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i}>{d}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const day = i - 2;
              const valid = day > 0 && day <= 31;
              const intensity = valid ? ((day * 7) % 100) / 100 : 0;
              const isToday = day === 12;
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-lg text-xs grid place-items-center transition",
                    !valid && "opacity-0",
                    isToday && "ring-2 ring-primary",
                  )}
                  style={{
                    background: valid
                      ? `linear-gradient(135deg, oklch(0.68 0.22 295 / ${0.1 + intensity * 0.5}), oklch(0.65 0.20 250 / ${0.05 + intensity * 0.4}))`
                      : "transparent",
                  }}
                >
                  {valid ? day : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}