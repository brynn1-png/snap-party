const floatingPhotos = [
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80&fit=crop&auto=format", alt: "Wedding celebration", rotate: "6deg", pos: "top-32 right-[15%]", size: "w-24 h-32", anim: "float-slow", gradient: "from-sp-coral to-sp-orange" },
  { src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80&fit=crop&auto=format", alt: "Festival crowd", rotate: "-3deg", pos: "top-48 right-[8%]", size: "w-20 h-28", anim: "float-medium", gradient: "from-sp-violet to-sp-purple" },
  { src: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&q=80&fit=crop&auto=format", alt: "Party guests", rotate: "12deg", pos: "bottom-40 left-[10%]", size: "w-28 h-20", anim: "float-fast", gradient: "from-sp-teal to-sp-blue" },
  { src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80&fit=crop&auto=format", alt: "Confetti celebration", rotate: "-6deg", pos: "bottom-56 left-[18%]", size: "w-16 h-24", anim: "float-slow", gradient: "from-sp-gold to-sp-orange" },
  { src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80&fit=crop&auto=format", alt: "Event gathering", rotate: "3deg", pos: "top-64 left-[5%]", size: "w-20 h-28", anim: "float-medium", gradient: "from-sp-magenta to-sp-coral" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-sp-midnight">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-sp-coral/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-sp-violet/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sp-magenta/5 blur-[150px] pointer-events-none" />

      {/* Floating photo cards - real event images */}
      {floatingPhotos.map((photo, i) => (
        <div
          key={i}
          className={`absolute ${photo.pos} ${photo.size} rounded-xl overflow-hidden border border-white/10 ${photo.anim} hidden lg:block z-10`}
          style={{ transform: `rotate(${photo.rotate})` }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${photo.gradient} opacity-20`} />
        </div>
      ))}

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-sp-success animate-pulse" />
              <span className="text-sm font-medium text-white/70">No App. No Login.</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95] tracking-tight">
              <span className="text-white">Every</span>
              <br />
              <span className="gradient-text">Memory.</span>
              <br />
              <span className="text-white">Instantly</span>
              <br />
              <span className="text-white">Shared.</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/50 max-w-md leading-relaxed font-light">
              Guests scan a QR code. Take photos in their browser. Photos land
              live on your dashboard. Zero friction. Zero follow-up.
            </p>

            {/* Social proof mini */}
            <div className="flex items-center gap-4 pt-4 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-sp-midnight overflow-hidden"
                  >
                    <img
                      src={`https://images.unsplash.com/photo-${["1494790108377-be9c29b29330", "1507003211169-0a1dd7228f2d", "1438761681033-6461ffad8d80", "1472099645785-5658abf4ff4e"][i - 1]}?w=100&q=80&fit=crop&auto=format&crop=face`}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/40">
                <span className="text-white/70 font-medium">2,400+</span> events captured
              </p>
            </div>
          </div>

          {/* Right - Artistic composition */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Main phone mockup */}
            <div className="relative z-10">
              {/* Glow behind phone */}
              <div className="absolute -inset-10 bg-gradient-to-br from-sp-coral/20 via-sp-magenta/15 to-sp-violet/20 rounded-3xl blur-3xl" />

              <div className="relative w-[280px] sm:w-[300px] h-[560px] sm:h-[600px] rounded-[2.5rem] bg-gradient-to-b from-sp-dark to-sp-charcoal border border-white/10 shadow-2xl overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-sp-midnight rounded-b-2xl z-20" />

                {/* Camera interface */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  {/* Camera viewfinder with real photo */}
                  <div className="relative w-full aspect-square rounded-2xl bg-gradient-to-br from-sp-dark to-sp-midnight border border-white/10 overflow-hidden mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80&fit=crop&auto=format"
                      alt="Camera viewfinder"
                      className="w-full h-full object-cover opacity-60"
                      loading="lazy"
                    />
                    {/* Crosshair overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 border-2 border-white/30 rounded-lg" />
                      <div className="absolute w-0.5 h-4 bg-white/30" />
                      <div className="absolute w-4 h-0.5 bg-white/30" />
                    </div>
                    {/* Flash effect */}
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-sp-gold flash-effect" />
                    {/* Scene warm tint */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-sp-coral/20 to-transparent" />
                  </div>

                  {/* Shot counter */}
                  <div className="w-full flex items-center justify-between px-2 mb-3">
                    <span className="text-xs font-medium text-white/40">Remaining</span>
                    <span className="text-sm font-bold text-sp-gold">12 shots</span>
                  </div>

                  {/* Capture button */}
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-white hover:bg-sp-coral transition-colors duration-200 cursor-pointer" />
                    </div>
                    {/* Upload ripple */}
                    <div className="absolute inset-0 rounded-full border-2 border-sp-success/40 upload-ripple" />
                  </div>
                </div>

                {/* Upload progress bar */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-sp-success to-sp-teal rounded-full" />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1 text-center">Uploading...</p>
                </div>
              </div>
            </div>

            {/* Floating uploaded photos around phone - real images */}
            <div className="absolute -top-4 -right-4 sm:right-0 w-24 h-32 sm:w-28 sm:h-36 rounded-xl overflow-hidden border border-white/10 float-slow rotate-6 z-20">
              <img
                src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&q=80&fit=crop&auto=format"
                alt="Uploaded photo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Live indicator */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sp-success flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 sm:left-0 w-20 h-28 sm:w-24 sm:h-32 rounded-xl overflow-hidden border border-white/10 float-medium -rotate-6 z-20">
              <img
                src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80&fit=crop&auto=format"
                alt="Uploaded photo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="absolute top-1/2 -right-8 sm:-right-12 w-16 h-22 sm:w-20 sm:h-28 rounded-xl overflow-hidden border border-white/10 float-fast rotate-3 z-20">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80&fit=crop&auto=format"
                alt="Uploaded photo"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            {/* QR code element */}
            <div className="absolute -bottom-6 right-8 sm:right-4 w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-white p-2 float-slow z-20 qr-pulse">
              <div className="w-full h-full relative">
                {/* QR pattern */}
                <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 gap-[2px]">
                  {[...Array(25)].map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${[0, 1, 2, 4, 5, 6, 10, 12, 14, 18, 20, 22, 23, 24].includes(i) ? "bg-sp-midnight" : "bg-transparent"}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Connection lines - decorative */}
            <div className="absolute top-1/2 -left-12 w-12 h-[1px] bg-gradient-to-r from-transparent to-sp-coral/40 hidden lg:block" />
            <div className="absolute top-1/3 -right-16 w-16 h-[1px] bg-gradient-to-l from-transparent to-sp-violet/40 hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sp-charcoal to-transparent pointer-events-none" />
    </section>
  );
}
