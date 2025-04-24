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


## 📦 Install Dependencies

Jalankan perintah berikut di direktori root dan di dalam setiap folder (`backend`, `frontend`, `contracts`):

```bash
npm install
```

---

## ⚙️ Setup Instructions

Ikuti langkah-langkah berikut untuk menjalankan proyek secara lokal.

### 1. Clone the Repository

```bash
git clone https://github.com/siabang35/web3.dapps.git
cd web3.dapps
```

---

### 2. Setup Backend (NestJS)

```bash
cd backend
npm install
```

Buat file `.env` di dalam folder `backend`:

```
DATABASE_URL=postgres://your_user:your_password@your_host:5432/your_db
RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x
```

Jalankan server backend:

```bash
npm run start
```

---

### 3. Setup Frontend (Next.js)

```bash
cd ../frontend
npm install
```

- Konfigurasi integrasi wallet (MetaMask, WalletConnect, dll) di folder `wagmi`.

Jalankan development server:

```bash
npm run dev
```

---

### 4. Smart Contracts Development (Hardhat)

```bash
cd ../contracts
npm install
```

Buat file `.env`:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_without_0x
```

Compile smart contracts:

```bash
npx hardhat compile
```

Deploy ke jaringan Sepolia:

```bash
npx hardhat run scripts/deploy.ts --network sepolia
```

---




