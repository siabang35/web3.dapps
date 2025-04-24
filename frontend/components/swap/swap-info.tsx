"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecentSwaps } from "@/components/swap/recent-swaps";
import { formatCurrency } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Mock price data - would be fetched from an API in a real implementation
const generatePriceData = () => {
  const now = new Date();
  const data = [];
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() - (23 - i) * 60 * 60 * 1000);
    const basePrice = 3400;
    const randomVariation = Math.random() * 200 - 100; // Random variation between -100 and 100
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      price: basePrice + randomVariation,
    });
  }
  return data;
};

export function SwapInfo() {
  const priceData = generatePriceData();
  const currentPrice = priceData[priceData.length - 1].price;
  const previousPrice = priceData[priceData.length - 2].price;
  const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100;
  
  return (
    <div className="grid gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Market Overview</CardTitle>
          <CardDescription>
            ETH/USDC price and volume data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Current Price</p>
              <p className="text-2xl font-bold">{formatCurrency(currentPrice)}</p>
              <p className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}% (24h)
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <p className="text-2xl font-bold">{formatCurrency(24563789)}</p>
              <p className="text-sm text-muted-foreground">12,345 trades</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liquidity</p>
              <p className="text-2xl font-bold">{formatCurrency(132456789)}</p>
              <p className="text-sm text-muted-foreground">Across 5 protocols</p>
            </div>
          </div>
          
          <Tabs defaultValue="1d">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="1h">1H</TabsTrigger>
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="1w">1W</TabsTrigger>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="1d" className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                    labelFormatter={(label) => `Time: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="hsl(var(--chart-1))" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            {/* Other tabs would have similar content but with different time ranges */}
            <TabsContent value="1h">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                1 hour chart data would be displayed here
              </div>
            </TabsContent>
            <TabsContent value="1w">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                1 week chart data would be displayed here
              </div>
            </TabsContent>
            <TabsContent value="1m">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                1 month chart data would be displayed here
              </div>
            </TabsContent>
            <TabsContent value="1y">
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                1 year chart data would be displayed here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <RecentSwaps />
    </div>
  );
}