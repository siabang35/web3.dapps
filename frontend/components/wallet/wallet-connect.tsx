'use client';

import { useEffect, useState } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar } from '@/components/ui/avatar';
import { Wallet, LogOut, CreditCard, Coins, ChevronRight } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';

interface WalletConnectProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletConnect({ open, onOpenChange }: WalletConnectProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('connect');

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setActiveTab(isConnected ? 'account' : 'connect');
    }
  }, [open, isConnected]);

  if (!mounted) return null;

  const walletOptions = [
    { id: 'metamask', name: 'MetaMask', icon: '🦊' },
    { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔵' },
    { id: 'walletconnect', name: 'WalletConnect', icon: '🔗' },
    { id: 'ledger', name: 'Ledger', icon: '🔒' },
  ];

  const handleConnect = async () => {
    if (typeof window !== 'undefined' && (window as any).web3modal) {
      try {
        await (window as any).web3modal.open();
        onOpenChange(false);
      } catch (e) {
        console.error('Wallet connection cancelled');
      }
    } else {
      console.warn('Web3Modal not available');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isConnected ? 'Your Wallet' : 'Connect Wallet'}
          </DialogTitle>
          <DialogDescription>
            {isConnected
              ? 'Manage your connected wallet and assets'
              : 'Connect your wallet to access DeFi features'}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connect" disabled={isConnected}>
              Connect
            </TabsTrigger>
            <TabsTrigger value="account" disabled={!isConnected}>
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-4 py-4">
            <div className="grid gap-2">
              {walletOptions.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="w-full justify-start h-12 text-base"
                  onClick={handleConnect}
                >
                  <span className="mr-2 text-xl">{wallet.icon}</span>
                  <span>{wallet.name}</span>
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground text-center pt-2">
              By connecting a wallet, you agree to our Terms of Service
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-4 py-4">
            {isConnected && (
              <>
                <div className="flex items-center space-x-4 pb-4">
                  <Avatar className="h-12 w-12 bg-primary/10">
                    <Wallet className="h-6 w-6" />
                  </Avatar>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">Connected Wallet</h4>
                    <p className="text-xs text-muted-foreground">
                      {truncateAddress(address || '')}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => console.log('View assets')}
                  >
                    <Coins className="mr-2 h-4 w-4" />
                    View Assets
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-sm"
                    onClick={() => console.log('View on explorer')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    View on Explorer
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full mt-4"
                    onClick={() => {
                      disconnect();
                      onOpenChange(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
