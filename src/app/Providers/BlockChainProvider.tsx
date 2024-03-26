"use client";
import * as React from "react";
import { getDefaultConfig, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { evmos } from "wagmi/chains";
import { fallback, http, WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RainbowKitThemedProvider from "@/app/Providers/RainbowKitThemedProvider";
import { Address, defineChain } from "viem";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const { wallets } = getDefaultWallets();

const customEvmosMainnet = defineChain({
  id: evmos.id,
  name: "Evmos Mainnet",
  nativeCurrency: {
    name: evmos.nativeCurrency.name,
    symbol: evmos.nativeCurrency.symbol,
    decimals: evmos.nativeCurrency.decimals,
  },
  rpcUrls: {
    default: {
      http: ["https://evmos-jsonrpc.alkadeta.com", "https://evmos.lava.build"],
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11" as Address,
    },
  },
});

export const config = getDefaultConfig({
  appName: "OAToken Fractionalizer",
  projectId: "oatoken-fractionalizer",
  wallets: wallets,
  chains: [customEvmosMainnet],
  ssr: true,
  transports: {
    [customEvmosMainnet.id]: fallback([
      http("https://evmos.lava.build"),
      http("https://evmos-jsonrpc.alkadeta.com"),
      http("https://jsonrpc-evmos.mzonder.com"),
    ]),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1_000 * 60 * 60 * 24, // 24 hours
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitThemedProvider>{children}</RainbowKitThemedProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
