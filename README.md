# USAIN - Instant Swap Router

Instant swap router with state channels (ERC-7824), secure delegation, and live telemetry.

## Features

- ⚡ **Instant Swaps** - Execute swaps in <300ms with zero gas per interaction
- 🛡️ **Policy Management** - Set spending limits and allowed pairs with Lit Protocol
- 📊 **Live Dashboard** - Real-time KPIs, charts, and telemetry via WebSocket
- 🔄 **State Channels** - ERC-7824 channels with batch settlement
- 🎨 **SpeedRail™** - Signature visual element showing swap speed in real-time

## Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │   SDK       │
│   (Next.js) │◄──►│   (Fastify) │◄──►│   (TypeScript)│
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Wagmi     │    │   Envio     │    │   Lit       │
│   (Wallet)  │    │   (Data)    │    │   (Policies)│
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │   Yellow    │    │   Contracts │
                   │   (Channels)│    │   (Settlement)│
                   └─────────────┘    └─────────────┘
```

## Tech Stack

- **Frontend**: Next.js 15 + TypeScript + TailwindCSS v4
- **Backend**: Fastify + TypeScript + Zod validation
- **SDK**: TypeScript with real integrations
- **Contracts**: Solidity + Foundry
- **State Management**: Zustand
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Foundry (for contracts)

### Installation

```bash
# Clone repository
git clone <repository-url>
cd usain

# Install dependencies
pnpm install

# Copy environment files
cp apps/api/env.example apps/api/.env
cp apps/web/env.local.example apps/web/.env.local
cp packages/contracts/env.example packages/contracts/.env
```

### Development

```bash
# Start all services
pnpm dev

# Or start individually
pnpm --filter @usain/web dev      # Frontend on :3000
pnpm --filter @usain/api dev      # Backend on :4000
```

### Environment Setup

#### Backend (.env)
```env
PORT=4000
ENVIO_HYPERSYNC_URL=https://base-sepolia.hypersync.xyz
ENVIO_GQL_URI=https://indexer.bigdevenergy.link/xxxxx/v1/graphql
LIT_NETWORK=datil-test
VINCENT_PKP_PUBLIC_KEY=0x...
YELLOW_RPC_URL=https://sepolia.base.org
YELLOW_NETWORK=nitrolite
SETTLEMENT_HUB_ADDRESS=0x...
PRIVATE_KEY=0x...
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_USE_MOCKS=false
NEXT_PUBLIC_API_BASE=http://localhost:4000
NEXT_PUBLIC_WS_URI=http://localhost:4000/metrics/live
NEXT_PUBLIC_ENVIO_GQL_URI=https://indexer.bigdevenergy.link/xxxxx/v1/graphql
NEXT_PUBLIC_LIT_NETWORK=datil-test
NEXT_PUBLIC_VINCENT_PKP_PUBLIC_KEY=0x...
NEXT_PUBLIC_YELLOW_RPC_URL=https://sepolia.base.org
NEXT_PUBLIC_YELLOW_NETWORK=nitrolite
NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS=0x...
```

## Project Structure

```
├── apps/
│   ├── web/                 # Next.js frontend
│   │   ├── app/            # App router pages
│   │   ├── components/     # React components
│   │   └── lib/            # Utilities & stores
│   └── api/                # Fastify backend
│       ├── src/
│       │   ├── routes/     # API endpoints
│       │   ├── services/   # Business logic
│       │   └── middleware/ # Validation & error handling
├── packages/
│   ├── sdk/                # TypeScript SDK
│   │   ├── src/
│   │   │   ├── clients/    # API clients
│   │   │   ├── types.ts    # Type definitions
│   │   │   └── abis/       # Contract ABIs
│   ├── contracts/          # Smart contracts
│   │   ├── src/            # Solidity contracts
│   │   ├── script/         # Deployment scripts
│   │   └── test/           # Contract tests
│   └── tsconfig/           # Shared TypeScript configs
```

## API Endpoints

### Quotes & Intents
- `POST /intents/quote` - Get swap quote
- `POST /intents/submit` - Submit swap intent
- `GET /intents/:fillId/status` - Get fill status

### Channels
- `GET /channel/status` - Get channel status
- `POST /channel/open` - Open state channel
- `POST /channel/close` - Close channel
- `POST /channel/settle` - Request settlement

### Policies
- `GET /policies` - List policies
- `POST /policies/create` - Create policy
- `POST /policies/:id/pause` - Pause policy
- `POST /policies/:id/resume` - Resume policy
- `POST /policies/:id/revoke` - Revoke policy

### Metrics
- `GET /metrics/kpis` - Get KPIs
- `GET /metrics/live` - SSE live metrics
- `GET /metrics/fills` - Recent fills

### Health
- `GET /healthz` - Health check
- `GET /healthz/ready` - Readiness check
- `GET /healthz/live` - Liveness check

## Smart Contracts

### USAINSettlementHub

Main contract for batch settlement of state channel transactions.

```solidity
contract USAINSettlementHub {
    event BatchSettled(bytes32 channelId, address[] tokens, address[] from, address[] to, uint256[] amounts);
    
    function settleBatch(bytes32 channelId, address[] calldata tokens, address[] calldata from, address[] calldata to, uint256[] calldata amounts) external;
}
```

### Deployment

```bash
# Deploy to Base Sepolia
cd packages/contracts
forge script script/DeployUSAINSettlementHub.s.sol:DeployUSAINSettlementHub --rpc-url base_sepolia --broadcast --verify

