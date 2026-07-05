import LogoutButton from "./LogoutButton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-nb-white">
      <nav className="flex items-center justify-between border-b-4 border-black bg-nb-yellow px-4 py-4 md:px-8">
        <a
          href="/dashboard"
          className="text-2xl font-black uppercase tracking-tight text-black"
        >
          Snap<span className="bg-nb-pink px-2">Party</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="nb-tag bg-nb-white">Organizer</span>
          <LogoutButton />
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
