'use client';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { WagmiConfig } from 'wagmi';
import {
  arbitrum,
  mainnet,
  polygon,
  optimism,
  base,
  type Chain
} from 'wagmi/chains';
import { ReactNode, useEffect, useState } from 'react';

// Define supported chains
const chains = [mainnet, polygon, optimism, arbitrum, base] as const;

// Get projectId from environment variable
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('You need to provide NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID env variable');
}

// App metadata
const metadata = {
  name: 'Web3 DApp',
  description: 'Web3 DApp using Web3Modal and Wagmi',
  url: 'https://your-website.com', // Replace with actual URL
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// Create wagmi config (safe to do once at module level)
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableWalletConnect: true,
  enableInjected: true,
  enableEIP6963: true,
  enableCoinbase: true,
});

// Props
interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Inisialisasi Web3Modal hanya sekali
    if (typeof window !== 'undefined' && !(window as any).__web3modal_initialized) {
      createWeb3Modal({
        wagmiConfig,
        projectId: projectId!,
        enableAnalytics: true,
        featuredWalletIds: [],
        themeMode: 'light',
        themeVariables: {
          '--w3m-font-family': 'ui-sans-serif, system-ui, sans-serif',
          '--w3m-accent': 'rgb(var(--primary))',
        },
      });

      (window as any).__web3modal_initialized = true;
    }

    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  );
}
