"use client";

import { useSupabase } from "@/lib/supabase/provider";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = useSupabase();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-white/40 hover:text-white px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
    >
      Logout
    </button>
  );
}
