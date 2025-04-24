"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Coins, LockKeyhole, Unlock } from "lucide-react";
import { formatCurrency, formatPercentage } from "@/lib/utils";

interface StakingPool {
  id: string;
  name: string;
  token: string;
  tokenSymbol: string;
  icon: string;
  apy: number;
  lockPeriod: number; // in days
  totalStaked: number;
  userStaked: number;
  rewards: number;
}

export function StakingCard() {
  const [activePool, setActivePool] = useState<StakingPool | null>(null);
  const [activeTab, setActiveTab] = useState("stake");
  const [amount, setAmount] = useState("");
  
  // Mock list of staking pools - would be fetched from an API in a real implementation
  const stakingPools: StakingPool[] = [
    {
      id: "eth-pool",
      name: "ETH Staking",
      token: "Ethereum",
      tokenSymbol: "ETH",
      icon: "🔹",
      apy: 5.2,
      lockPeriod: 0,
      totalStaked: 12500000,
      userStaked: 1.5,
      rewards: 0.012,
    },
    {
      id: "usdc-pool",
      name: "USDC Yield",
      token: "USD Coin",
      tokenSymbol: "USDC",
      icon: "💲",
      apy: 8.4,
      lockPeriod: 30,
      totalStaked: 45000000,
      userStaked: 2500,
      rewards: 32.5,
    },
    {
      id: "dai-pool",
      name: "DAI Stable",
      token: "Dai",
      tokenSymbol: "DAI",
      icon: "🟡",
      apy: 7.8,
      lockPeriod: 90,
      totalStaked: 30000000,
      userStaked: 0,
      rewards: 0,
    },
  ];
  
  // Set default pool on first render
  useState(() => {
    if (!activePool) setActivePool(stakingPools[0]);
  });
  
  const handleStake = () => {
    // This would stake tokens in a real implementation
    console.log(`Staking ${amount} ${activePool?.tokenSymbol}`);
  };
  
  const handleUnstake = () => {
    // This would unstake tokens in a real implementation
    console.log(`Unstaking ${amount} ${activePool?.tokenSymbol}`);
  };
  
  const handleClaim = () => {
    // This would claim rewards in a real implementation
    console.log(`Claiming ${activePool?.rewards} ${activePool?.tokenSymbol}`);
  };
  
  // Calculate projected rewards based on amount and APY
  const calculateProjectedRewards = () => {
    if (!activePool || !amount) return 0;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    
    const annualRewards = amountNum * (activePool.apy / 100);
    
    // Calculate rewards for different time periods
    if (activeTab === "projected") {
      // Monthly rewards (annual / 12)
      const monthlyRewards = annualRewards / 12;
      return monthlyRewards;
    }
    
    return annualRewards;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Staking</CardTitle>
        <CardDescription>
          Stake tokens to earn rewards
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Select Pool</label>
          <Select 
            value={activePool?.id} 
            onValueChange={(value) => setActivePool(stakingPools.find(pool => pool.id === value) || null)}
          >
            <SelectTrigger>
              <SelectValue>
                {activePool ? (
                  <div className="flex items-center gap-2">
                    <span>{activePool.icon}</span>
                    <span>{activePool.name}</span>
                    <span className="ml-auto text-muted-foreground">
                      {formatPercentage(activePool.apy)} APY
                    </span>
                  </div>
                ) : (
                  "Select Staking Pool"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {stakingPools.map((pool) => (
                <SelectItem key={pool.id} value={pool.id}>
                  <div className="flex items-center gap-2">
                    <span>{pool.icon}</span>
                    <span>{pool.name}</span>
                    <span className="ml-auto text-muted-foreground">
                      {formatPercentage(pool.apy)} APY
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {activePool && (
          <>
            <div className="rounded-lg border bg-muted/50 p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">APY</span>
                <span className="text-sm font-semibold text-green-500">
                  {formatPercentage(activePool.apy)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lock Period</span>
                <span className="text-sm">
                  {activePool.lockPeriod > 0 ? `${activePool.lockPeriod} days` : "No lock"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Staked</span>
                <span className="text-sm">
                  {formatCurrency(activePool.totalStaked)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Stake</span>
                <span className="text-sm">
                  {activePool.userStaked} {activePool.tokenSymbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Your Rewards</span>
                <span className="text-sm font-medium text-green-500">
                  {activePool.rewards} {activePool.tokenSymbol}
                </span>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stake">Stake</TabsTrigger>
                <TabsTrigger value="unstake" disabled={activePool.userStaked === 0}>
                  Unstake
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="stake" className="space-y-4 pt-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Amount to Stake
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg"
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => setAmount("1.0")}
                      >
                        Max
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Balance: 3.45 {activePool.tokenSymbol}</span>
                      <span>≈ {formatCurrency(3.45 * 3451.78)}</span>
                    </div>
                  </div>
                </div>
                
                <Tabs defaultValue="annual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="annual">Annual Returns</TabsTrigger>
                    <TabsTrigger value="projected">Monthly Returns</TabsTrigger>
                  </TabsList>
                  <TabsContent value="annual" className="pt-4">
                    <div className="rounded-lg border bg-card p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Projected Reward</span>
                        <span className="text-sm font-medium text-green-500">
                          {calculateProjectedRewards().toFixed(6)} {activePool.tokenSymbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">APY</span>
                        <span className="text-sm">{formatPercentage(activePool.apy)}</span>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="projected" className="pt-4">
                    <div className="rounded-lg border bg-card p-3 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Reward</span>
                        <span className="text-sm font-medium text-green-500">
                          {calculateProjectedRewards().toFixed(6)} {activePool.tokenSymbol}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">APY</span>
                        <span className="text-sm">{formatPercentage(activePool.apy)}</span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <Button 
                  className="w-full"
                  disabled={!amount || parseFloat(amount) <= 0}
                  onClick={handleStake}
                >
                  <LockKeyhole className="mr-2 h-4 w-4" />
                  Stake Now
                </Button>
              </TabsContent>
              
              <TabsContent value="unstake" className="space-y-4 pt-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Amount to Unstake
                  </label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-lg"
                      />
                      <Button 
                        variant="outline"
                        size="sm"
                        className="whitespace-nowrap"
                        onClick={() => setAmount(activePool.userStaked.toString())}
                      >
                        Max
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Staked: {activePool.userStaked} {activePool.tokenSymbol}</span>
                      <span>≈ {formatCurrency(activePool.userStaked * 3451.78)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border bg-card p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Available Rewards</span>
                    <span className="text-sm font-medium text-green-500">
                      {activePool.rewards} {activePool.tokenSymbol}
                    </span>
                  </div>
                  {activePool.lockPeriod > 0 && (
                    <div className="text-xs text-amber-500 pt-1">
                      Note: Early unstaking may incur a {activePool.lockPeriod / 30 * 2}% penalty.
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    className="w-full"
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > activePool.userStaked}
                    onClick={handleUnstake}
                  >
                    <Unlock className="mr-2 h-4 w-4" />
                    Unstake
                  </Button>
                  
                  <Button 
                    className="w-full"
                    disabled={activePool.rewards <= 0}
                    onClick={handleClaim}
                    variant="secondary"
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    Claim
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      {activePool && activePool.lockPeriod > 0 && (
        <CardFooter className="text-xs text-muted-foreground border-t pt-4">
          <LockKeyhole className="mr-2 h-4 w-4 text-amber-500" />
          Funds will be locked for {activePool.lockPeriod} days after staking.
        </CardFooter>
      )}
    </Card>
  );
}