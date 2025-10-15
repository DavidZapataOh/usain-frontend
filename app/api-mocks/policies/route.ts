import { NextResponse } from "next/server"

const mockPolicies = [
  {
    id: "poly-123",
    name: "Daily Trading",
    status: "active",
    dailyLimitUSD: "1000",
    usedToday: "247.50",
    allowedPairs: ["USDC-DAI", "USDT-USDC"],
    createdAt: Date.now() - 86400000 * 7,
  },
  {
    id: "poly-124",
    name: "Conservative",
    status: "paused",
    dailyLimitUSD: "500",
    usedToday: "0.00",
    allowedPairs: ["USDC-DAI"],
    createdAt: Date.now() - 86400000 * 3,
  },
]

export async function GET() {
  return NextResponse.json(mockPolicies)
}
