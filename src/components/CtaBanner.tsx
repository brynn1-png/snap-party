import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="relative py-24 sm:py-32 bg-sp-charcoal overflow-hidden">
      {/* Background event photo */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover opacity-15"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sp-midnight/60 via-sp-midnight/80 to-sp-midnight/60" />
      </div>

      {/* Glowing overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-sp-coral/15 via-sp-magenta/15 to-sp-violet/15 blur-[80px] rounded-full" />

      {/* Floating QR decorations */}
      <div className="absolute top-12 left-[10%] w-16 h-16 rounded-xl overflow-hidden border border-white/10 float-slow rotate-12 opacity-30 hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute bottom-16 right-[12%] w-20 h-20 rounded-xl overflow-hidden border border-white/10 float-medium -rotate-6 opacity-30 hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=200&q=80&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="absolute top-1/3 right-[5%] w-12 h-12 rounded-lg overflow-hidden border border-white/10 float-fast rotate-3 opacity-20 hidden lg:block">
        <img
          src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=200&q=80&fit=crop&auto=format"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          Collect Every Memory
          <br />
          <span className="gradient-text">Before They&apos;re Lost.</span>
        </h2>
        <p className="text-lg sm:text-xl text-white/40 mb-10 max-w-xl mx-auto">
          Create your event. Print the QR. Watch the photos roll in.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold text-white bg-gradient-to-r from-sp-coral to-sp-magenta rounded-full hover:shadow-xl hover:shadow-sp-magenta/25 transition-all duration-300 hover:scale-105"
          >
            Start Collecting Memories
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="#how-it-works"
            className="inline-flex items-center gap-2 px-10 py-5 text-lg font-semibold text-white/60 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all duration-300"
          >
            See How It Works
          </Link>
        </div>

        {/* Mini social proof */}
        <p className="mt-8 text-sm text-white/20">
          Free to start. No credit card required.
        </p>
      </div>
    </section>
  );
}
