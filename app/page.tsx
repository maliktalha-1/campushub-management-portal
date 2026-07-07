import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import PortalSelection from "@/components/landing/PortalSelection";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <PortalSelection />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}