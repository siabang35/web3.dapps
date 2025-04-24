"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, RefreshCw, Settings } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { SwapSettings } from "@/components/swap/swap-settings";

interface Token {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance: number;
  price: number;
}

export function SwapCard() {
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(0.5);
  const [gasPrice, setGasPrice] = useState<string>("normal");
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Mock list of tokens - would be fetched from an API in a real implementation
  const tokens: Token[] = [
    { 
      id: "ethereum", 
      symbol: "ETH", 
      name: "Ethereum", 
      logo: "🔹", 
      balance: 1.543, 
      price: 3456.78 
    },
    { 
      id: "usdc", 
      symbol: "USDC", 
      name: "USD Coin", 
      logo: "💲", 
      balance: 2500.0, 
      price: 1.0 
    },
    { 
      id: "dai", 
      symbol: "DAI", 
      name: "Dai", 
      logo: "🟡", 
      balance: 1750.0, 
      price: 1.0 
    },
    { 
      id: "wbtc", 
      symbol: "WBTC", 
      name: "Wrapped Bitcoin", 
      logo: "🟠", 
      balance: 0.12, 
      price: 56789.42 
    },
  ];
  
  // Set default tokens on first render
  useState(() => {
    if (!fromToken) setFromToken(tokens[0]);
    if (!toToken) setToToken(tokens[1]);
  });
  
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (fromToken && toToken && value) {
      const amount = parseFloat(value);
      const estimatedAmount = amount * (fromToken.price / toToken.price);
      setToAmount(estimatedAmount.toFixed(6));
    } else {
      setToAmount("");
    }
  };
  
  const handleToAmountChange = (value: string) => {
    setToAmount(value);
    if (fromToken && toToken && value) {
      const amount = parseFloat(value);
      const estimatedAmount = amount * (toToken.price / fromToken.price);
      setFromAmount(estimatedAmount.toFixed(6));
    } else {
      setFromAmount("");
    }
  };
  
  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };
  
  const handleSlippageChange = (value: number) => {
    setSlippage(value);
  };
  
  const handleGasPriceChange = (value: string) => {
    setGasPrice(value);
  };
  
  const calculatePriceImpact = (): number => {
    if (!fromToken || !toToken || !fromAmount || !toAmount) return 0;
    return 0.42; // This would be calculated based on liquidity in a real implementation
  };
  
  const calculateGasFee = (): number => {
    if (gasPrice === "fast") return 0.005;
    if (gasPrice === "normal") return 0.003;
    return 0.002;
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Swap</CardTitle>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
        <CardDescription>
          Trade tokens with optimal routing
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {showSettings ? (
          <SwapSettings 
            slippage={slippage}
            gasPrice={gasPrice}
            onSlippageChange={handleSlippageChange}
            onGasPriceChange={handleGasPriceChange}
            onClose={() => setShowSettings(false)}
          />
        ) : (
          <>
            <Tabs defaultValue="market">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="limit">Limit</TabsTrigger>
                <TabsTrigger value="stoplimit">Stop Limit</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="space-y-4">
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">From</p>
                  <p className="text-xs text-muted-foreground">
                    Balance: {fromToken?.balance} {fromToken?.symbol}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="0.0"
                    value={fromAmount}
                    onChange={(e) => handleFromAmountChange(e.target.value)}
                    className="text-lg"
                  />
                  
                  <Select 
                    value={fromToken?.id} 
                    onValueChange={(value) => setFromToken(tokens.find(t => t.id === value) || null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        {fromToken ? (
                          <div className="flex items-center gap-2">
                            <span>{fromToken.logo}</span>
                            <span>{fromToken.symbol}</span>
                          </div>
                        ) : (
                          "Select"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center gap-2">
                            <span>{token.logo}</span>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {fromToken && fromAmount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ {formatCurrency(parseFloat(fromAmount) * fromToken.price)}
                  </p>
                )}
              </div>
              
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={swapTokens}
                >
                  <ArrowDown className="h-4 w-4" />
                  <span className="sr-only">Swap tokens</span>
                </Button>
              </div>
              
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-muted-foreground">To</p>
                  <p className="text-xs text-muted-foreground">
                    Balance: {toToken?.balance} {toToken?.symbol}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="0.0"
                    value={toAmount}
                    onChange={(e) => handleToAmountChange(e.target.value)}
                    className="text-lg"
                  />
                  
                  <Select 
                    value={toToken?.id} 
                    onValueChange={(value) => setToToken(tokens.find(t => t.id === value) || null)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        {toToken ? (
                          <div className="flex items-center gap-2">
                            <span>{toToken.logo}</span>
                            <span>{toToken.symbol}</span>
                          </div>
                        ) : (
                          "Select"
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {tokens.map((token) => (
                        <SelectItem key={token.id} value={token.id}>
                          <div className="flex items-center gap-2">
                            <span>{token.logo}</span>
                            <span>{token.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {toToken && toAmount && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ {formatCurrency(parseFloat(toAmount) * toToken.price)}
                  </p>
                )}
              </div>
              
              {fromToken && toToken && fromAmount && toAmount && (
                <div className="rounded-lg border bg-muted p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span>
                      1 {fromToken.symbol} = {(fromToken.price / toToken.price).toFixed(6)} {toToken.symbol}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price Impact</span>
                    <span className="text-yellow-500">{calculatePriceImpact().toFixed(2)}%</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Gas Fee</span>
                    <span>{calculateGasFee()} ETH</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Slippage Tolerance</span>
                    <span>{slippage}%</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          className="w-full"
          disabled={!fromToken || !toToken || !fromAmount || !toAmount}
        >
          <RefreshCw className="mr-2 h-4 w-4 animate-spin duration-1000" />
          Swap
        </Button>
      </CardFooter>
    </Card>
  );
}