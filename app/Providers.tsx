"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig, config } from "app/config";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { ZeroDevProvider } from "@zerodev/waas";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ZeroDevProvider config={config}>{children}</ZeroDevProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
