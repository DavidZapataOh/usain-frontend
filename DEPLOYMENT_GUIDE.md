# USAIN Deployment & Testing Guide

## ✅ Completed Implementation

### 1. All Polishing Tasks Completed

- ✅ **TypeScript Errors Fixed**: All strict mode issues resolved across web and API
- ✅ **EIP-712 Signing**: Implemented with wagmi/viem, server-side verification with viem
- ✅ **SpeedRail Timing**: Uses backend `latencyMs`, clamped 120-400ms, fallback to 220ms
- ✅ **WebSocket Reconnection**: Exponential backoff (200ms → 2s max) with "Reconnecting..." badge
- ✅ **Policy UX**: Swap disabled if no active policy, auto-retry on policy enable
- ✅ **Channel UX**: Countdown to `nextNettingEtaSec`, settlement toast + navigation to dashboard
- ✅ **Error Handling**: All API calls have friendly toasts + `console.debug` for raw errors
- ✅ **Accessibility**: All buttons/inputs have `aria-labels`, focus rings, toasts use `aria-live`
- ✅ **Tests Updated**: Playwright tests assert SpeedRail pulse, latency toast, live metrics events
- ✅ **Documentation**: TROUBLESHOOTING section added to README

### 2. Architecture Overview

```
┌─────────────────────┐
│  Frontend (Next.js) │  ← Port 3000
│  - Swap interface   │
│  - EIP-712 signing  │
│  - Live metrics     │
│  - Policy mgmt      │
└──────────┬──────────┘
           │
           │ HTTP/SSE
           ▼
┌─────────────────────┐
│  Backend (Fastify)  │  ← Port 4000
│  - Quote service    │
│  - Intent service   │
│  - Metrics service  │
│  - Signature verify │
└──────────┬──────────┘
           │
           │ JSON-RPC
           ▼
┌─────────────────────┐
│ Smart Contract      │  ← Ethereum Sepolia
│ USAINSettlementHub  │
│ - Channel mgmt      │
│ - Batch settlement  │
└─────────────────────┘
```

## 🚀 How to Run the Project

### Prerequisites

- Node.js 20+
- pnpm 9+
- Foundry (for contracts)
- Ethereum Sepolia RPC URL (Infura/Alchemy)
- Private key with Sepolia ETH (for contract deployment)

### Step 1: Install Dependencies

```bash
cd usain-frontend
pnpm install
```

### Step 2: Configure Environment Variables

#### Backend Configuration (`apps/api/.env`)

```bash
cd apps/api
cp env.example .env
```

Edit `.env`:
```env
PORT=4000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000

# Contract (will be updated after deployment)
SETTLEMENT_HUB_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Real integrations (can use mocks for now)
ENVIO_HYPERSYNC_URL=https://base-sepolia.hypersync.xyz
ENVIO_GQL_URI=https://indexer.bigdevenergy.link/xxxxx/v1/graphql
LIT_NETWORK=datil-test
VINCENT_PKP_PUBLIC_KEY=0x...
YELLOW_RPC_URL=https://sepolia.base.org
YELLOW_NETWORK=nitrolite
```

#### Frontend Configuration (`apps/web/.env.local`)

```bash
cd apps/web
cp env.local.example .env.local
```

Edit `.env.local`:
```env
# Use mocks for initial testing
NEXT_PUBLIC_USE_MOCKS=true

# Backend API
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_WS_URI=http://localhost:4000

# Contract (will be updated after deployment)
NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS=0x0000000000000000000000000000000000000000

# Optional: Real integrations
NEXT_PUBLIC_ENVIO_GQL_URI=https://indexer.bigdevenergy.link/xxxxx/v1/graphql
NEXT_PUBLIC_LIT_NETWORK=datil-test
NEXT_PUBLIC_VINCENT_PKP_PUBLIC_KEY=0x...
NEXT_PUBLIC_YELLOW_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_YELLOW_NETWORK=nitrolite
```

### Step 3: Deploy Smart Contract (Optional for Full Functionality)

```bash
cd packages/contracts
cp env.example .env
```

Edit `.env`:
```env
PRIVATE_KEY=your_private_key_without_0x
INFURA_API_KEY=your_infura_key
ETHERSCAN_API_KEY=your_etherscan_key

# Or use Alchemy
ALCHEMY_API_KEY=your_alchemy_key
```

Deploy to Ethereum Sepolia:
```bash
pnpm deploy:ethereum-sepolia
```

After deployment, update the contract address in:
- `apps/api/.env` → `SETTLEMENT_HUB_ADDRESS`
- `apps/web/.env.local` → `NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS`

### Step 4: Build SDK and Contracts

