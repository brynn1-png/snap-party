"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Account created! Check your email to confirm, then log in.");
    }
    setLoading(false);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-sp-midnight overflow-hidden px-4">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-sp-violet/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-sp-coral/8 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sp-teal/5 blur-[150px] pointer-events-none" />

      {/* Floating photo decorations */}
      <div className="absolute top-24 right-[10%] w-14 h-20 rounded-xl overflow-hidden border border-white/5 float-medium rotate-6 opacity-20 hidden lg:block">
        <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=200&q=70&fit=crop&auto=format" alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute bottom-24 left-[8%] w-18 h-14 rounded-xl overflow-hidden border border-white/5 float-slow -rotate-6 opacity-20 hidden lg:block">
        <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=200&q=70&fit=crop&auto=format" alt="" className="w-full h-full object-cover" loading="lazy" />
      </div>
      <div className="absolute top-1/3 left-[5%] w-10 h-14 rounded-lg overflow-hidden border border-white/5 float-fast -rotate-3 opacity-15 hidden lg:block">
        <img src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=200&q=70&fit=crop&auto=format" alt="" className="w-full h-full object-cover" loading="lazy" />
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

        {/* Signup card */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-sp-teal/10 via-sp-violet/10 to-sp-coral/10 rounded-3xl blur-xl" />
          <div className="relative rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-xl p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
              <p className="text-sm text-white/40">Start collecting memories in 60 seconds</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/60">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-sp-teal/50 focus:bg-white/[0.07] transition-all duration-300"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/60">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 outline-none focus:border-sp-teal/50 focus:bg-white/[0.07] transition-all duration-300"
                  placeholder="Min 6 characters"
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
              {success && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-sp-success/10 border border-sp-success/20">
                  <svg className="w-4 h-4 text-sp-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-sp-success">{success}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sp-teal to-sp-success text-white font-semibold hover:shadow-lg hover:shadow-sp-success/25 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Login link */}
        <p className="mt-8 text-center text-sm text-white/30">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white/60 hover:text-white transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