# Deploy to Arbitrum Sepolia
forge script script/DeployUSAINSettlementHub.s.sol:DeployUSAINSettlementHub --rpc-url arbitrum_sepolia --broadcast --verify
```

## SDK Usage

```typescript
import { USAINSDK } from '@usain/sdk'

const sdk = new USAINSDK({
  apiBaseUrl: 'http://localhost:4000',
  wsUrl: 'ws://localhost:4000',
  // ... other config
})

// Get quote
const quote = await sdk.api.quote({
  fromToken: 'USDC',
  toToken: 'DAI',
  amount: '1000',
  address: '0x...'
})

// Submit intent
const result = await sdk.api.submitIntent({
  intent: { pair: 'USDC-DAI', amount: '1000' },
  signature: '0x...',
  policyId: 'policy_123'
})

// Subscribe to live metrics
const cleanup = sdk.api.subscribeLiveMetrics(
  (metrics) => console.log(metrics),
  (error) => console.error(error)
)
```

## Testing

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm --filter @usain/api test

# Run frontend tests
pnpm --filter @usain/web test

# Run contract tests
pnpm --filter @usain/contracts test
```

## Deployment

### Vercel (Frontend)

```bash
# Deploy to Vercel
vercel --prod
```

### Railway/Render (Backend)

