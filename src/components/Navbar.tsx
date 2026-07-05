import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b-4 border-black bg-nb-yellow px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-2xl font-black uppercase tracking-tight text-black">
          Snap<span className="bg-nb-pink px-2 text-black">Party</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="nb-btn bg-nb-white px-5 py-2 text-sm text-black hover:bg-nb-lime"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
