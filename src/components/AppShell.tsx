import type { ReactNode } from "react";
import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full bg-accent/25 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />

      <div className="relative">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      </div>
    </div>
  );
}