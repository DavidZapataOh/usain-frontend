import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100))

  return NextResponse.json({
    price: "0.9995",
    fee: "0.00",
    route: [body.fromToken, body.toToken],
    etaMs: 180 + Math.floor(Math.random() * 120),
    savingsUSD: (Number.parseFloat(body.amount) * 0.0124).toFixed(2),
  })
}
