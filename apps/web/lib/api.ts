import { z } from "zod"
import { USAINSDK, QuoteRequestSchema, SubmitIntentRequestSchema } from "@usain/sdk"

// Initialize SDK
const sdk = new USAINSDK({
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000',
  wsUrl: process.env.NEXT_PUBLIC_WS_URI || 'ws://localhost:4000',
  envioHyperSyncUrl: process.env.NEXT_PUBLIC_ENVIO_HYPERSYNC_URL || 'https://base-sepolia.hypersync.xyz',
  envioGqlUri: process.env.NEXT_PUBLIC_ENVIO_GQL_URI || 'https://indexer.bigdevenergy.link/xxxxx/v1/graphql',
  litNetwork: process.env.NEXT_PUBLIC_LIT_NETWORK || 'datil-test',
  vincentPkpPublicKey: process.env.NEXT_PUBLIC_VINCENT_PKP_PUBLIC_KEY || '0x...',
  yellowRpcUrl: process.env.NEXT_PUBLIC_YELLOW_RPC_URL || 'https://sepolia.base.org',
  yellowNetwork: process.env.NEXT_PUBLIC_YELLOW_NETWORK || 'nitrolite',
      networks: [
        {
          chainId: 11155111,
          name: 'ethereum-sepolia',
          rpcUrl: 'https://sepolia.infura.io/v3/your-key',
          blockExplorer: 'https://sepolia.etherscan.io',
          settlementHubAddress: process.env.NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        {
          chainId: 84532,
          name: 'base-sepolia',
          rpcUrl: 'https://sepolia.base.org',
          blockExplorer: 'https://sepolia.basescan.org',
          settlementHubAddress: process.env.NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
        {
          chainId: 421614,
          name: 'arbitrum-sepolia',
          rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
          blockExplorer: 'https://sepolia.arbiscan.io',
          settlementHubAddress: process.env.NEXT_PUBLIC_SETTLEMENT_HUB_ADDRESS || '0x0000000000000000000000000000000000000000',
        },
      ],
})

// Feature flag to use mocks
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true'

// Mock implementations (fallback)
const mockQuoteIntent = async (params: {
  fromToken: string
  toToken: string
  amount: string
  address: string
}) => {
  const res = await fetch("/api-mocks/intents/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return QuoteRequestSchema.parse(data)
}

const mockSubmitIntent = async (params: {
  intent: { pair: string; amount: string }
  signature: string
  policyId: string
}) => {
  const res = await fetch("/api-mocks/intents/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return SubmitIntentRequestSchema.parse(data)
}

// Real implementations using SDK
export async function quoteIntent(params: {
  fromToken: string
  toToken: string
  amount: string
  address: string
}) {
  if (USE_MOCKS) {
    return mockQuoteIntent(params)
  }
  
  return sdk.api.quote(params)
}

export async function submitIntent(params: {
  intent: { pair: string; amount: string }
  signature: string
  policyId: string
}) {
  if (USE_MOCKS) {
    return mockSubmitIntent(params)
  }
  
  return sdk.api.submitIntent(params)
}

export async function fetchPolicies() {
  if (USE_MOCKS) {
    const res = await fetch("/api-mocks/policies")
    return res.json()
  }
  
  return sdk.api.getPolicies()
}

export async function createPolicy(data: any) {
  if (USE_MOCKS) {
    const res = await fetch("/api-mocks/policies/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  }
  
  return sdk.api.createPolicy(data)
}

export async function updatePolicyStatus(id: string, action: "pause" | "resume" | "revoke") {
  if (USE_MOCKS) {
    const res = await fetch(`/api-mocks/policies/${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    return res.json()
  }
  
  return sdk.api.updatePolicyStatus(id, action)
}

export async function getChannelStatus() {
  if (USE_MOCKS) {
    const res = await fetch("/api-mocks/channel/status")
    return res.json()
  }
  
  return sdk.api.getChannelStatus()
}

export async function openChannel() {
  if (USE_MOCKS) {
    const res = await fetch("/api-mocks/channel/open", { method: "POST" })
    return res.json()
  }
  
  return sdk.api.openChannel()
}

export async function closeChannel() {
  if (USE_MOCKS) {
    const res = await fetch("/api-mocks/channel/close", { method: "POST" })
    return res.json()
  }
  
  return sdk.api.closeChannel()
}

export async function requestSettlement() {
  if (USE_MOCKS) {
    const res = await fetch("/api-mocks/channel/settle", { method: "POST" })
    return res.json()
  }
  
  return sdk.api.requestSettlement()
}

// Export SDK for direct use
export { sdk }
