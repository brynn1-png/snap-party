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
    <div className="flex min-h-screen flex-col items-center justify-center bg-nb-blue px-4">
      <Link
        href="/"
        className="mb-8 text-3xl font-black uppercase tracking-tight text-black"
      >
        Snap<span className="bg-nb-pink px-2">Party</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="nb-card bg-nb-white p-8">
          <h1 className="mb-6 text-2xl font-black uppercase text-black">
            Create Account
          </h1>
          <form onSubmit={handleSignup} className="space-y-4">
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-3 border-black bg-nb-white px-4 py-3 font-medium text-black outline-none focus:bg-nb-lime"
                placeholder="Min 6 characters"
              />
            </div>
            {error && (
              <p className="border-2 border-black bg-nb-pink px-3 py-2 text-sm font-bold text-black">
                {error}
              </p>
            )}
            {success && (
              <p className="border-2 border-black bg-nb-lime px-3 py-2 text-sm font-bold text-black">
                {success}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="nb-btn w-full bg-nb-black py-3 text-white hover:bg-nb-pink disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm font-medium text-black">
          Already have an account?{" "}
          <Link href="/login" className="font-bold underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
