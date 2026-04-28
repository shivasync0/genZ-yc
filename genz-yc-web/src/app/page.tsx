import { Hero } from "@/components/Hero";
import { SocialProof } from "@/components/SocialProof";
import { WhyThisExists } from "@/components/WhyThisExists";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductPreview } from "@/components/ProductPreview";
import { UniversityHubs } from "@/components/UniversityHubs";
import { BuilderScore } from "@/components/BuilderScore";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white overflow-hidden selection:bg-electric-blue selection:text-black">
      <Hero />
      <SocialProof />
      <WhyThisExists />
      <HowItWorks />
      <ProductPreview />
      <UniversityHubs />
      <BuilderScore />
      <FinalCTA />
      <Footer />
    </main>
  );
}
