import { SwapCard } from "@/components/swap/swap-card";
import { SwapInfo } from "@/components/swap/swap-info";

export default function SwapPage() {
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Swap Tokens
          </h1>
          <p className="text-muted-foreground max-w-[600px]">
            Exchange one token for another with the best rates across multiple liquidity sources.
          </p>
        </div>
        
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <SwapInfo />
          </div>
          <div className="lg:col-span-1">
            <SwapCard />
          </div>
        </div>
      </div>
    </div>
  );
}