```bash
# Deploy backend
railway deploy
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## TROUBLESHOOTING

### Common Issues

#### Missing Environment Variables

**Problem**: Application fails to start with "Missing required environment variable" error.

**Solution**:
1. Ensure you've copied the example env files:
   ```bash
   cp apps/api/env.example apps/api/.env
   cp apps/web/env.local.example apps/web/.env.local
   cp packages/contracts/env.example packages/contracts/.env
   ```
2. Fill in all required values in each `.env` file
3. Restart the development servers

#### WebSocket/SSE Connection Issues

**Problem**: Live metrics not updating, connection errors in console.

**Solution**:
1. Check CORS settings in `apps/api/src/index.ts`:
   ```typescript
   await fastify.register(cors, {
     origin: 'http://localhost:3000', // Match your frontend URL
     credentials: true,
   });
   ```
2. Verify `NEXT_PUBLIC_API_BASE` in `.env.local` matches your backend URL
3. Check browser console for CORS errors
4. If using a proxy/firewall, ensure WebSocket connections are allowed

#### No Active Policy Error

**Problem**: Swap button disabled with "No Active Policy" message.

**Solution**:
1. Navigate to `/app/policies`
2. Click "Create Policy" button
3. Fill in policy details (name, spending limits, allowed pairs)
4. Ensure policy status is "active" (green badge)
5. Return to `/app/swap` - button should now be enabled

#### Policy Disabled Error

**Problem**: Swap fails with "Policy disabled" error after enabling.

**Solution**:
1. The system auto-retries after policy changes
2. If still failing, manually refresh policies:
   - Go to Policies page
   - Wait 2-3 seconds for sync
   - Return to swap page
3. Check policy rules match your swap parameters (pair, amount limits)

#### Signature Verification Failed

**Problem**: "Invalid EIP-712 signature" error when submitting swap.

**Solution**:
1. Ensure wallet is connected (check Wagmi provider)
2. Verify chainId matches backend config (default: 84532 for Base Sepolia)
3. Check domain separator in EIP-712 message matches contract
4. Try disconnecting and reconnecting wallet
5. Clear browser cache/cookies

#### Contract Not Deployed

**Problem**: "Settlement hub not found" or "Contract not deployed" error.

**Solution**:
1. Deploy the contract to your network:
   ```bash
   cd packages/contracts
   forge script script/DeployUSAINSettlementHub.s.sol:DeployUSAINSettlementHub --rpc-url ethereum_sepolia --broadcast --verify
   ```
2. Update `NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS` in `.env.local`
3. Update `SETTLEMENT_HUB_ADDRESS` in `apps/api/.env`
4. Restart both frontend and backend

#### Live Metrics Not Streaming

**Problem**: Dashboard shows stale data, no real-time updates.

**Solution**:
1. Check backend is running on correct port (default: 4000)
2. Verify SSE endpoint is accessible: `curl http://localhost:4000/metrics/live`
3. Check browser console for EventSource errors
4. Look for "Reconnecting..." badge - if present, backend may be down
5. Verify `MetricsService` is started in `apps/api/src/index.ts`

#### Build Errors

**Problem**: TypeScript errors during build.

**Solution**:
1. Ensure all dependencies are installed: `pnpm install`
2. Build packages in order:
   ```bash
   pnpm --filter @usain/contracts build
   pnpm --filter @usain/sdk build
   pnpm --filter @usain/web build
   ```
3. Check TypeScript version: `pnpm list typescript` (should be 5.4.0+)
4. Clear build caches:
   ```bash
   pnpm clean
   rm -rf .next node_modules/.cache
   pnpm install
   ```

#### Port Already in Use

**Problem**: "Port 3000/4000 already in use" error.

**Solution**:
1. Find and kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -i :3000
   kill -9 <PID>
   ```
2. Or change the port in environment variables:
   - Frontend: Add `PORT=3001` to `.env.local`
   - Backend: Change `PORT` in `apps/api/.env`

#### Mock Data Still Showing

**Problem**: Real backend running but frontend shows mock data.

**Solution**:
1. Check `NEXT_PUBLIC_USE_MOCKS` in `.env.local` is set to `false`
2. Verify `NEXT_PUBLIC_API_BASE` points to your backend URL
3. Restart the Next.js dev server
4. Clear browser cache and hard reload (Ctrl+Shift+R)

#### Tests Failing

**Problem**: Playwright tests fail with timeout errors.

**Solution**:
1. Ensure both frontend and backend are running
2. Check test URLs match your local setup (default: http://localhost:3000)
3. Some tests require wallet connection - use `test.skip()` if unavailable
4. Increase timeout in `playwright.config.ts`:
   ```typescript
   timeout: 30000, // 30 seconds
   ```
5. Run tests in headed mode to debug: `pnpm test:headed`

### Debug Mode

Enable verbose logging:

```bash
# Backend
LOG_LEVEL=debug pnpm --filter @usain/api dev

# Frontend (browser console)
localStorage.setItem('debug', 'usain:*')
```

### Getting Help

If issues persist:
1. Check browser console for errors
2. Check backend logs for stack traces
3. Verify all environment variables are set correctly
4. Try with mocks enabled: `NEXT_PUBLIC_USE_MOCKS=true`
5. Open an issue with:
   - Error message
   - Browser/Node version
   - Steps to reproduce

## Support

- Documentation: [docs.usain.com](https://docs.usain.com)
- Discord: [discord.gg/usain](https://discord.gg/usain)
- Twitter: [@usainprotocol](https://twitter.com/usainprotocol)