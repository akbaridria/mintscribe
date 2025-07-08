# MintScribe ✍️💰

> **<ins>🚀 NOW LIVE ON BASE MAINNET! 🚀</ins>**

> **Quick Links:**  
> [Mintscribe Backend Service](https://github.com/akbaridria/mintscribe-backend)

![MintScribe Logo](public/feather.svg)

MintScribe is a token-gated content platform that empowers creators to monetize their content through personalized cryptocurrencies. Create posts, mint your own coins, and build a community that values your work.

## 🌟 Features

- **Create & Publish Content**: Use our powerful Tiptap-based rich text editor to create beautiful articles and posts
- **Mint Personal Tokens**: Create your own cryptocurrency tokens tied to your content and personal brand
- **Community Engagement**: Readers can purchase creator tokens to support their favorite content makers
- **Value Appreciation**: As creators gain popularity, early supporters benefit from token value increases
- **Web3 Integration**: Seamlessly connect with various web3 wallets via ConnectKit

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- A web3 wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mintscribe.git
   cd mintscribe
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 💻 Tech Stack

MintScribe is built using modern web technologies:

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: TailwindCSS, SCSS
- **Editor**: TipTap rich text editor
- **Web3**: Wagmi, Viem, ConnectKit
- **Tokens**: Zora Coins SDK
- **State Management**: React Query
- **Routing**: React Router
- **UI Components**: Shadcn UI

## 🪙 How MintScribe Works

1. **Creator Journey**:
   - Connect wallet to access MintScribe (no traditional account creation needed)
   - Create and publish articles using the rich text editor
   - Mint a unique token for each published article with custom parameters (name, symbol)
   - All content is freely accessible to readers

2. **Reader Journey**:
   - Connect wallet to interact with the platform
   - Browse and read all articles without restrictions
   - Purchase article-specific tokens to support content you appreciate
   - Hold tokens as investments that may appreciate as the article gains popularity
   - Trade tokens on supported exchanges as their value fluctuates

## 🗺️ Roadmap

MintScribe is constantly evolving. Here's what we're planning for future releases:

1. **Collaborative Writing**: 
   - Real-time collaborative editing for multiple authors
   - Permission management for team-based content creation
   - Comment and suggestion system for reviewers

2. **Article Versioning**:
   - Full version history for all published content
   - Ability to restore previous versions
   - Diff views to compare changes between versions