import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    quote: "SnapParty completely changed how we collect photos at our weddings. No more chasing guests for their shots.",
    name: "Sarah Chen",
    role: "Event Planner",
    gradient: "from-sp-coral to-sp-orange",
    avatar: "photo-1494790108377-be9c29b29330",
    bgImage: "photo-1519741497674-611481863552",
  },
  {
    quote: "We had 200 guests capturing moments. By the end of the night, we had 1,200 photos in our gallery. Incredible.",
    name: "Marcus Rivera",
    role: "Corporate Event Manager",
    gradient: "from-sp-violet to-sp-purple",
    avatar: "photo-1507003211169-0a1dd7228f2d",
    bgImage: "photo-1533174072545-7a4b6ad7a6c3",
  },
  {
    quote: "The QR code approach is genius. Zero friction. Guests actually enjoy being part of the photo collection process.",
    name: "Priya Sharma",
    role: "Wedding Photographer",
    gradient: "from-sp-magenta to-sp-coral",
    avatar: "photo-1438761681033-6461ffad8d80",
    bgImage: "photo-1429962714451-bb934ecdc4ec",
  },
];

export default function SocialProof() {
  return (
    <section className="relative py-20 sm:py-28 bg-sp-charcoal overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sp-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-gold/10 border border-sp-gold/20 text-sp-gold text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              Social Proof
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white">
              Loved by event creators
            </h2>
          </div>
        </ScrollReveal>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i + 1}>
              <div className="relative group h-full">
                {/* Subtle glow on hover */}
                <div className={`absolute -inset-1 bg-gradient-to-br ${t.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500`} />

                <div className="relative h-full rounded-3xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col">
                  {/* Background event photo */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={`https://images.unsplash.com/${t.bgImage}?w=600&q=80&fit=crop&auto=format`}
                      alt="Event background"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-sp-dark via-sp-dark/60 to-transparent" />
                  </div>

                  <div className="relative p-6 sm:p-8 -mt-8 flex flex-col flex-1 bg-gradient-to-b from-sp-dark/80 to-sp-dark">
                    {/* Stars */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className="w-4 h-4 text-sp-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-sm sm:text-base text-white/60 leading-relaxed flex-1 mb-6">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <img
                          src={`https://images.unsplash.com/${t.avatar}?w=100&q=80&fit=crop&auto=format&crop=face`}
                          alt={t.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-white/30">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
