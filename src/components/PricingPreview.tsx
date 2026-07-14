import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    desc: "Perfect for trying out SnapParty at your next event.",
    features: [
      "1 active event",
      "50 photos per event",
      "QR code access",
      "Basic gallery",
      "ZIP download",
    ],
    gradient: "from-white/5 to-white/[0.02]",
    border: "border-white/5",
    cta: "Start Free",
    ctaStyle: "bg-white/5 hover:bg-white/10 text-white",
  },
  {
    name: "Pro",
    price: "$19",
    period: "per event",
    desc: "For serious event creators who want the full experience.",
    features: [
      "Unlimited events",
      "Unlimited photos",
      "Live gallery",
      "Shot counter",
      "Custom branding",
      "Priority support",
    ],
    gradient: "from-sp-coral/10 to-sp-magenta/10",
    border: "border-sp-coral/20",
    cta: "Get Pro",
    ctaStyle: "bg-gradient-to-r from-sp-coral to-sp-magenta text-white hover:shadow-lg hover:shadow-sp-magenta/25",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "volume pricing",
    desc: "For agencies and large-scale event operations.",
    features: [
      "Everything in Pro",
      "API access",
      "White-label solution",
      "Dedicated support",
      "Custom integrations",
      "SLA guarantee",
    ],
    gradient: "from-sp-violet/10 to-sp-purple/10",
    border: "border-sp-violet/20",
    cta: "Contact Sales",
    ctaStyle: "bg-sp-violet/10 hover:bg-sp-violet/20 text-sp-violet border border-sp-violet/20",
  },
];

export default function PricingPreview() {
  return (
    <section id="pricing" className="relative py-20 sm:py-28 bg-sp-midnight overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sp-coral/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sp-coral/10 border border-sp-coral/20 text-sp-coral text-sm font-medium mb-6">
              Pricing
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-white/40 max-w-2xl mx-auto">
              Start free. Upgrade when you need more. No hidden fees.
            </p>
          </div>
        </ScrollReveal>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <ScrollReveal key={plan.name} delay={i + 1}>
              <div className={`relative group h-full rounded-3xl bg-gradient-to-b ${plan.gradient} border ${plan.border} p-6 sm:p-8 flex flex-col ${plan.popular ? "ring-1 ring-sp-coral/30" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sp-coral to-sp-magenta text-xs font-bold text-white">
                    Most Popular
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period !== "forever" && (
                      <span className="text-sm text-white/30">/{plan.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-white/40 mt-2">{plan.desc}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-sp-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className="text-sm text-white/60">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`block text-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${plan.ctaStyle}`}
                >
                  {plan.cta}
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
