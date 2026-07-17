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
      className="text-sm font-medium text-gray-400 hover:text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-200"
    >
      Logout
    </button>
  );
}
