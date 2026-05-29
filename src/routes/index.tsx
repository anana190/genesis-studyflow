import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Sparkles, Brain, Calendar, Timer, TrendingUp, Target,
  ArrowRight, Star, Zap, BarChart3, CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudyFlow AI — Study Smarter, Not Harder" },
      { name: "description", content: "AI-powered study planner with smart scheduling, focus timer, and analytics. Built for Gen Z students who want results without burnout." },
      { property: "og:title", content: "StudyFlow AI — Study Smarter, Not Harder" },
      { property: "og:description", content: "AI-powered study planner with smart scheduling, focus timer, and analytics." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Brain, title: "AI Study Planner", desc: "Personalized study schedules generated from your goals, deadlines and energy levels." },
  { icon: Timer, title: "Focus Sessions", desc: "Pomodoro timer with smart breaks that adapts to your concentration patterns." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track focus minutes, streaks, and subject mastery with beautiful charts." },
  { icon: Calendar, title: "Smart Calendar", desc: "Deadlines, exams and revision sessions auto-organized for maximum retention." },
  { icon: Target, title: "Priority Engine", desc: "We rank tasks by impact and urgency so you always work on what matters." },
  { icon: Zap, title: "Streaks & Rewards", desc: "Gamified motivation that turns consistency into a habit you'll love." },
];

const stats = [
  { value: "2.3×", label: "More focused hours per week" },
  { value: "87%", label: "Students hit their study goals" },
  { value: "4.9", label: "Average user rating" },
  { value: "120k+", label: "Sessions completed monthly" },
];

const testimonials = [
  { name: "Maya R.", role: "CS Sophomore, NYU", quote: "StudyFlow basically replaced my chaotic Notion setup. The AI plan for finals week was actually unreal." },
  { name: "Jordan K.", role: "Pre-med, UCLA", quote: "The Pomodoro + analytics combo is addictive. I finally know where my time is going." },
  { name: "Aisha P.", role: "A-Level Student", quote: "I went from cramming to a real routine in two weeks. The vibes are immaculate too." },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -right-40 h-[520px] w-[520px] rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      <div className="relative">
        <Navbar />

        {/* HERO */}
        <section className="mx-auto max-w-7xl px-4 pt-20 pb-24 text-center sm:pt-28">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground animate-fade-up">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by AI · Built for Gen Z
          </div>
          <h1 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl animate-fade-up">
            Study <span className="gradient-text">Smarter</span>,
            <br />
            Not Harder.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg animate-fade-up">
            StudyFlow AI builds personalized study plans, runs focus sessions, and tracks your progress —
            so you can ace exams without the burnout.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3 animate-fade-up">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/40 transition-transform hover:scale-[1.03]"
            >
              Start Studying Free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-medium hover:bg-white/10"
            >
              See the AI Planner
            </Link>
          </div>

          {/* Floating preview card */}
          <div className="relative mx-auto mt-20 max-w-5xl animate-float">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-r from-primary/40 to-accent/40 blur-3xl" />
            <div className="glass-strong rounded-3xl p-3 sm:p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { time: "9:00 AM", title: "Calculus — Integration", tag: "Deep Work", color: "from-primary to-accent" },
                  { time: "11:30 AM", title: "History Essay Draft", tag: "Writing", color: "from-accent to-primary" },
                  { time: "3:00 PM", title: "Physics Problem Set", tag: "Practice", color: "from-primary to-accent" },
                ].map((c) => (
                  <div key={c.title} className="glass rounded-2xl p-4 text-left">
                    <div className="text-xs text-muted-foreground">{c.time}</div>
                    <div className="mt-2 font-medium">{c.title}</div>
                    <div className={`mt-3 inline-flex rounded-full bg-gradient-to-r ${c.color} px-3 py-1 text-xs text-white`}>
                      {c.tag}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-2xl glass px-4 py-3 text-left text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4 text-primary" /> AI generated based on your week
                </div>
                <span className="text-xs text-muted-foreground">Updated just now</span>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="mx-auto max-w-7xl px-4 pb-20">
          <div className="glass-strong grid grid-cols-2 gap-6 rounded-3xl p-8 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold gradient-text sm:text-4xl">{s.value}</div>
                <div className="mt-2 text-xs text-muted-foreground sm:text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURES */}
        <section className="mx-auto max-w-7xl px-4 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to <span className="gradient-text">lock in</span>.
            </h2>
            <p className="mt-4 text-muted-foreground">
              A complete productivity OS for students — designed to feel effortless.
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="glass group rounded-2xl p-6 transition-all hover:-translate-y-1 hover:bg-white/[0.08]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary shadow-lg shadow-primary/30">
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-4 pb-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by serious students</h2>
            <p className="mt-4 text-muted-foreground">From IB to Ivy League, StudyFlow keeps them flowing.</p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="glass rounded-2xl p-6">
                <div className="flex gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-foreground/90">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full gradient-primary text-sm font-medium text-white">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24">
          <div className="glass-strong relative overflow-hidden rounded-3xl p-10 text-center sm:p-16">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/40 blur-3xl" />
            <h2 className="relative text-3xl font-bold sm:text-5xl">
              Ready to flow into your <span className="gradient-text">best semester</span>?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Join thousands of students leveling up with AI-powered study plans.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl gradient-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/40 transition-transform hover:scale-[1.03] animate-pulse-glow"
              >
                Launch My Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" /> Free forever · No credit card
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mx-auto max-w-7xl px-4 pb-10">
          <div className="glass flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg gradient-primary">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm font-medium">StudyFlow <span className="gradient-text">AI</span></span>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
              <span>© {new Date().getFullYear()} StudyFlow AI</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3.5 w-3.5 text-primary" /> Built with love for students
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
