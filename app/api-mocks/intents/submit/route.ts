import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  // Simulate swap execution
  await new Promise((resolve) => setTimeout(resolve, 180 + Math.random() * 120))

  return NextResponse.json({
    status: "filled",
    fillId: `fill_${Date.now()}`,
    ts: Date.now(),
    channelId: "chnl_001",
    latencyMs: 170 + Math.floor(Math.random() * 60),
  })
}