```bash
# From root directory
cd packages/contracts
pnpm build

cd ../sdk
pnpm build
```

### Step 5: Start Development Servers

#### Option A: Start All Services (Recommended)

```bash
# From root directory
pnpm dev
```

This starts:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:4000`

#### Option B: Start Individually

Terminal 1 - Backend:
```bash
pnpm --filter @usain/api dev
```

Terminal 2 - Frontend:
```bash
pnpm --filter @usain/web dev
```

## 🧪 Testing

### Run All Tests

```bash
pnpm test
```

### Run Backend Tests (Vitest)

```bash
pnpm --filter @usain/api test
```

### Run Frontend E2E Tests (Playwright)

```bash
# Make sure dev servers are running first
pnpm --filter @usain/web test

# Run in headed mode (see browser)
pnpm --filter @usain/web test:headed

# Run in UI mode (interactive)
pnpm --filter @usain/web test:ui
```

### Run Contract Tests

```bash
pnpm --filter @usain/contracts test
```

## 📊 Verifying Functionality

### 1. Check Backend Health

```bash
curl http://localhost:4000/healthz
# Should return: {"status":"ok"}
```

### 2. Test Live Metrics (SSE)

```bash
curl -N http://localhost:4000/metrics/live
# Should stream JSON data every 2 seconds
```

### 3. Frontend Features to Test

1. **Dashboard** (`http://localhost:3000/app/dashboard`)
   - Live KPI cards updating every 2 seconds
   - Recent fills list with timestamps
   - Charts with real-time data

2. **Swap Page** (`http://localhost:3000/app/swap`)
   - Enter amount (e.g., 1000 USDC)
   - Click "Get Quote" → should show quote details
   - Without wallet: shows "Connect Wallet"
   - With wallet but no policy: shows "No Active Policy"

3. **Policies Page** (`http://localhost:3000/app/policies`)
   - Create new policy
   - Pause/Resume/Revoke actions
   - Filter by status (all, active, paused, revoked)

4. **Channel Page** (`http://localhost:3000/app/channel`)
   - View channel status
   - See countdown to next netting
   - Request settlement → toast + redirect to dashboard

## 🔄 Switch from Mocks to Real Backend

Once backend is running and contract is deployed:

1. Update `apps/web/.env.local`:
   ```env
   NEXT_PUBLIC_USE_MOCKS=false
   NEXT_PUBLIC_API_BASE=http://localhost:4000
   NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS=<deployed_contract_address>
   ```

2. Restart frontend:
   ```bash
   pnpm --filter @usain/web dev
   ```

3. Verify connection:
   - Dashboard should show live metrics from backend
   - Console should show `[SDK]` prefixed logs
   - No errors about API connection

## 🐛 Troubleshooting

See the [TROUBLESHOOTING section in README.md](./README.md#troubleshooting) for common issues and solutions.

### Quick Checks

1. **Port conflicts**: Kill processes on 3000/4000 if needed
2. **Environment variables**: Verify all `.env` files are present
3. **Dependencies**: Run `pnpm install` if modules are missing
4. **Build errors**: Clear `.next` and `node_modules/.cache`
5. **API connection**: Check CORS settings in backend

## 📦 Build for Production

```bash
# Build all packages
pnpm build

# Or build individually
pnpm --filter @usain/contracts build
pnpm --filter @usain/sdk build
pnpm --filter @usain/api build
pnpm --filter @usain/web build
```

## 🎯 Next Steps

1. **Deploy Contract**: If not done, deploy `USAINSettlementHub` to Ethereum Sepolia
2. **Update Addresses**: Add deployed contract address to all `.env` files
3. **Connect Wallet**: Use MetaMask or other wallet to test full swap flow
4. **Create Policy**: Required for executing swaps
5. **Test E2E**: Run Playwright tests to verify all features

## 📝 Notes

- The project uses **mocks by default** to allow testing without external dependencies
- **EIP-712 signing** requires a connected wallet (MetaMask, WalletConnect, etc.)
- **Live metrics** use Server-Sent Events (SSE) for real-time updates
- **Policy management** uses mock data unless Lit Protocol is configured
- **State channels** use mock data unless Yellow SDK is configured

## 🎉 Success Indicators

✅ Frontend loads without errors
✅ Backend `/healthz` returns 200
✅ Dashboard shows live metrics updating
✅ Swap page shows quote after entering amount
✅ Console logs show `[SDK]`, `[Swap]`, `[Dashboard]` prefixes
✅ No CORS errors in browser console
✅ Toasts appear for user actions
✅ SpeedRail animation shows during swaps

---

**Built with ❤️ for EthGlobal**



