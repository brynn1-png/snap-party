import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="w-full bg-nb-pink px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="mb-6 text-4xl font-black uppercase tracking-tight text-black md:text-5xl">
          Start Collecting Memories
          <br />
          <span className="bg-nb-yellow px-3">In 60 Seconds</span>
        </h2>
        <p className="mb-8 text-lg font-medium text-black">
          Create your event. Print the QR. Watch the photos roll in.
        </p>
        <Link
          href="/dashboard"
          className="nb-btn inline-block bg-nb-black px-10 py-5 text-xl text-white hover:bg-nb-blue"
        >
          Create Your Event
        </Link>
      </div>
    </section>
  );
}
