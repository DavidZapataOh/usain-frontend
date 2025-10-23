'use client';

import { WagmiProvider, createConfig, http } from 'wagmi';
import { baseSepolia, arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, metaMask, walletConnect } from 'wagmi/connectors';
import { createContext, useContext, ReactNode } from 'react';

const config = createConfig({
  chains: [baseSepolia, arbitrumSepolia],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
    }),
  ],
  transports: {
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

interface WagmiContextType {
  config: typeof config;
}

const WagmiContext = createContext<WagmiContextType | null>(null);

export function WagmiProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiContext.Provider value={{ config }}>
          {children}
        </WagmiContext.Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export function useWagmiConfig() {
  const context = useContext(WagmiContext);
  if (!context) {
    throw new Error('useWagmiConfig must be used within WagmiProviderWrapper');
  }
  return context.config;
}


