import ScrollReveal from "./ScrollReveal";

export default function LiveEventExperience() {
  return (
    <section className="relative py-20 sm:py-28 bg-sp-charcoal overflow-hidden">
      {/* Ambient lights */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-sp-violet/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sp-coral/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-teal/10 border border-sp-teal/20 text-sp-teal text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-sp-teal animate-pulse" />
              Live Event Experience
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Watch memories happen
              <br />
              <span className="gradient-text">in real time</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Every guest becomes the event photographer. Photos flow from
              their cameras to your gallery the moment they&apos;re captured.
            </p>
          </div>
        </ScrollReveal>

        {/* Experience showcase */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Guests capturing */}
          <ScrollReveal delay={1}>
            <div className="relative group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/5 p-6 sm:p-8 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-sp-coral/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-sp-coral/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-sp-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Guests Capturing Moments</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Every guest pulls out their phone, scans the QR, and starts capturing the event from their unique perspective.
                </p>
                {/* Photo stack visual */}
                <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80&fit=crop&auto=format"
                    alt="Guests at an event taking photos"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sp-charcoal/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-sp-coral/30 border border-white/20 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80&fit=crop&auto=format&crop=face" alt="" className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <span className="text-[10px] font-medium text-white/60">Scanning QR...</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Uploads appearing */}
          <ScrollReveal delay={2}>
            <div className="relative group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/5 p-6 sm:p-8 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-sp-success/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-sp-success/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-sp-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Uploads Appearing Instantly</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  No send button. No follow-up. Each tap of the shutter uploads the photo directly to your gallery.
                </p>
                {/* Upload animation visual */}
                <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80&fit=crop&auto=format"
                    alt="Confetti celebration"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sp-charcoal/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-sp-success/10 border border-sp-success/20 backdrop-blur-sm">
                      <svg className="w-3.5 h-3.5 text-sp-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-[10px] font-medium text-sp-success">Uploaded to gallery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Organizer watching */}
          <ScrollReveal delay={3}>
            <div className="relative group rounded-3xl overflow-hidden bg-white/[0.03] border border-white/5 p-6 sm:p-8 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-sp-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-sp-violet/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-sp-violet" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Organizer Watching Live</h3>
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  Your dashboard updates in real time. Watch the gallery fill up as guests capture the event.
                </p>
                {/* Dashboard gallery preview */}
                <div className="relative h-48 rounded-2xl overflow-hidden border border-white/5">
                  <img
                    src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80&fit=crop&auto=format"
                    alt="Festival crowd"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sp-charcoal/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                      <span className="text-[10px] text-white/40">Gallery updating</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-sp-success animate-pulse" />
                        <span className="text-[10px] font-medium text-sp-success">247 live</span>
                      </div>
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
