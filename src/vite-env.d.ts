/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string;
  readonly VITE_ZORA_SEPOLIA_RPC_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ZORA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
