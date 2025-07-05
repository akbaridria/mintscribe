import { getDefaultConfig } from "connectkit";
import { baseSepolia } from "viem/chains";
import { createConfig } from "wagmi";

const SUPPORTED_CHAINS: number[] = [baseSepolia.id];
const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;
const RPC_URL = import.meta.env.VITE_ZORA_SEPOLIA_RPC_URL;
const APP_NAME = "MintScribe";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ZORA_API_KEY = import.meta.env.VITE_ZORA_API_KEY;
const WEB3_WALLET_CONFIG = createConfig(
  getDefaultConfig({
    chains: [baseSepolia],
    walletConnectProjectId: WALLET_CONNECT_PROJECT_ID,
    appName: APP_NAME,
  })
);

export {
  SUPPORTED_CHAINS,
  WALLET_CONNECT_PROJECT_ID,
  APP_NAME,
  RPC_URL,
  API_BASE_URL,
  ZORA_API_KEY,
  WEB3_WALLET_CONFIG,
};
