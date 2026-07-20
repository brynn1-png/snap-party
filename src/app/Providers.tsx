"use client";

import { SupabaseProvider } from "@/lib/supabase/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SupabaseProvider>{children}</SupabaseProvider>;
}
