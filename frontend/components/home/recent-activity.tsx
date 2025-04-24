"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { formatTimeAgo, truncateAddress } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";

interface Transaction {
  id: string;
  type: "swap" | "stake" | "unstake" | "claim";
  from: string;
  to: string;
  amount: string;
  timestamp: number;
  hash: string;
}

export function RecentActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetching - would be replaced with actual API call
    const mockTransactions: Transaction[] = [
      {
        id: "tx1",
        type: "swap",
        from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
        to: "0x1234567890123456789012345678901234567890",
        amount: "1.5 ETH → 2500 USDC",
        timestamp: Date.now() - 120000, // 2 minutes ago
        hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      },
      {
        id: "tx2",
        type: "stake",
        from: "0x2222222222222222222222222222222222222222",
        to: "0x3333333333333333333333333333333333333333",
        amount: "500 USDC",
        timestamp: Date.now() - 300000, // 5 minutes ago
        hash: "0x2222222222222222222222222222222222222222222222222222222222222222",
      },
      {
        id: "tx3",
        type: "claim",
        from: "0x4444444444444444444444444444444444444444",
        to: "0x5555555555555555555555555555555555555555",
        amount: "25 REWARDS",
        timestamp: Date.now() - 600000, // 10 minutes ago
        hash: "0x3333333333333333333333333333333333333333333333333333333333333333",
      },
      {
        id: "tx4",
        type: "unstake",
        from: "0x6666666666666666666666666666666666666666",
        to: "0x7777777777777777777777777777777777777777",
        amount: "100 USDC",
        timestamp: Date.now() - 1800000, // 30 minutes ago
        hash: "0x4444444444444444444444444444444444444444444444444444444444444444",
      },
      {
        id: "tx5",
        type: "swap",
        from: "0x8888888888888888888888888888888888888888",
        to: "0x9999999999999999999999999999999999999999",
        amount: "10 USDC → 0.005 ETH",
        timestamp: Date.now() - 3600000, // 1 hour ago
        hash: "0x5555555555555555555555555555555555555555555555555555555555555555",
      },
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "swap":
        return <RefreshCw className="h-4 w-4" />;
      case "stake":
        return <ArrowUpRight className="h-4 w-4" />;
      case "unstake":
      case "claim":
        return <ArrowDownRight className="h-4 w-4" />;
      default:
        return <RefreshCw className="h-4 w-4" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "swap":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "stake":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "unstake":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "claim":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Recent Activity
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Latest transactions from the network.
            </p>
          </div>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Network Transactions</CardTitle>
            <CardDescription>
              Live feed of recent transactions on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-60">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <Avatar className={getTransactionColor(tx.type)}>
                        {getTransactionIcon(tx.type)}
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium capitalize">{tx.type}</h4>
                          <Badge variant="outline" className="ml-2">
                            {tx.amount}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          From: {truncateAddress(tx.from)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatTimeAgo(tx.timestamp)}
                      </div>
                      <a 
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        View Transaction
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}