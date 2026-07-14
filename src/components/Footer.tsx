export default function Footer() {
  return (
    <footer className="relative bg-sp-midnight border-t border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="text-xl font-bold text-white">Snap</span>
              <span className="text-xl font-bold bg-gradient-to-r from-sp-coral to-sp-magenta bg-clip-text text-transparent">Party</span>
            </div>
            <p className="text-sm text-white/30 max-w-xs leading-relaxed">
              The easiest way to collect event photos. No app. No login. Just scan, shoot, and share.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#how-it-works" className="text-sm text-white/30 hover:text-white/60 transition-colors">How It Works</a></li>
              <li><a href="#features" className="text-sm text-white/30 hover:text-white/60 transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-sm text-white/30 hover:text-white/60 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Privacy</a></li>
              <li><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            SnapParty &copy; {new Date().getFullYear()} &mdash; Scan. Shoot. Done.
          </p>
          <div className="flex items-center gap-4">
            {/* Social icons */}
            {["twitter", "instagram", "github"].map((social) => (
              <a
                key={social}
                href="#"
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white/40 hover:bg-white/10 transition-all"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
