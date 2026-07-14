"use client";

import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-sp-midnight">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] bg-sp-coral/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[400px] h-[400px] bg-sp-violet/5 blur-[120px] rounded-full pointer-events-none" />

      <nav className="sticky top-0 z-50 glass-strong border-b border-white/5">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-white">Snap</span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sp-coral to-sp-magenta bg-clip-text text-transparent">Party</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-sp-violet/10 border border-sp-violet/20 text-xs font-medium text-sp-violet">
              Organizer
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}
