"use client";

import { useParams } from "next/navigation";

export default function DonePage() {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-nb-lime px-4">
      <div className="nb-card w-full max-w-md bg-nb-white p-8 text-center">
        <div className="mb-4 text-6xl">🎉</div>
        <h1 className="mb-2 text-3xl font-black uppercase text-black">
          You&apos;re All Done!
        </h1>
        <p className="mb-6 font-medium text-black">
          Your photos have been uploaded. Thanks for being part of the memories!
        </p>
        <div className="nb-card-sm bg-nb-yellow p-4">
          <p className="text-sm font-bold uppercase text-black">
            Event: {slug}
          </p>
        </div>
      </div>
    </div>
  );
}
