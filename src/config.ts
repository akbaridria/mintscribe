import { zoraSepolia } from "viem/chains";

const SUPPORTED_CHAINS: number[] = [zoraSepolia.id];
const WALLET_CONNECT_PROJECT_ID = import.meta.env
  .VITE_WALLET_CONNECT_PROJECT_ID;
const RPC_URL = import.meta.env.VITE_ZORA_SEPOLIA_RPC_URL;
const APP_NAME = "MintScribe";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export {
  SUPPORTED_CHAINS,
  WALLET_CONNECT_PROJECT_ID,
  APP_NAME,
  RPC_URL,
  API_BASE_URL,
};
