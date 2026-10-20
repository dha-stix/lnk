import { AnalyticsPreview } from "@/components/home/AnalyticsPreview";
import { Creators } from "@/components/home/Creators";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";
import { Navbar } from "@/components/home/Navbar";
import { PlatformOrbit } from "@/components/home/PlatformOrbit";
import { Steps } from "@/components/home/Steps";
import { ThemeShowcase } from "@/components/home/ThemeShowcase";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-clip">
        <Hero />
        <PlatformOrbit />
        <Steps />
        <Creators />
        <ThemeShowcase />
        <AnalyticsPreview />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
