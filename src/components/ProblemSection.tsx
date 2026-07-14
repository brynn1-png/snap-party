import ScrollReveal from "./ScrollReveal";

const trapped = [
  { name: "Messenger", icon: "💬", color: "from-blue-500/20 to-blue-600/20", image: "photo-1512941937669-90a1b58e7e9c" },
  { name: "Instagram", icon: "📷", color: "from-pink-500/20 to-purple-500/20", image: "photo-1611162617474-5b21e879e113" },
  { name: "Camera Roll", icon: "📱", color: "from-gray-500/20 to-gray-600/20", image: "photo-1517336714731-489689fd1ca8" },
  { name: "Google Drive", icon: "📁", color: "from-yellow-500/20 to-green-500/20", image: "photo-1573164713714-d95e436ab8d6" },
];

export default function ProblemSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-sp-charcoal overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sp-coral/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-coral/10 border border-sp-coral/20 text-sp-coral text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              The Problem
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Photos get <span className="text-sp-coral">trapped</span>
              <br />
              in the wrong places
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              After every event, photos are scattered across dozens of apps.
              Messages get buried. DMs get forgotten. Nobody ever sends the good ones.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Trapped photos */}
          <ScrollReveal>
            <div className="space-y-4">
              <p className="text-sm font-medium text-white/30 uppercase tracking-wider mb-6">
                Photos trapped inside
              </p>
              <div className="grid grid-cols-2 gap-4">
                {trapped.map((app) => (
                  <div
                    key={app.name}
                    className="relative p-5 rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden group hover:border-white/10 transition-all duration-300"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-xl overflow-hidden mb-3 border border-white/10">
                        <img
                          src={`https://images.unsplash.com/${app.image}?w=100&q=80&fit=crop&auto=format`}
                          alt={app.name}
                          className="w-full h-full object-cover opacity-60"
                          loading="lazy"
                        />
                      </div>
                      <p className="text-sm font-medium text-white/60">{app.name}</p>
                      <div className="mt-3 flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-sp-coral/60" />
                        <span className="text-xs text-sp-coral/60">Scattered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Center arrow */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-sp-coral to-sp-magenta flex items-center justify-center shadow-lg shadow-sp-magenta/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Right - SnapParty gallery */}
          <ScrollReveal delay={2}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-sp-coral/10 to-sp-violet/10 rounded-3xl blur-2xl" />
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sp-coral to-sp-magenta flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">One Beautiful Gallery</p>
                    <p className="text-xs text-white/40">All photos. One place. Live.</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-sp-success/10 border border-sp-success/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-sp-success animate-pulse" />
                    <span className="text-xs font-medium text-sp-success">Live</span>
                  </div>
                </div>

                {/* Gallery preview grid with real photos */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {["photo-1519741497674-611481863552", "photo-1429962714451-bb934ecdc4ec", "photo-1514525253161-7a46d19cd819", "photo-1465495976277-4387d4b0b4c6", "photo-1533174072545-7a4b6ad7a6c3", "photo-1501281668745-f7f57925c3b4"].map((photoId, i) => (
                    <div key={i} className="aspect-square rounded-xl border border-white/5 overflow-hidden">
                      <img
                        src={`https://images.unsplash.com/${photoId}?w=200&q=70&fit=crop&auto=format`}
                        alt={`Gallery photo ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>

                {/* Live counter */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-xs text-white/40">Photos uploaded</span>
                  <span className="text-sm font-bold text-sp-success">247 live</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
