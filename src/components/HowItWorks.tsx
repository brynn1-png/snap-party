import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    num: "01",
    title: "Scan",
    desc: "Guest scans the QR code. No app download. No sign-up form. Just point and go.",
    gradient: "from-sp-coral to-sp-orange",
    glowColor: "sp-coral",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Shoot",
    desc: "Camera opens in the browser. Tap to capture. Front or rear. Done in seconds.",
    gradient: "from-sp-magenta to-sp-violet",
    glowColor: "sp-magenta",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Done",
    desc: "Photo uploads automatically. Organizer sees it live. No send button needed.",
    gradient: "from-sp-success to-sp-teal",
    glowColor: "sp-success",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-20 sm:py-28 bg-sp-midnight overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16 sm:mb-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-violet/10 border border-sp-violet/20 text-sp-violet text-sm font-medium mb-6">
              Simple as 1-2-3
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              How It Works
            </h2>
          </div>
        </ScrollReveal>

        {/* Steps - connected layout */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-24 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-sp-coral via-sp-magenta to-sp-success opacity-20" />

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <ScrollReveal key={step.num} delay={i + 1}>
                <div className="relative group">
                  {/* Step number */}
                  <div className="flex justify-center mb-8">
                    <div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {step.icon}
                      {/* Pulse ring */}
                      <div className={`absolute inset-0 rounded-2xl ring-pulse ring-2 ring-${step.glowColor}/30`} />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className="text-center px-4">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 bg-gradient-to-r ${step.gradient} text-white`}>
                      {step.num}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-white/40 leading-relaxed max-w-xs mx-auto">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
