import { WagmiProvider, createConfig, http } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { PropsWithChildren } from "react";
import { APP_NAME, RPC_URL, WALLET_CONNECT_PROJECT_ID } from "@/config";

const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    transports: {
      [baseSepolia.id]: http(RPC_URL),
    },

    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
    appName: APP_NAME,
  })
);

const queryClient = new QueryClient();

export const Web3Provider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
