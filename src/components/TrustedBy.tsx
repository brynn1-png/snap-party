import ScrollReveal from "./ScrollReveal";

const logos = [
  { name: "Eventbrite", width: "w-28" },
  { name: "The Knot", width: "w-24" },
  { name: "Cvent", width: "w-20" },
  { name: "Bizzabo", width: "w-24" },
  { name: "Splash", width: "w-20" },
  { name: "Hopin", width: "w-20" },
];

export default function TrustedBy() {
  return (
    <section className="relative py-16 sm:py-20 bg-sp-charcoal border-y border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-sm font-medium text-white/30 uppercase tracking-widest">
              Trusted by event creators worldwide
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="flex items-center gap-2 text-white/15 hover:text-white/30 transition-colors duration-300"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-sm font-semibold tracking-wide">{logo.name}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
