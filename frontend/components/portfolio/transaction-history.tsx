"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatTimeAgo, truncateAddress } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Download, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: string;
  type: "swap" | "stake" | "unstake" | "claim" | "deposit" | "withdraw";
  description: string;
  amount: string;
  value: number;
  timestamp: number;
  status: "completed" | "pending" | "failed";
  hash: string;
}

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  
  useEffect(() => {
    // Mock data fetching - would be replaced with actual API call
    const mockTransactions: Transaction[] = [
      {
        id: "tx1",
        type: "swap",
        description: "Swap ETH for USDC",
        amount: "1.5 ETH → 5,175 USDC",
        value: 5175,
        timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
        status: "completed",
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      },
      {
        id: "tx2",
        type: "stake",
        description: "Stake USDC",
        amount: "2,500 USDC",
        value: 2500,
        timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
        status: "completed",
        hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
      },
      {
        id: "tx3",
        type: "claim",
        description: "Claim staking rewards",
        amount: "25 USDC",
        value: 25,
        timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
        status: "completed",
        hash: "0x3333333333333333333333333333333333333333333333333333333333333333",
      },
      {
        id: "tx4",
        type: "deposit",
        description: "Deposit ETH",
        amount: "2.0 ETH",
        value: 6800,
        timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        status: "completed",
        hash: "0x4444444444444444444444444444444444444444444444444444444444444444",
      },
      {
        id: "tx5",
        type: "unstake",
        description: "Unstake USDC",
        amount: "500 USDC",
        value: 500,
        timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
        status: "completed",
        hash: "0x5555555555555555555555555555555555555555555555555555555555555555",
      },
      {
        id: "tx6",
        type: "swap",
        description: "Swap USDC for ETH",
        amount: "1,000 USDC → 0.295 ETH",
        value: 1000,
        timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
        status: "completed",
        hash: "0x6666666666666666666666666666666666666666666666666666666666666666",
      },
      {
        id: "tx7",
        type: "withdraw",
        description: "Withdraw ETH",
        amount: "0.5 ETH",
        value: 1700,
        timestamp: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
        status: "completed",
        hash: "0x7777777777777777777777777777777777777777777777777777777777777777",
      },
      {
        id: "tx8",
        type: "swap",
        description: "Swap ETH for LINK",
        amount: "0.1 ETH → 20 LINK",
        value: 340,
        timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
        status: "failed",
        hash: "0x8888888888888888888888888888888888888888888888888888888888888888",
      },
    ];
    
    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);
  
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case "swap":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "stake":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "unstake":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "claim":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "deposit":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "withdraw":
        return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };
  
  const filterTransactions = (transactions: Transaction[]) => {
    let filtered = [...transactions];
    
    // Filter by type
    if (activeFilter !== "all") {
      filtered = filtered.filter((tx) => tx.type === activeFilter);
    }
    
    // Filter by time range
    if (timeRange !== "all") {
      const now = Date.now();
      const ranges: Record<string, number> = {
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      };
      
      filtered = filtered.filter(
        (tx) => tx.timestamp >= now - ranges[timeRange]
      );
    }
    
    return filtered;
  };
  
  const filteredTransactions = filterTransactions(transactions);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>
          A record of all your blockchain transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveFilter}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="swap">Swaps</TabsTrigger>
              <TabsTrigger value="stake">Stakes</TabsTrigger>
              <TabsTrigger value="unstake">Unstakes</TabsTrigger>
              <TabsTrigger value="deposit">Deposits</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All time</SelectItem>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            {renderTransactionTable(filteredTransactions, loading)}
          </TabsContent>
          <TabsContent value="swap" className="mt-0">
            {renderTransactionTable(filteredTransactions, loading)}
          </TabsContent>
          <TabsContent value="stake" className="mt-0">
            {renderTransactionTable(filteredTransactions, loading)}
          </TabsContent>
          <TabsContent value="unstake" className="mt-0">
            {renderTransactionTable(filteredTransactions, loading)}
          </TabsContent>
          <TabsContent value="deposit" className="mt-0">
            {renderTransactionTable(filteredTransactions, loading)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
  
  function renderTransactionTable(transactions: Transaction[], loading: boolean) {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }
    
    if (transactions.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No transactions found for the selected filters.
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left py-3 font-medium text-muted-foreground">Description</th>
              <th className="text-right py-3 font-medium text-muted-foreground">Amount</th>
              <th className="text-right py-3 font-medium text-muted-foreground">Value</th>
              <th className="text-right py-3 font-medium text-muted-foreground">Time</th>
              <th className="text-right py-3 font-medium text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b hover:bg-muted/50">
                <td className="py-4">
                  <Badge
                    className={getTransactionTypeColor(tx.type)}
                    variant="secondary"
                  >
                    {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                  </Badge>
                </td>
                <td className="py-4">
                  <div className="font-medium">{tx.description}</div>
                  <div className="text-sm text-muted-foreground">
                    <a
                      href={`https://etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {truncateAddress(tx.hash)}
                    </a>
                  </div>
                </td>
                <td className="text-right py-4 font-medium">{tx.amount}</td>
                <td className="text-right py-4 font-medium">
                  {formatCurrency(tx.value)}
                </td>
                <td className="text-right py-4 text-muted-foreground">
                  {formatTimeAgo(tx.timestamp)}
                </td>
                <td className="text-right py-4">
                  <Badge
                    className={getStatusColor(tx.status)}
                    variant="secondary"
                  >
                    {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}