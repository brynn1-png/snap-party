"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [error, setError] = useState("");
  const [magicMsg, setMagicMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"password" | "magic">("password");
  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicMsg("");
    setError("");
    setMagicLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: magicEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
    } else {
      setMagicMsg("Check your email for the login link.");
    }
    setMagicLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-sp-midnight overflow-hidden px-4">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sp-coral/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sp-violet/8 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sp-magenta/5 blur-[150px] pointer-events-none" />

      {/* Floating photo decorations */}
      <div className="absolute top-20 left-[8%] w-16 h-22 rounded-xl overflow-hidden border border-white/5 float-slow rotate-6 opacity-20 hidden lg:block">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=200&q=70&fit=crop&auto=format" alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute bottom-20 right-[10%] w-20 h-14 rounded-xl overflow-hidden border border-white/5 float-medium -rotate-3 opacity-20 hidden lg:block">
        <img src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&q=70&fit=crop&auto=format" alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute top-1/3 right-[5%] w-12 h-16 rounded-lg overflow-hidden border border-white/5 float-fast rotate-12 opacity-15 hidden lg:block">
        <img src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&q=70&fit=crop&auto=format" alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-1 mb-10 group">
          <span className="text-3xl font-bold tracking-tight text-white">Snap</span>
          <span className="text-3xl font-bold tracking-tight bg-gradient-to-r from-sp-coral to-sp-magenta bg-clip-text text-transparent">Party</span>
        </Link>

        {/* Login card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-coral/10 via-sp-magenta/10 to-sp-violet/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
              <p className="text-sm text-white/40">Sign in to your dashboard</p>
            </div>

            {/* Tab switcher */}
            <div className="flex p-1 rounded-2xl bg-white/5 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab("password")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === "password"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("magic")}
                className={`flex-1 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 ${
                  activeTab === "magic"
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/40 hover:text-white/60"
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Password Login */}
            {activeTab === "password" && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-sp-coral/50 focus:bg-white/[0.07] transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-sp-coral/50 focus:bg-white/[0.07] transition-all duration-300"
                    placeholder="••••••••"
                  />
                </div>
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sp-coral/10 border border-sp-coral/20">
                    <svg className="w-4 h-4 text-sp-coral flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm text-sp-coral">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-coral to-sp-magenta text-white font-semibold hover:shadow-lg hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Logging in...
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            )}

            {/* Magic Link */}
            {activeTab === "magic" && (
              <form onSubmit={handleMagicLink} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/60">Email</label>
                  <input
                    type="email"
                    required
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-sp-violet/50 focus:bg-white/[0.07] transition-all duration-300"
                    placeholder="you@example.com"
                  />
                </div>
                {magicMsg && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sp-success/10 border border-sp-success/20">
                    <svg className="w-4 h-4 text-sp-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <p className="text-sm text-sp-success">{magicMsg}</p>
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sp-coral/10 border border-sp-coral/20">
                    <svg className="w-4 h-4 text-sp-coral flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p className="text-sm text-sp-coral">{error}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={magicLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-violet to-sp-purple text-white font-semibold hover:shadow-lg hover:shadow-sp-violet/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {magicLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    "Send Magic Link"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sign up link */}
        <p className="mt-8 text-center text-sm text-white/30">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-white/60 hover:text-white transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
