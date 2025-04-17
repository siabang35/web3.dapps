# Web3 dApp Project

This project is a **Web3 Decentralized Application (dApp)** built using **Hardhat** for smart contracts, **Next.js** for the frontend, and **NestJS** for the backend API. The dApp interacts with the **Sepolia Testnet** using **Alchemy** and **PostgreSQL** on **Supabase** for the database.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Folder Structure](#folder-structure)
- [Smart Contract Development](#smart-contract-development)
- [Frontend Development](#frontend-development)
- [Backend Development](#backend-development)
- [Subgraph (Optional)](#subgraph-optional)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

This is a fully functional Web3 project structure for building decentralized applications (dApps). It includes:

- **Smart Contract** development with **Hardhat** (using Solidity).
- **Frontend** interface using **Next.js** and **TypeScript**, integrated with **Web3** wallets like **MetaMask**.
- **Backend API** using **NestJS** and **PostgreSQL** via **Supabase**.
- **Subgraph** for indexing and querying on the blockchain.

---

## Prerequisites

To run this project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) v16+ (LTS version)
- [Yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
- [Hardhat](https://hardhat.org/) (for smart contract deployment)
- [Supabase](https://supabase.io/) account (for database setup)
- [Alchemy or Infura](https://www.alchemy.com/) (for RPC URL)
- [PostgreSQL](https://www.postgresql.org/) for database storage

You can install required dependencies with:

```bash
npm install
---
## Setup Instructions
Follow these steps to set up the project locally.

1. Clone the Repository
Clone this repository to your local machine:


git clone https://github.com/siabang35/web3.dapps.git
cd web3.dapps
2. Setup Backend (NestJS)
a. Navigate to the backend folder:

cd backend
b. Install the dependencies:

npm install
c. Set up the PostgreSQL database in Supabase and create a .env file with the database URL:

DATABASE_URL=postgres://your_user:your_password@your_host:5432/your_db
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x
d. Run the server:


npm run start
3. Setup Frontend (Next.js)
a. Navigate to the frontend folder:

cd frontend
b. Install the dependencies:


npm install
c. Configure wallet integration with Wagmi in the frontend by setting up the wallet provider in wagmi folder.

d. Run the development server:


npm run dev
4. Smart Contracts Development (Hardhat)
a. Navigate to the contracts folder:


cd contracts
b. Install dependencies for Hardhat and ethers.js:


npm install
c. Edit .env to add Alchemy or Infura Sepolia RPC URL and Private Key:


SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x
d. Compile the smart contracts:


npx hardhat compile
e. Deploy the smart contracts to Sepolia network (ensure you have Sepolia ETH in your wallet for testing):


npx hardhat run scripts/deploy.ts --network sepolia
---
## Folder Structure
Here’s a breakdown of the folder structure:


C:\Users\wilda\OneDrive\Documents\Web3\dapps
├── contracts/              # Smart Contracts (Solidity + Hardhat)
│   ├── contracts/          # Solidity Contracts
│   ├── scripts/            # Deployment Scripts
│   ├── test/               # Unit Tests for Smart Contracts
│   └── hardhat.config.ts   # Hardhat Configuration
│
├── frontend/               # Web Interface (Next.js + TypeScript)
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom hooks (e.g. Wallet)
│   ├── pages/              # Next.js pages
│   ├── public/             # Static assets (images, etc.)
│   ├── styles/             # CSS & styling
│   ├── wagmi/              # Wallet & Web3 config
│   └── utils/              # Utility functions
│
├── backend/                # Backend API (NestJS + PostgreSQL)
│   ├── src/
│   │   ├── modules/        # Features (e.g. User, Transactions)
│   │   ├── database/       # Database connection
│   │   ├── services/       # Business logic
│   │   ├── main.ts         # Entry point
│   │   └── app.module.ts   # Main module
│   └── .env                # Environment variables
│
├── subgraph/               # The Graph (optional)
│   ├── schema.graphql      # GraphQL schema
│   ├── subgraph.yaml       # Subgraph configuration
│   └── mappings/           # Event handling for subgraph
│
├── .env                    # Global env (if needed)
├── package.json            # Monorepo root
└── README.md               # Project documentation
Smart Contract Development
Smart contracts are written in Solidity and managed with Hardhat. Follow these steps to develop, test, and deploy contracts.

## Smart Contract Deployment
a. Write contracts in the contracts/ directory.

b. Test contracts using Hardhat:

npx hardhat test
c. Deploy to the Sepolia testnet:


npx hardhat run scripts/deploy.ts --network sepolia
### Frontend Development
The frontend is built with Next.js and TypeScript. The interface is integrated with the smart contracts via Wagmi (for wallet connection and blockchain interaction).

a. Modify the wagmi folder to set up wallet providers (e.g., MetaMask).

b. Customize components inside components/ for UI.

c. Use hooks for interacting with the blockchain (e.g., sending transactions).

### Backend Development
a. The backend is built with NestJS and connects to PostgreSQL via Supabase. It stores data like user transactions, wallets, and tokens.

b. Set up models using TypeORM.

c. Use REST API to interact with the frontend and smart contracts.

Configure database connection in .env.