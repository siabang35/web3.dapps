"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft } from "lucide-react";

interface SwapSettingsProps {
  slippage: number;
  gasPrice: string;
  onSlippageChange: (value: number) => void;
  onGasPriceChange: (value: string) => void;
  onClose: () => void;
}

export function SwapSettings({
  slippage,
  gasPrice,
  onSlippageChange,
  onGasPriceChange,
  onClose,
}: SwapSettingsProps) {
  const handleSlippageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 50) {
      onSlippageChange(numValue);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={onClose}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Back</span>
        </Button>
        <h3 className="text-lg font-semibold">Swap Settings</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
          <div className="flex gap-2">
            <Button
              variant={slippage === 0.1 ? "default" : "outline"}
              size="sm"
              onClick={() => onSlippageChange(0.1)}
            >
              0.1%
            </Button>
            <Button
              variant={slippage === 0.5 ? "default" : "outline"}
              size="sm"
              onClick={() => onSlippageChange(0.5)}
            >
              0.5%
            </Button>
            <Button
              variant={slippage === 1.0 ? "default" : "outline"}
              size="sm"
              onClick={() => onSlippageChange(1.0)}
            >
              1.0%
            </Button>
            <Input
              id="slippage"
              value={slippage}
              onChange={(e) => handleSlippageChange(e.target.value)}
              className="max-w-[80px]"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Your transaction will revert if the price changes unfavorably by more than this percentage.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Gas Price</Label>
          <RadioGroup
            value={gasPrice}
            onValueChange={onGasPriceChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="slow" id="slow" />
              <Label htmlFor="slow" className="flex-1">
                <div className="flex justify-between">
                  <span>Slow</span>
                  <span className="text-muted-foreground">0.002 ETH</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="normal" id="normal" />
              <Label htmlFor="normal" className="flex-1">
                <div className="flex justify-between">
                  <span>Normal</span>
                  <span className="text-muted-foreground">0.003 ETH</span>
                </div>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fast" id="fast" />
              <Label htmlFor="fast" className="flex-1">
                <div className="flex justify-between">
                  <span>Fast</span>
                  <span className="text-muted-foreground">0.005 ETH</span>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Transaction Deadline</Label>
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              defaultValue={20}
              className="max-w-[80px]"
            />
            <span className="text-muted-foreground">minutes</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Your transaction will revert if it is pending for more than this period of time.
          </p>
        </div>
      </div>
      
      <Button onClick={onClose} className="w-full">
        Save Settings
      </Button>
    </div>
  );
}