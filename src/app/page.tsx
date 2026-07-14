import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBy from "@/components/TrustedBy";
import HowItWorks from "@/components/HowItWorks";
import LiveEventExperience from "@/components/LiveEventExperience";
import Features from "@/components/Features";
import MobileShowcase from "@/components/MobileShowcase";
import OrganizerDashboard from "@/components/OrganizerDashboard";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";

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
