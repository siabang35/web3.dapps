"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StakingPools } from "@/components/stake/staking-pools";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUp } from "lucide-react";

// Mock data - would be fetched from an API in a real implementation
const generateStakedData = () => {
  const data = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  
  let cumulativeStaked = 15000000;
  for (const month of months) {
    const increase = Math.random() * 3000000 + 1000000;
    cumulativeStaked += increase;
    data.push({
      month,
      staked: cumulativeStaked,
    });
  }
  
  return data;
};

const generateApyHistory = () => {
  const data = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  
  for (const month of months) {
    data.push({
      month,
      ETH: 3.5 + Math.random() * 3,
      USDC: 5.5 + Math.random() * 4,
      DAI: 5.0 + Math.random() * 4,
    });
  }
  
  return data;
};

const generatePoolAllocation = () => {
  return [
    { name: "ETH Pool", value: 42, color: "hsl(var(--chart-1))" },
    { name: "USDC Pool", value: 28, color: "hsl(var(--chart-2))" },
    { name: "DAI Pool", value: 16, color: "hsl(var(--chart-3))" },
    { name: "Other Pools", value: 14, color: "hsl(var(--chart-4))" },
  ];
};

export function StakingInfo() {
  const stakedData = generateStakedData();
  const apyHistory = generateApyHistory();
  const poolAllocation = generatePoolAllocation();
  
  const totalStaked = stakedData[stakedData.length - 1].staked;
  const previousStaked = stakedData[stakedData.length - 2].staked;
  const stakedChange = ((totalStaked - previousStaked) / previousStaked) * 100;
  
  return (
    <div className="grid gap-4 md:gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Staking Overview</CardTitle>
          <CardDescription>
            Platform-wide staking statistics and activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Value Staked</p>
              <p className="text-2xl font-bold">{formatCurrency(totalStaked)}</p>
              <div className="flex items-center text-sm text-green-500">
                <ArrowUp className="h-3 w-3 mr-1" />
                {stakedChange.toFixed(2)}% this month
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg. APY Across Pools</p>
              <p className="text-2xl font-bold">{formatPercentage(7.2)}</p>
              <p className="text-sm text-muted-foreground">Range: 4.2% - 12.5%</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Stakers</p>
              <p className="text-2xl font-bold">42,583</p>
              <p className="text-sm text-muted-foreground">Across all pools</p>
            </div>
          </div>
          
          <Tabs defaultValue="tvl">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="tvl">Value Staked</TabsTrigger>
              <TabsTrigger value="apy">APY History</TabsTrigger>
              <TabsTrigger value="allocation">Pool Allocation</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tvl" className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stakedData}>
                  <defs>
                    <linearGradient id="colorStaked" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Total Value Staked",
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="staked"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorStaked)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="apy" className="h-[300px] pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={apyHistory}>
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(2)}%`, "APY"]}
                  />
                  <Bar dataKey="ETH" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="USDC" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="DAI" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="allocation" className="h-[300px] pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                <div className="flex items-center justify-center col-span-1 md:col-span-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={poolAllocation}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {poolAllocation.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value}%`, "Allocation"]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col justify-center space-y-4 p-4">
                  <h4 className="text-sm font-semibold">Pool Distribution</h4>
                  <div className="space-y-2">
                    {poolAllocation.map((pool, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 mr-2 rounded-full"
                            style={{ backgroundColor: pool.color }}
                          ></div>
                          <span className="text-sm">{pool.name}</span>
                        </div>
                        <span className="text-sm font-medium">{pool.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <StakingPools />
    </div>
  );
}