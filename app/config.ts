import { createConfig as createZdConfig } from "@zerodev/waas";
import { polygonAmoy } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";

export const wagmiConfig = getDefaultConfig({
  appName: "zero-dev-tx-manager",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  chains: [polygonAmoy],
  ssr: true,
});

export const config = createZdConfig({
  chains: [polygonAmoy],
  transports: {
    [polygonAmoy.id]: http(),
  },
  projectIds: {
    [polygonAmoy.id]: process.env.NEXT_PUBLIC_ZERO_DEV_PROJECT_ID ?? "",
  },
  ssr: true,
});
