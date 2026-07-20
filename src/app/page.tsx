import { Navbar, Hero, TrustedBy, HowItWorks, LiveEventExperience, Features, MobileShowcase, OrganizerDashboard, CtaBanner, Footer } from "@/components";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <LiveEventExperience />
        <Features />
        <MobileShowcase />
        <OrganizerDashboard />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
