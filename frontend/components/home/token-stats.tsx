"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
}

export function TokenStats() {
  // Mock data - would be fetched from an API in a real implementation
  const tokens: TokenData[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 56789.42,
      change24h: 2.34,
      marketCap: 1098765432100,
      volume24h: 32456789000,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3456.78,
      change24h: 1.23,
      marketCap: 420987654321,
      volume24h: 15678543210,
    },
    {
      id: "binancecoin",
      name: "Binance Coin",
      symbol: "BNB",
      price: 567.89,
      change24h: -0.45,
      marketCap: 87654321098,
      volume24h: 5678901234,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 123.45,
      change24h: 5.67,
      marketCap: 65432109876,
      volume24h: 4321098765,
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 2.34,
      change24h: -1.23,
      marketCap: 54321098765,
      volume24h: 3210987654,
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Market Overview
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Track the latest prices and market data for top cryptocurrencies.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>Top Tokens</CardTitle>
              <CardDescription>
                Updated price data from across the market
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Price
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        24h Change
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Market Cap
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Volume (24h)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {tokens.map((token) => (
                      <tr
                        key={token.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{token.name}</div>
                            <Badge variant="outline" className="ml-1">
                              {token.symbol}
                            </Badge>
                          </div>
                        </td>
                        <td className="p-4 align-middle font-medium">
                          {formatCurrency(token.price)}
                        </td>
                        <td className="p-4 align-middle">
                          <div
                            className={`flex items-center ${
                              token.change24h >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {token.change24h >= 0 ? (
                              <ArrowUpIcon className="mr-1 h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="mr-1 h-4 w-4" />
                            )}
                            {formatPercentage(Math.abs(token.change24h))}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {formatCurrency(token.marketCap / 1e9, "$")}B
                        </td>
                        <td className="p-4 align-middle">
                          {formatCurrency(token.volume24h / 1e9, "$")}B
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}