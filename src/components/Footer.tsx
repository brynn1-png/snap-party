export default function Footer() {
  return (
    <footer className="w-full border-t-4 border-black bg-nb-black px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-bold uppercase tracking-wider text-nb-lime">
          SnapParty &copy; {new Date().getFullYear()} &mdash; Scan. Shoot. Done.
        </p>
      </div>
    </footer>
  );
}
