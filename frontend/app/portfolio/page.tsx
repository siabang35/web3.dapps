import { PortfolioOverview } from "@/components/portfolio/portfolio-overview";
import { AssetsList } from "@/components/portfolio/assets-list";
import { TransactionHistory } from "@/components/portfolio/transaction-history";

export default function PortfolioPage() {
  return (
    <div className="container max-w-6xl py-8 md:py-12">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
            Portfolio
          </h1>
          <p className="text-muted-foreground max-w-[600px]">
            Track your assets, positions, and transaction history.
          </p>
        </div>
        
        <PortfolioOverview />
        <AssetsList />
        <TransactionHistory />
      </div>
    </div>
  );
}