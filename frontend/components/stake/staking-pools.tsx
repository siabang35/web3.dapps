"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface StakingPool {
  id: string;
  name: string;
  token: string;
  tokenSymbol: string;
  icon: string;
  apy: number;
  lockPeriod: number; // in days
  tvl: number;
  rewards: string;
  tier: "basic" | "premium" | "exclusive";
}

export function StakingPools() {
  const [pools, setPools] = useState<StakingPool[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock data fetching - would be replaced with actual API call
    const mockPools: StakingPool[] = [
      {
        id: "eth-pool",
        name: "ETH Staking",
        token: "Ethereum",
        tokenSymbol: "ETH",
        icon: "🔹",
        apy: 5.2,
        lockPeriod: 0,
        tvl: 12500000,
        rewards: "ETH",
        tier: "basic",
      },
      {
        id: "eth-premium",
        name: "ETH Premium",
        token: "Ethereum",
        tokenSymbol: "ETH",
        icon: "🔹",
        apy: 7.8,
        lockPeriod: 30,
        tvl: 8750000,
        rewards: "ETH + Bonus",
        tier: "premium",
      },
      {
        id: "usdc-pool",
        name: "USDC Yield",
        token: "USD Coin",
        tokenSymbol: "USDC",
        icon: "💲",
        apy: 8.4,
        lockPeriod: 30,
        tvl: 45000000,
        rewards: "USDC",
        tier: "basic",
      },
      {
        id: "usdc-premium",
        name: "USDC Premium",
        token: "USD Coin",
        tokenSymbol: "USDC",
        icon: "💲",
        apy: 10.2,
        lockPeriod: 90,
        tvl: 22500000,
        rewards: "USDC + Bonus",
        tier: "premium",
      },
      {
        id: "dai-pool",
        name: "DAI Stable",
        token: "Dai",
        tokenSymbol: "DAI",
        icon: "🟡",
        apy: 7.8,
        lockPeriod: 0,
        tvl: 30000000,
        rewards: "DAI",
        tier: "basic",
      },
      {
        id: "wbtc-pool",
        name: "WBTC Pool",
        token: "Wrapped Bitcoin",
        tokenSymbol: "WBTC",
        icon: "🟠",
        apy: 4.6,
        lockPeriod: 0,
        tvl: 18900000,
        rewards: "WBTC",
        tier: "basic",
      },
      {
        id: "eth-btc-lp",
        name: "ETH-WBTC LP",
        token: "LP Tokens",
        tokenSymbol: "LP",
        icon: "🔄",
        apy: 12.5,
        lockPeriod: 90,
        tvl: 7500000,
        rewards: "ETH + WBTC",
        tier: "exclusive",
      },
    ];
    
    setTimeout(() => {
      setPools(mockPools);
      setLoading(false);
    }, 1000);
  }, []);
  
  const getTierColor = (tier: string) => {
    switch (tier) {
      case "basic":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "premium":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "exclusive":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Staking Pools</CardTitle>
        <CardDescription>
          Choose a pool to stake your assets and earn rewards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Pools</TabsTrigger>
            <TabsTrigger value="no-lock">No Lock</TabsTrigger>
            <TabsTrigger value="high-apy">High APY</TabsTrigger>
            <TabsTrigger value="premium">Premium</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="pt-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pools.map((pool) => (
                  <div key={pool.id} className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{pool.icon}</span>
                        <h3 className="font-semibold">{pool.name}</h3>
                        <Badge className={getTierColor(pool.tier)} variant="secondary">
                          {pool.tier.charAt(0).toUpperCase() + pool.tier.slice(1)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Rewards paid in {pool.rewards}
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">APY</div>
                        <div className="font-medium text-green-500">
                          {formatPercentage(pool.apy)}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Lock</div>
                        <div className="font-medium">
                          {pool.lockPeriod > 0 ? `${pool.lockPeriod} days` : "None"}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">TVL</div>
                        <div className="font-medium">
                          {formatCurrency(pool.tvl)}
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="md:ml-4">
                        Stake
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="no-lock" className="pt-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pools
                  .filter((pool) => pool.lockPeriod === 0)
                  .map((pool) => (
                    <div key={pool.id} className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{pool.icon}</span>
                          <h3 className="font-semibold">{pool.name}</h3>
                          <Badge className={getTierColor(pool.tier)} variant="secondary">
                            {pool.tier.charAt(0).toUpperCase() + pool.tier.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rewards paid in {pool.rewards}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-medium text-green-500">
                            {formatPercentage(pool.apy)}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Lock</div>
                          <div className="font-medium">
                            None
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">TVL</div>
                          <div className="font-medium">
                            {formatCurrency(pool.tvl)}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="md:ml-4">
                          Stake
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="high-apy" className="pt-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pools
                  .filter((pool) => pool.apy >= 8.0)
                  .sort((a, b) => b.apy - a.apy)
                  .map((pool) => (
                    <div key={pool.id} className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{pool.icon}</span>
                          <h3 className="font-semibold">{pool.name}</h3>
                          <Badge className={getTierColor(pool.tier)} variant="secondary">
                            {pool.tier.charAt(0).toUpperCase() + pool.tier.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rewards paid in {pool.rewards}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-medium text-green-500">
                            {formatPercentage(pool.apy)}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Lock</div>
                          <div className="font-medium">
                            {pool.lockPeriod > 0 ? `${pool.lockPeriod} days` : "None"}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">TVL</div>
                          <div className="font-medium">
                            {formatCurrency(pool.tvl)}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="md:ml-4">
                          Stake
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="premium" className="pt-4">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {pools
                  .filter((pool) => pool.tier === "premium" || pool.tier === "exclusive")
                  .map((pool) => (
                    <div key={pool.id} className="flex flex-col md:flex-row md:items-center justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex-1 mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{pool.icon}</span>
                          <h3 className="font-semibold">{pool.name}</h3>
                          <Badge className={getTierColor(pool.tier)} variant="secondary">
                            {pool.tier.charAt(0).toUpperCase() + pool.tier.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rewards paid in {pool.rewards}
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 md:items-center">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">APY</div>
                          <div className="font-medium text-green-500">
                            {formatPercentage(pool.apy)}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">Lock</div>
                          <div className="font-medium">
                            {pool.lockPeriod > 0 ? `${pool.lockPeriod} days` : "None"}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">TVL</div>
                          <div className="font-medium">
                            {formatCurrency(pool.tvl)}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="md:ml-4">
                          Stake
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}