import ScrollReveal from "./ScrollReveal";

const features = [
  {
    title: "Zero Install",
    desc: "Nothing to download. Works in any mobile browser.",
    gradient: "from-sp-coral to-sp-orange",
    emoji: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
      </svg>
    ),
    span: "col-span-1 row-span-1",
    size: "normal",
  },
  {
    title: "Live Gallery",
    desc: "Photos appear on the organizer dashboard in real time.",
    gradient: "from-sp-magenta to-sp-violet",
    emoji: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v13.5A1.5 1.5 0 003.75 21z" />
      </svg>
    ),
    span: "col-span-1 row-span-2",
    size: "large",
  },
  {
    title: "Auto Upload",
    desc: "Capture = upload. No submit button. No follow-up.",
    gradient: "from-sp-success to-sp-teal",
    emoji: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    span: "col-span-1 row-span-1",
    size: "normal",
  },
  {
    title: "Shot Counter",
    desc: "Guests see how many shots remain. Organizers set the limit.",
    gradient: "from-sp-blue to-sp-violet",
    emoji: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    span: "col-span-1 row-span-1",
    size: "normal",
  },
  {
    title: "Bulk Download",
    desc: "Grab everything as a ZIP when the event is over.",
    gradient: "from-sp-orange to-sp-gold",
    emoji: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
      </svg>
    ),
    span: "col-span-1 row-span-1",
    size: "normal",
  },
  {
    title: "Moderate",
    desc: "Delete any photo with one tap. Keep the gallery clean.",
    gradient: "from-sp-gold to-sp-coral",
    emoji: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    span: "col-span-1 row-span-1",
    size: "normal",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28 bg-sp-midnight overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sp-purple/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-gold/10 border border-sp-gold/20 text-sp-gold text-sm font-medium mb-6">
              Features
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Everything You Need
            </h2>
          </div>
        </ScrollReveal>

        {/* Magazine-style mosaic grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 auto-rows-[minmax(180px,auto)]">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={Math.min(i + 1, 4)}>
              <div className={`relative group h-full rounded-3xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-500 ${f.size === "large" ? "sm:row-span-2" : ""}`}>
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500`} />

                <div className="relative z-10 p-6 sm:p-8 flex flex-col h-full">
                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {f.emoji}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed flex-1">
                    {f.desc}
                  </p>

                  {/* Decorative corner accent */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${f.gradient} opacity-[0.03] rounded-bl-3xl`} />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
