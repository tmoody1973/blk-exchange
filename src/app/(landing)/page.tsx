import { HeroSection } from "@/components/landing/hero-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SectorsScroll } from "@/components/landing/sectors-scroll";
import { AISection } from "@/components/landing/ai-section";
import { DemoVideo } from "@/components/landing/demo-video";
import { CurriculumPreview } from "@/components/landing/curriculum-preview";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <SectorsScroll />
      <AISection />
      <DemoVideo />
      <CurriculumPreview />
      <CTASection />
    </>
  );
}
