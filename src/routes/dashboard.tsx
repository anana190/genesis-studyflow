import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  CheckCircle2, Circle, Clock, Flame, BookOpen, Calendar as CalIcon,
  TrendingUp, Sparkles, ArrowUpRight, Trash2, Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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

const deadlines = [
  { title: "Calculus Midterm", course: "MATH 201", days: 3, accent: "from-primary to-accent" },
  { title: "History Essay Due", course: "HIST 110", days: 5, accent: "from-accent to-primary" },
  { title: "CS Project Submission", course: "CS 161", days: 8, accent: "from-primary to-accent" },
  { title: "Physics Lab Report", course: "PHYS 220", days: 12, accent: "from-accent to-primary" },
];

function priorityBadge(p: string) {
  const map: Record<string, string> = {
    high: "bg-rose-500/20 text-rose-300 border-rose-400/30",
    med: "bg-amber-500/20 text-amber-200 border-amber-400/30",
    low: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
  };
  return map[p];
}

type Task = {
  id: string;
  title: string;
  subject: string | null;
  time_estimate: string | null;
  done: boolean;
  priority: string;
};

type Block = {
  id: string;
  block_date: string;
  time_label: string;
  duration: string | null;
  title: string;
  tag: string | null;
  priority: string;
  reason: string | null;
  sort_order: number;
};

function Dashboard() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newPriority, setNewPriority] = useState("med");
  const [adding, setAdding] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: t }, { data: b }] = await Promise.all([
        supabase.from("tasks").select("*").order("created_at", { ascending: true }),
        supabase
          .from("schedule_blocks")
          .select("*")
          .order("block_date", { ascending: true })
          .order("sort_order", { ascending: true }),
      ]);
      setTasks((t as Task[]) ?? []);
      setBlocks((b as Block[]) ?? []);
    })();
  }, [user]);

  const completed = tasks.filter((t) => t.done).length;
  const today = new Date().toISOString().slice(0, 10);
  const todayBlocks = useMemo(() => blocks.filter((b) => b.block_date === today), [blocks, today]);
  const blockDates = useMemo(() => {
    const m: Record<string, number> = {};
    for (const b of blocks) m[b.block_date] = (m[b.block_date] ?? 0) + 1;
    return m;
  }, [blocks]);

  const toggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
    const { error } = await supabase.from("tasks").update({ done: !task.done }).eq("id", id);
    if (error) toast.error(error.message);
  };

  const remove = async (id: string) => {
    setTasks((ts) => ts.filter((x) => x.id !== id));
    const { error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) toast.error(error.message);
  };

  const addTask = async () => {
    if (!newTitle.trim() || !user) return;
    setAdding(true);
    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        title: newTitle.trim(),
        subject: newSubject.trim() || null,
        time_estimate: newTime.trim() || null,
        priority: newPriority,
      })
      .select()
      .single();
    setAdding(false);
    if (error) return toast.error(error.message);
    setTasks((ts) => [...ts, data as Task]);
    setNewTitle("");
    setNewSubject("");
    setNewTime("");
    setNewPriority("med");
    setShowAdd(false);
    toast.success("Task added");
  };

  if (!loading && !user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-md text-center glass rounded-2xl p-10">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-4 text-2xl font-bold">Sign in to see your dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your tasks, schedule, and progress are saved to your account.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex items-center justify-center rounded-xl gradient-primary px-6 py-3 text-sm font-semibold text-white"
          >
            Sign in / Sign up
          </Link>
        </div>
      </AppShell>
    );
  }

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
            <button
              onClick={() => setShowAdd((s) => !s)}
              className="rounded-lg glass px-3 py-1.5 text-xs hover:bg-white/10"
            >
              {showAdd ? "Cancel" : "+ Add task"}
            </button>
          </div>
          {showAdd && (
            <div className="mb-4 grid gap-2 rounded-xl border border-white/10 bg-white/5 p-3 sm:grid-cols-[1fr_140px_100px_110px_auto]">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task title"
                className="rounded-lg bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/60"
              />
              <input
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Subject"
                className="rounded-lg bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/60"
              />
              <input
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="45m"
                className="rounded-lg bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/60"
              />
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="rounded-lg bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-primary/60"
              >
                <option value="high">High</option>
                <option value="med">Medium</option>
                <option value="low">Low</option>
              </select>
              <button
                onClick={addTask}
                disabled={adding || !newTitle.trim()}
                className="inline-flex items-center justify-center gap-1 rounded-lg gradient-primary px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          )}
          {tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-8 text-center text-sm text-muted-foreground">
              No tasks yet. Add one to start tracking your day.
            </div>
          ) : (
          <ul className="divide-y divide-white/5">
            {tasks.map((t) => (
              <li key={t.id} className="group flex items-center gap-3 py-3">
                <button onClick={() => toggle(t.id)} className="text-primary">
                  {t.done ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className={cn("truncate text-sm", t.done && "line-through text-muted-foreground")}>{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.subject ?? "—"}{t.time_estimate ? ` · ${t.time_estimate}` : ""}
                  </div>
                </div>
                <span className={cn("rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide", priorityBadge(t.priority))}>
                  {t.priority}
                </span>
                <button
                  onClick={() => remove(t.id)}
                  className="opacity-0 transition group-hover:opacity-100 text-muted-foreground hover:text-rose-300"
                  aria-label="Delete task"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          )}
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
          {todayBlocks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-muted-foreground">
              No plan yet for today.
              <Link to="/planner" className="mt-3 block text-primary hover:underline">
                Generate one in AI Planner →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayBlocks.slice(0, 4).map((c) => (
                <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="text-xs text-primary">
                    {c.time_label}
                    {c.duration ? ` · ${c.duration}` : ""}
                  </div>
                  <div className="mt-1 text-sm font-medium">{c.title}</div>
                  {c.reason && <div className="mt-1 text-xs text-muted-foreground">{c.reason}</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendar mini */}
        <div className="glass rounded-2xl p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalIcon className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Study calendar</h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}
            </span>
          </div>
          <CalendarGrid blockDates={blockDates} />
        </div>
      </div>
    </AppShell>
  );
}

function CalendarGrid({ blockDates }: { blockDates: Record<string, number> }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDay = now.getDate();
  const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
  const maxCount = Math.max(1, ...Object.values(blockDates));

  return (
    <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground">
      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
        <div key={i}>{d}</div>
      ))}
      {Array.from({ length: totalCells }).map((_, i) => {
        const day = i - firstDow + 1;
        const valid = day > 0 && day <= daysInMonth;
        const dateStr = valid
          ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          : "";
        const count = valid ? blockDates[dateStr] ?? 0 : 0;
        const intensity = count / maxCount;
        const isToday = day === todayDay;
        return (
          <div
            key={i}
            title={count ? `${count} block${count > 1 ? "s" : ""}` : ""}
            className={cn(
              "aspect-square rounded-lg text-xs grid place-items-center transition relative",
              !valid && "opacity-0",
              isToday && "ring-2 ring-primary",
            )}
            style={{
              background: valid
                ? count > 0
                  ? `linear-gradient(135deg, oklch(0.68 0.22 295 / ${0.25 + intensity * 0.55}), oklch(0.65 0.20 250 / ${0.15 + intensity * 0.45}))`
                  : "oklch(1 0 0 / 0.04)"
                : "transparent",
            }}
          >
            {valid ? day : ""}
            {count > 0 && (
              <span className="absolute bottom-1 right-1 text-[8px] font-semibold text-white/90">
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}