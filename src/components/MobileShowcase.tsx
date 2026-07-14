import ScrollReveal from "./ScrollReveal";

export default function MobileShowcase() {
  return (
    <section className="relative py-20 sm:py-28 bg-sp-charcoal overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sp-magenta/8 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text content */}
          <ScrollReveal>
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-magenta/10 border border-sp-magenta/20 text-sp-magenta text-sm font-medium">
                Mobile Experience
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                Designed for the
                <br />
                <span className="gradient-text">moment</span>
              </h2>
              <p className="text-lg text-white/40 leading-relaxed max-w-lg">
                The guest camera experience is crafted for speed and delight.
                Open. Shoot. Done. Every detail is optimized for the live event
                environment.
              </p>

              <div className="space-y-4 pt-4">
                {[
                  { label: "Camera Interface", desc: "Front and rear camera toggle" },
                  { label: "Remaining Shots", desc: "Visible shot counter keeps guests informed" },
                  { label: "Auto Upload", desc: "Photos upload instantly on capture" },
                  { label: "Success Confirmation", desc: "Instant feedback after each upload" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-sp-success/10 flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-sp-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-white/30">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Phone mockup */}
          <ScrollReveal delay={2}>
            <div className="flex justify-center">
              <div className="relative">
                {/* Glow behind phone */}
                <div className="absolute -inset-12 bg-gradient-to-br from-sp-magenta/15 to-sp-violet/15 rounded-3xl blur-3xl" />

                <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] rounded-[2.5rem] bg-gradient-to-b from-sp-dark to-sp-charcoal border border-white/10 shadow-2xl overflow-hidden">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-sp-midnight rounded-b-xl z-20" />

                  {/* Camera UI */}
                  <div className="absolute inset-0 flex flex-col">
                    {/* Top bar */}
                    <div className="flex items-center justify-between px-5 pt-8 pb-3 z-10">
                      <span className="text-xs font-medium text-white/30">Event Camera</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-sp-success animate-pulse" />
                        <span className="text-[10px] font-medium text-white/40">Live</span>
                      </div>
                    </div>

                    {/* Viewfinder with real photo */}
                    <div className="flex-1 mx-4 rounded-2xl bg-sp-midnight border border-white/5 overflow-hidden relative">
                      <img
                        src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80&fit=crop&auto=format"
                        alt="Camera viewfinder"
                        className="w-full h-full object-cover opacity-50"
                        loading="lazy"
                      />
                      {/* Crosshair */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 border border-white/15 rounded-lg" />
                      </div>
                      {/* Flash icon */}
                      <div className="absolute top-3 right-3">
                        <svg className="w-4 h-4 text-sp-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                      </div>
                    </div>

                    {/* Bottom controls */}
                    <div className="px-4 py-4 z-10">
                      {/* Shot counter */}
                      <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[10px] text-white/30">Shots left</span>
                        <span className="text-xs font-bold text-sp-gold">8 / 12</span>
                      </div>

                      {/* Capture button */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-full border-[3px] border-white/20 flex items-center justify-center">
                            <div className="w-11 h-11 rounded-full bg-white" />
                          </div>
                          {/* Ripple */}
                          <div className="absolute inset-0 rounded-full border border-sp-success/30 upload-ripple" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Upload toast */}
                  <div className="absolute bottom-24 left-4 right-4 z-20">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sp-success/10 border border-sp-success/20 backdrop-blur-sm">
                      <svg className="w-4 h-4 text-sp-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-[11px] font-medium text-sp-success">Photo uploaded successfully</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
