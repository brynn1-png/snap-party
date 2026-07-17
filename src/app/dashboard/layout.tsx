"use client";

import LogoutButton from "./LogoutButton";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
          <Link href="/dashboard" className="flex items-center gap-1">
            <span className="text-xl font-bold tracking-tight text-gray-900">Snap</span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-sp-coral to-sp-magenta bg-clip-text text-transparent">Party</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-sp-violet/10 text-xs font-medium text-sp-violet">
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
