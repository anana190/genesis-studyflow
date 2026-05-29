import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/planner", label: "AI Planner" },
  { to: "/timer", label: "Focus Timer" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-4 max-w-7xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary glow">
              <Sparkles className="h-4 w-4 text-white" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              StudyFlow <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link
              to="/dashboard"
              className="inline-flex items-center rounded-xl gradient-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.03]"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden rounded-lg p-2 hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden animate-fade-up">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-white/10 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-lg gradient-primary px-3 py-2 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}