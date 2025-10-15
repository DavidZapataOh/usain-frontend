import { z } from "zod"

const QuoteSchema = z.object({
  price: z.string(),
  fee: z.string(),
  route: z.array(z.string()),
  etaMs: z.number(),
  savingsUSD: z.string(),
})

const FillSchema = z.object({
  status: z.string(),
  fillId: z.string(),
  ts: z.number(),
  channelId: z.string(),
  latencyMs: z.number(),
})

export async function quoteIntent(params: {
  fromToken: string
  toToken: string
  amount: string
  address: string
}) {
  const res = await fetch("/api-mocks/intents/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return QuoteSchema.parse(data)
}

export async function submitIntent(params: {
  intent: { pair: string; amount: string }
  signature: string
  policyId: string
}) {
  const res = await fetch("/api-mocks/intents/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  })
  const data = await res.json()
  return FillSchema.parse(data)
}

export async function fetchPolicies() {
  const res = await fetch("/api-mocks/policies")
  return res.json()
}

export async function createPolicy(data: any) {
  const res = await fetch("/api-mocks/policies/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  return res.json()
}

export async function updatePolicyStatus(id: string, action: "pause" | "resume" | "revoke") {
  const res = await fetch(`/api-mocks/policies/${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
  return res.json()
}

export async function getChannelStatus() {
  const res = await fetch("/api-mocks/channel/status")
  return res.json()
}

export async function openChannel() {
  const res = await fetch("/api-mocks/channel/open", { method: "POST" })
  return res.json()
}

export async function closeChannel() {
  const res = await fetch("/api-mocks/channel/close", { method: "POST" })
  return res.json()
}

export async function requestSettlement() {
  const res = await fetch("/api-mocks/channel/settle", { method: "POST" })
  return res.json()
}
