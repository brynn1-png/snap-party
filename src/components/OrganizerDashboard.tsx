import ScrollReveal from "./ScrollReveal";

const galleryImages = [
  "photo-1519741497674-611481863552",
  "photo-1429962714451-bb934ecdc4ec",
  "photo-1514525253161-7a46d19cd819",
  "photo-1465495976277-4387d4b0b4c6",
  "photo-1511795409834-ef04bbd61622",
  "photo-1501281668745-f7f57925c3b4",
  "photo-1533174072545-7a4b6ad7a6c3",
  "photo-1470229722913-7c0e2dbbafd3",
  "photo-1540575467063-178a50c2df87",
  "photo-1464366400600-7168b8af9bc3",
  "photo-1517457373958-b7bdd4587205",
  "photo-1528495612343-9ca9f4a4de28",
  "photo-1492684223066-81342ee5ff30",
  "photo-1506157786151-b8491531f063",
  "photo-1516450360452-9312f5e86fc7",
  "photo-1475721027785-f74eccf877e2",
  "photo-1546146851-2a298e5f0e3e",
  "photo-1493225457124-a3eb161ffa5f",
  "photo-1504196606672-aef5c9cefc92",
  "photo-1549451371-64aa98a6f660",
  "photo-1527529482837-4698179dc6ce",
  "photo-1513151233558-d860c5398176",
  "photo-1507525428034-b723cf961d3e",
  "photo-1519225421980-715cb0215aed",
];

export default function OrganizerDashboard() {
  return (
    <section className="relative py-20 sm:py-28 bg-sp-midnight overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sp-violet/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-violet/10 border border-sp-violet/20 text-sp-violet text-sm font-medium mb-6">
              Organizer Dashboard
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Your command center
              <br />
              <span className="gradient-text">for every event</span>
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Watch the gallery fill up in real time. Download everything when
              the event ends. Moderate with one tap.
            </p>
          </div>
        </ScrollReveal>

        {/* Dashboard preview */}
        <ScrollReveal delay={1}>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-sp-violet/10 via-sp-magenta/10 to-sp-coral/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl bg-sp-dark/80 border border-white/10 backdrop-blur-sm overflow-hidden">
              {/* Dashboard top bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-sp-coral/60" />
                    <div className="w-3 h-3 rounded-full bg-sp-gold/60" />
                    <div className="w-3 h-3 rounded-full bg-sp-success/60" />
                  </div>
                  <span className="text-sm font-medium text-white/40">SnapParty Dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-full bg-sp-success/10 border border-sp-success/20 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-sp-success animate-pulse" />
                    <span className="text-xs font-medium text-sp-success">Live</span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/30">247 photos</div>
                </div>
              </div>

              {/* Dashboard content */}
              <div className="p-6">
                {/* Event info bar */}
                <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p className="text-sm font-semibold text-white">Summer Wedding 2026</p>
                    <p className="text-xs text-white/30">Created 2 hours ago</p>
                  </div>
                  <div className="ml-auto flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-sp-coral">156</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Guests</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-sp-success">247</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Photos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-sp-violet">12</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-wider">Sessions</p>
                    </div>
                  </div>
                </div>

                {/* Gallery grid with real photos */}
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                  {galleryImages.map((photoId, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl border border-white/5 overflow-hidden hover:border-white/15 transition-colors cursor-pointer group relative"
                    >
                      <img
                        src={`https://images.unsplash.com/${photoId}?w=200&q=70&fit=crop&auto=format`}
                        alt={`Gallery photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-sp-midnight/0 group-hover:bg-sp-midnight/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
