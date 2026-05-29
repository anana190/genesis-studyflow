import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain, Flame } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/timer")({
  head: () => ({
    meta: [
      { title: "Focus Timer — StudyFlow AI" },
      { name: "description", content: "Pomodoro focus timer with session tracking and smart break reminders." },
    ],
  }),
  component: TimerPage,
});

type Mode = "focus" | "short" | "long";
const DURATIONS: Record<Mode, number> = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
const LABELS: Record<Mode, string> = { focus: "Focus", short: "Short break", long: "Long break" };

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const sec = (s % 60).toString().padStart(2, "0");
  return `${m}:${sec}`;
}

const sessionsLog = [
  { subject: "Calculus", dur: "25m", time: "8:30 AM" },
  { subject: "Physics", dur: "25m", time: "9:05 AM" },
  { subject: "CS Project", dur: "50m", time: "10:00 AM" },
  { subject: "History", dur: "25m", time: "11:15 AM" },
];

function TimerPage() {
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(DURATIONS.focus);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(4);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            setRunning(false);
            if (mode === "focus") setCompleted((c) => c + 1);
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, mode]);

  const switchMode = (m: Mode) => {
    setMode(m);
    setRemaining(DURATIONS[m]);
    setRunning(false);
  };

  const reset = () => {
    setRemaining(DURATIONS[mode]);
    setRunning(false);
  };

  const skip = () => {
    const next: Mode = mode === "focus" ? (completed % 4 === 3 ? "long" : "short") : "focus";
    switchMode(next);
  };

  const total = DURATIONS[mode];
  const progress = ((total - remaining) / total) * 100;
  const circumference = 2 * Math.PI * 130;

  return (
    <AppShell>
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
          {mode === "focus" ? <Brain className="h-3.5 w-3.5 text-primary" /> : <Coffee className="h-3.5 w-3.5 text-accent" />}
          {LABELS[mode]} mode
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          Lock in. <span className="gradient-text">Flow on.</span>
        </h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Timer */}
        <div className="glass-strong rounded-3xl p-8 lg:col-span-2">
          {/* Tabs */}
          <div className="mx-auto mb-8 inline-flex w-full justify-center">
            <div className="flex rounded-full bg-white/5 p-1">
              {(Object.keys(DURATIONS) as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition",
                    mode === m ? "gradient-primary text-white shadow shadow-primary/40" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Dial */}
          <div className="relative mx-auto aspect-square max-w-sm">
            <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="timerGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="oklch(0.68 0.22 295)" />
                  <stop offset="100%" stopColor="oklch(0.65 0.20 250)" />
                </linearGradient>
              </defs>
              <circle cx="150" cy="150" r="130" stroke="oklch(1 0 0 / 0.06)" strokeWidth="14" fill="none" />
              <circle
                cx="150"
                cy="150"
                r="130"
                stroke="url(#timerGrad)"
                strokeWidth="14"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="text-6xl font-bold tabular-nums sm:text-7xl">{fmt(remaining)}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                  {running ? "In session" : "Paused"}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={reset}
              className="grid h-12 w-12 place-items-center rounded-full glass hover:bg-white/10"
              aria-label="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full gradient-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/40 transition-transform hover:scale-[1.03]",
                running && "animate-pulse-glow",
              )}
            >
              {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              {running ? "Pause" : "Start"}
            </button>
            <button
              onClick={skip}
              className="grid h-12 w-12 place-items-center rounded-full glass hover:bg-white/10"
              aria-label="Skip"
            >
              <SkipForward className="h-4 w-4" />
            </button>
          </div>

          {/* Session dots */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition",
                  i < completed % 4 ? "gradient-primary" : "bg-white/10",
                )}
              />
            ))}
            <span className="ml-3 text-xs text-muted-foreground">{completed} sessions today</span>
          </div>
        </div>

        {/* Side: stats + sessions */}
        <div className="space-y-6">
          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold">Today</h2>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-2xl font-bold gradient-text">{completed}</div>
                <div className="mt-1 text-[10px] uppercase text-muted-foreground">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">2h 45m</div>
                <div className="mt-1 text-[10px] uppercase text-muted-foreground">Focus</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-2xl font-bold gradient-text">
                  12 <Flame className="h-5 w-5 text-orange-400" />
                </div>
                <div className="mt-1 text-[10px] uppercase text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <h2 className="font-semibold">Recent sessions</h2>
            <ul className="mt-4 space-y-3">
              {sessionsLog.map((s, i) => (
                <li key={i} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
                      <Brain className="h-4 w-4 text-white" />
                    </span>
                    <div>
                      <div className="text-sm font-medium">{s.subject}</div>
                      <div className="text-xs text-muted-foreground">{s.time}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{s.dur}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2">
              <Coffee className="h-4 w-4 text-accent" />
              <h2 className="font-semibold">Break reminder</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              After 4 focus sessions, take a 15-minute long break. Hydrate, stretch, touch grass.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}