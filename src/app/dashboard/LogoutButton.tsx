"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-white/40 hover:text-white/70 px-4 py-2 rounded-xl hover:bg-white/5 transition-all duration-300"
    >
      Logout
    </button>
  );
}
