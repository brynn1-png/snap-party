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
    <div className="flex min-h-screen flex-col items-center justify-center bg-nb-yellow px-4">
      <Link
        href="/"
        className="mb-8 text-3xl font-black uppercase tracking-tight text-black"
      >
        Snap<span className="bg-nb-pink px-2">Party</span>
      </Link>

      <div className="w-full max-w-md space-y-6">
        {/* Email + Password */}
        <div className="nb-card bg-nb-white p-8">
          <h1 className="mb-6 text-2xl font-black uppercase text-black">
            Login
          </h1>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold uppercase text-black">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-lime"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold uppercase text-black">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-lime"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p className="border-2 border-black bg-nb-pink px-3 py-2 text-sm font-bold text-black">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="nb-btn w-full bg-nb-black py-3 text-white hover:bg-nb-blue disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-1 flex-1 border-t-3 border-black"></div>
          <span className="text-sm font-bold uppercase text-black">or</span>
          <div className="h-1 flex-1 border-t-3 border-black"></div>
        </div>

        {/* Magic Link */}
        <div className="nb-card bg-nb-white p-8">
          <h2 className="mb-4 text-lg font-black uppercase text-black">
            Magic Link
          </h2>
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-bold uppercase text-black">
                Email
              </label>
              <input
                type="email"
                required
                value={magicEmail}
                onChange={(e) => setMagicEmail(e.target.value)}
                className="w-full border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-blue"
                placeholder="you@example.com"
              />
            </div>
            {magicMsg && (
              <p className="border-2 border-black bg-nb-lime px-3 py-2 text-sm font-bold text-black">
                {magicMsg}
              </p>
            )}
            <button
              type="submit"
              disabled={magicLoading}
              className="nb-btn w-full bg-nb-blue py-3 text-black hover:bg-nb-yellow disabled:opacity-50"
            >
              {magicLoading ? "Sending..." : "Send Magic Link"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm font-medium text-black">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-bold underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
