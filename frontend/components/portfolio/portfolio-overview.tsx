"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - would be fetched from an API in a real implementation
const generatePortfolioData = (days: number) => {
  const data = [];
  const now = new Date();
  let baseValue = 10000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create some realistic looking variation
    const dailyChange = (Math.random() - 0.48) * 500;
    baseValue += dailyChange;
    
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: baseValue,
    });
  }
  
  return data;
};

export function PortfolioOverview() {
  const portfolioData7d = generatePortfolioData(7);
  const portfolioData30d = generatePortfolioData(30);
  const portfolioData90d = generatePortfolioData(90);
  
  // Calculate change
  const latestValue = portfolioData7d[portfolioData7d.length - 1].value;
  const startValue = portfolioData7d[0].value;
  const changeValue = latestValue - startValue;
  const changePercent = (changeValue / startValue) * 100;
  
  const getTimeframeData = (timeframe: string) => {
    switch (timeframe) {
      case "7d":
        return portfolioData7d;
      case "30d":
        return portfolioData30d;
      case "90d":
        return portfolioData90d;
      default:
        return portfolioData7d;
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Total Portfolio Value</h2>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">
                {formatCurrency(latestValue)}
              </span>
              <span
                className={`flex items-center text-sm ${
                  changePercent >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {changePercent >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {formatCurrency(Math.abs(changeValue))} ({formatPercentage(Math.abs(changePercent))})
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Assets</div>
              <div className="font-semibold">8</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Staked</div>
              <div className="font-semibold">{formatCurrency(3250)}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Rewards</div>
              <div className="font-semibold">{formatCurrency(185.5)}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Transactions</div>
              <div className="font-semibold">32</div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="7d">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Portfolio History</h3>
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </div>
          
          {["7d", "30d", "90d"].map((timeframe) => (
            <TabsContent key={timeframe} value={timeframe} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getTimeframeData(timeframe)}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(1)}K`}
                  />
                  <Tooltip
                    formatter={(value: number) => [formatCurrency(value), "Portfolio Value"]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--chart-1))"
                    fillOpacity={1}
                    fill="url(#portfolioGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}