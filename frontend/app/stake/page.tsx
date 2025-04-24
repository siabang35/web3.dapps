import { StakingCard } from "@/components/stake/staking-card";
import { StakingInfo } from "@/components/stake/staking-info";

export default function StakePage() {
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Stake & Earn
          </h1>
          <p className="text-muted-foreground max-w-[600px]">
            Earn rewards by staking your tokens in our verified liquidity pools.
          </p>
        </div>
        
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StakingInfo />
          </div>
          <div className="lg:col-span-1">
            <StakingCard />
          </div>
        </div>
      </div>
    </div>
  );
}