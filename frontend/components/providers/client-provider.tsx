'use client';

import { ThemeProvider } from '@/components/providers/theme-provider';
import { Web3Provider } from '@/components/providers/web3-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export interface ClientProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

export function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Web3Provider>
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </Web3Provider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
