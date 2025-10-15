# USAIN Frontend

Instant swap router with state channels (ERC-7824), secure delegation, and live telemetry.

## Features

- ⚡ **Instant Swaps** - Execute swaps in <300ms with zero gas per interaction
- 🛡️ **Policy Management** - Set spending limits and allowed pairs with Lit Protocol
- 📊 **Live Dashboard** - Real-time KPIs, charts, and telemetry via WebSocket
- 🔄 **State Channels** - ERC-7824 channels with batch settlement
- 🎨 **SpeedRail™** - Signature visual element showing swap speed in real-time

## Tech Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **State**: Zustand
- **Charts**: Recharts
- **Validation**: Zod
- **Icons**: Lucide React

## Getting Started

\`\`\`bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

\`\`\`env
NEXT_PUBLIC_USE_MOCKS=true
NEXT_PUBLIC_ENVIO_GQL_URI=http://localhost:4000/graphql
NEXT_PUBLIC_WS_URI=ws://localhost:3000/api-mocks/live
NEXT_PUBLIC_SUPPORTED_NETWORKS=base-sepolia,arbitrum-sepolia
\`\`\`

## Project Structure

\`\`\`
app/
├── page.tsx                 # Landing page
├── app/
│   ├── layout.tsx          # App layout with sidebar + SpeedRail
│   ├── swap/               # Instant swap interface
│   ├── policies/           # Policy management
│   ├── dashboard/          # Live telemetry dashboard
│   ├── channel/            # State channel control
│   └── settings/           # App settings
├── api-mocks/              # Mock API endpoints
components/
├── speed-rail.tsx          # SpeedRail™ component
├── swap-form.tsx           # Swap form
└── swap-telemetry.tsx      # Live metrics
lib/
├── stores/                 # Zustand stores
├── api.ts                  # API client with Zod validation
└── websocket.ts            # WebSocket client
\`\`\`

## Mock APIs

All backend integrations are mocked for development:

- `/api-mocks/intents/quote` - Get swap quote
- `/api-mocks/intents/submit` - Submit swap intent
- `/api-mocks/policies` - Policy CRUD operations
- `/api-mocks/channel/*` - Channel management
- `/api-mocks/live` - WebSocket for live metrics (SSE)

## Replacing Mocks with Real SDKs

### Envio (HyperIndex)

Replace `lib/envio.ts` with GraphQL client:

\`\`\`ts
import { createClient } from 'urql'

const client = createClient({
  url: process.env.NEXT_PUBLIC_ENVIO_GQL_URI!,
})

export async function getKpis() {
  const result = await client.query(KPI_QUERY, {}).toPromise()
  return result.data
}
\`\`\`

### Vincent (Lit Protocol)

Replace policy functions in `lib/api.ts`:

\`\`\`ts
import { LitNodeClient } from '@lit-protocol/lit-node-client'

export async function createPolicy(data: PolicyData) {
  const litClient = new LitNodeClient({ ... })
  // Implement Lit Protocol delegation
}
\`\`\`

### Yellow (State Channels)

Replace channel functions in `lib/api.ts`:

\`\`\`ts
import { YellowSDK } from '@yellow/sdk'

const yellow = new YellowSDK({ ... })

export async function openChannel() {
  return yellow.channels.open({ ... })
}
\`\`\`

## Architecture

\`\`\`
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─── Next.js App Router
       │    ├─ Landing (/)
       │    └─ App (/app/*)
       │       ├─ SpeedRail™ (live fills)
       │       ├─ Swap (instant execution)
       │       ├─ Policies (delegation)
       │       ├─ Dashboard (telemetry)
       │       └─ Channel (state mgmt)
       │
       ├─── Zustand Stores
       │    ├─ Swap state
       │    ├─ Policy state
       │    └─ Channel state
       │
       └─── Mock APIs (dev)
            ├─ REST endpoints
            └─ WebSocket (SSE)

Production:
├─ Envio HyperIndex (GraphQL)
├─ Lit/Vincent (delegation)
└─ Yellow SDK (channels)
\`\`\`

## Key Features

### SpeedRail™

The signature visual element - a live progress bar under the topbar that pulses with each swap:

- Ambient animation when idle
- 180-300ms pulse on swap execution
- Shows "Filled in X ms" after each swap
- Gradient from brand yellow to accent teal

### Instant Swaps

- Zero gas per swap (state channel execution)
- <300ms average latency
- Real-time quote with savings comparison
- Policy-gated execution

### Live Dashboard

- WebSocket updates every 2s
- KPIs: Gas saved, latency p50/p95, volume, users
- Charts: Latency timeline, volume by pair, cumulative gas saved
- Recent operations table

## Testing

\`\`\`bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e
\`\`\`

## License

MIT
