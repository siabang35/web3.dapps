import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { TokenStats } from "@/components/home/token-stats";
import { RecentActivity } from "@/components/home/recent-activity";
import { CTASection } from "@/components/home/cta-section";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <TokenStats />
      <RecentActivity />
      <CTASection />
    </>
  );
}