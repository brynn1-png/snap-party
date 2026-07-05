const features = [
  {
    title: "Zero Install",
    desc: "Nothing to download. Works in any mobile browser.",
    color: "bg-nb-yellow",
    emoji: "📲",
  },
  {
    title: "Live Gallery",
    desc: "Photos appear on the organizer dashboard in real time.",
    color: "bg-nb-pink",
    emoji: "🖼️",
  },
  {
    title: "Auto Upload",
    desc: "Capture = upload. No submit button. No follow-up.",
    color: "bg-nb-lime",
    emoji: "⚡",
  },
  {
    title: "Shot Counter",
    desc: "Guests see how many shots remain. Organizers set the limit.",
    color: "bg-nb-blue",
    emoji: "🎯",
  },
  {
    title: "Bulk Download",
    desc: "Grab everything as a ZIP when the event is over.",
    color: "bg-nb-orange",
    emoji: "📦",
  },
  {
    title: "Moderate",
    desc: "Delete any photo with one tap. Keep the gallery clean.",
    color: "bg-nb-yellow",
    emoji: "🛡️",
  },
];

export default function Features() {
  return (
    <section className="w-full bg-nb-black px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="nb-tag mx-auto mb-4 border-nb-lime bg-nb-black text-nb-lime">
            Features
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-white md:text-5xl">
            Everything You Need
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="nb-card bg-nb-white p-6">
              <div className={`mb-3 inline-block px-3 py-1 text-sm font-black ${f.color}`}>
                {f.emoji}
              </div>
              <h3 className="mb-2 text-xl font-black uppercase text-black">
                {f.title}
              </h3>
              <p className="font-medium leading-relaxed text-black">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
