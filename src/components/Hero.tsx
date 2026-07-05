import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full bg-nb-yellow px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="nb-card bg-nb-white p-8 md:p-12">
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex-1 space-y-6">
              <div className="nb-tag bg-nb-pink text-black">No App. No Login.</div>
              <h1 className="text-5xl font-black uppercase leading-none tracking-tight text-black md:text-7xl">
                Snap.
                <br />
                <span className="bg-nb-lime px-3 text-black">Done.</span>
              </h1>
              <p className="max-w-lg text-lg font-medium leading-relaxed text-black">
                Guests scan a QR code. Take photos in their browser. Photos land
                live on your dashboard. Zero friction. Zero follow-up.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="nb-btn bg-nb-pink px-8 py-4 text-lg text-black hover:bg-nb-orange"
                >
                  Start Free
                </Link>
                <Link
                  href="#how-it-works"
                  className="nb-btn bg-nb-white px-8 py-4 text-lg text-black hover:bg-nb-blue"
                >
                  See How It Works
                </Link>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <div className="nb-card-sm bg-nb-blue p-8 text-center">
                <div className="mb-4 text-6xl">📸</div>
                <div className="nb-tag mb-2 bg-nb-white">QR CODE</div>
                <div className="mx-auto mb-3 flex h-32 w-32 items-center justify-center border-4 border-dashed border-black bg-nb-white">
                  <span className="text-4xl">⬛</span>
                </div>
                <p className="text-sm font-bold uppercase">Scan to start</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
