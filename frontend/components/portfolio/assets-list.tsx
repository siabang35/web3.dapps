"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import { ArrowUp, ArrowDown, Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Asset {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  balance: number;
  price: number;
  value: number;
  change24h: number;
  allocation: number;
}

export function AssetsList() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Asset>("value");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    // Mock data fetching - would be replaced with actual API call
    const mockAssets: Asset[] = [
      {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        icon: "🔹",
        balance: 3.241,
        price: 3458.76,
        value: 11211.84,
        change24h: 2.34,
        allocation: 56.05,
      },
      {
        id: "usdc",
        name: "USD Coin",
        symbol: "USDC",
        icon: "💲",
        balance: 4500,
        price: 1.0,
        value: 4500,
        change24h: 0.01,
        allocation: 22.5,
      },
      {
        id: "bitcoin",
        name: "Wrapped Bitcoin",
        symbol: "WBTC",
        icon: "🟠",
        balance: 0.052,
        price: 56789.32,
        value: 2953.04,
        change24h: 1.23,
        allocation: 14.76,
      },
      {
        id: "dai",
        name: "Dai",
        symbol: "DAI",
        icon: "🟡",
        balance: 750,
        price: 1.0,
        value: 750,
        change24h: 0.02,
        allocation: 3.75,
      },
      {
        id: "link",
        name: "Chainlink",
        symbol: "LINK",
        icon: "🔗",
        balance: 25,
        price: 15.43,
        value: 385.75,
        change24h: -2.45,
        allocation: 1.93,
      },
      {
        id: "aave",
        name: "Aave",
        symbol: "AAVE",
        icon: "👻",
        balance: 0.5,
        price: 205.67,
        value: 102.84,
        change24h: 5.67,
        allocation: 0.51,
      },
      {
        id: "uniswap",
        name: "Uniswap",
        symbol: "UNI",
        icon: "🦄",
        balance: 10,
        price: 10.25,
        value: 102.5,
        change24h: -1.25,
        allocation: 0.51,
      },
    ];
    
    setTimeout(() => {
      setAssets(mockAssets);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };
  
  const sortedAssets = [...assets].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
    }
    
    // String comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === "asc" 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });
  
  const filteredAssets = sortedAssets.filter(asset => 
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Assets</CardTitle>
        <CardDescription>
          Overview of your cryptocurrency holdings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search assets" 
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Deposit
            </Button>
            <Button variant="outline" size="sm">
              Withdraw
            </Button>
            <Button variant="outline" size="sm">
              Swap
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      onClick={() => handleSort('name')}
                    >
                      Asset
                      {sortField === 'name' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'name' ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortField === 'price' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'price' ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      onClick={() => handleSort('change24h')}
                    >
                      24h Change
                      {sortField === 'change24h' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'change24h' ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      onClick={() => handleSort('balance')}
                    >
                      Balance
                      {sortField === 'balance' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'balance' ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      onClick={() => handleSort('value')}
                    >
                      Value
                      {sortField === 'value' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'value' ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium"
                      onClick={() => handleSort('allocation')}
                    >
                      Allocation
                      {sortField === 'allocation' && (
                        <ArrowUpDown className={`ml-2 h-4 w-4 ${sortField === 'allocation' ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </Button>
                  </th>
                  <th className="text-right py-3 font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b hover:bg-muted/50">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{asset.icon}</span>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4 font-medium">
                      {formatCurrency(asset.price)}
                    </td>
                    <td className="text-right py-4">
                      <div
                        className={`flex items-center justify-end ${
                          asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {asset.change24h >= 0 ? (
                          <ArrowUp className="mr-1 h-4 w-4" />
                        ) : (
                          <ArrowDown className="mr-1 h-4 w-4" />
                        )}
                        {formatPercentage(Math.abs(asset.change24h))}
                      </div>
                    </td>
                    <td className="text-right py-4">
                      <div className="font-medium">{asset.balance.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                    </td>
                    <td className="text-right py-4 font-medium">
                      {formatCurrency(asset.value)}
                    </td>
                    <td className="text-right py-4">
                      <Badge variant="outline" className="font-normal">
                        {formatPercentage(asset.allocation)}
                      </Badge>
                    </td>
                    <td className="text-right py-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          Swap
                        </Button>
                        <Button variant="ghost" size="sm">
                          Stake
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredAssets.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No assets found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-muted/50">
                <tr>
                  <td colSpan={4} className="py-4 font-medium">
                    Total
                  </td>
                  <td className="text-right py-4 font-medium">
                    {formatCurrency(totalValue)}
                  </td>
                  <td className="text-right py-4 font-medium">
                    100%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}