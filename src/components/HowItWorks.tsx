const steps = [
  {
    num: "01",
    title: "Scan",
    desc: "Guest scans the QR code. No app download. No sign-up form. Just point and go.",
    color: "bg-nb-yellow",
    emoji: "📱",
  },
  {
    num: "02",
    title: "Shoot",
    desc: "Camera opens in the browser. Tap to capture. Front or rear. Done in seconds.",
    color: "bg-nb-pink",
    emoji: "📸",
  },
  {
    num: "03",
    title: "Done",
    desc: "Photo uploads automatically. Organizer sees it live. No send button needed.",
    color: "bg-nb-lime",
    emoji: "✅",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full bg-nb-white px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="nb-tag mx-auto mb-4 bg-nb-blue">Simple as 1-2-3</div>
          <h2 className="text-4xl font-black uppercase tracking-tight text-black md:text-5xl">
            How It Works
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.num} className="nb-card p-6">
              <div className={`mb-4 inline-block px-3 py-1 text-sm font-black ${step.color}`}>
                {step.num}
              </div>
              <div className="mb-3 text-4xl">{step.emoji}</div>
              <h3 className="mb-2 text-2xl font-black uppercase text-black">
                {step.title}
              </h3>
              <p className="font-medium leading-relaxed text-black">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
