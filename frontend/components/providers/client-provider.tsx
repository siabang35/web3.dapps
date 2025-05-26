'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Web3Provider } from '@/components/providers/web3-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from '@/components/ui/toaster';
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

  if (!mounted) {
    return <div suppressHydrationWarning />;
  }

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
            <AuthProvider>
              {children}
            </AuthProvider>
          </TooltipProvider>
        </Web3Provider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
