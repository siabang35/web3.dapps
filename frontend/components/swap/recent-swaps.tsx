"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatTimeAgo, truncateAddress } from "@/lib/utils";

interface Swap {
  id: string;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  account: string;
  timestamp: number;
  txHash: string;
}

export function RecentSwaps() {
  const [swaps, setSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock data fetching - would be replaced with actual API call
    const mockSwaps: Swap[] = [
      {
        id: "swap1",
        fromToken: "ETH",
        toToken: "USDC",
        fromAmount: 1.2,
        toAmount: 4152.63,
        account: "0x1234567890123456789012345678901234567890",
        timestamp: Date.now() - 2 * 60 * 1000, // 2 minutes ago
        txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      },
      {
        id: "swap2",
        fromToken: "USDC",
        toToken: "ETH",
        fromAmount: 5000,
        toAmount: 1.45,
        account: "0x2222222222222222222222222222222222222222",
        timestamp: Date.now() - 5 * 60 * 1000, // 5 minutes ago
        txHash: "0x2222222222222222222222222222222222222222222222222222222222222222",
      },
      {
        id: "swap3",
        fromToken: "ETH",
        toToken: "WBTC",
        fromAmount: 10,
        toAmount: 0.5,
        account: "0x3333333333333333333333333333333333333333",
        timestamp: Date.now() - 12 * 60 * 1000, // 12 minutes ago
        txHash: "0x3333333333333333333333333333333333333333333333333333333333333333",
      },
      {
        id: "swap4",
        fromToken: "DAI",
        toToken: "USDC",
        fromAmount: 2500,
        toAmount: 2498.75,
        account: "0x4444444444444444444444444444444444444444",
        timestamp: Date.now() - 25 * 60 * 1000, // 25 minutes ago
        txHash: "0x4444444444444444444444444444444444444444444444444444444444444444",
      },
      {
        id: "swap5",
        fromToken: "WBTC",
        toToken: "ETH",
        fromAmount: 0.2,
        toAmount: 4.32,
        account: "0x5555555555555555555555555555555555555555",
        timestamp: Date.now() - 45 * 60 * 1000, // 45 minutes ago
        txHash: "0x5555555555555555555555555555555555555555555555555555555555555555",
      },
    ];
    
    setTimeout(() => {
      setSwaps(mockSwaps);
      setLoading(false);
    }, 1000);
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Swaps</CardTitle>
        <CardDescription>
          Latest exchange activity on the network
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b text-muted-foreground text-sm">
                  <th className="text-left py-2">Swap</th>
                  <th className="text-right py-2">Value</th>
                  <th className="text-right py-2">Account</th>
                  <th className="text-right py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {swaps.map((swap) => (
                  <tr key={swap.id} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center">
                        <Badge variant="outline" className="font-semibold">
                          {swap.fromToken}
                        </Badge>
                        <span className="mx-2">→</span>
                        <Badge variant="outline" className="font-semibold">
                          {swap.toToken}
                        </Badge>
                      </div>
                    </td>
                    <td className="text-right">
                      <div className="space-y-1">
                        <p>{swap.fromAmount} {swap.fromToken}</p>
                        <p className="text-sm text-muted-foreground">
                          {swap.toAmount} {swap.toToken}
                        </p>
                      </div>
                    </td>
                    <td className="text-right">
                      <a 
                        href={`https://etherscan.io/address/${swap.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {truncateAddress(swap.account)}
                      </a>
                    </td>
                    <td className="text-right">
                      <a 
                        href={`https://etherscan.io/tx/${swap.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-blue-500 hover:underline"
                      >
                        {formatTimeAgo(swap.timestamp)}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}