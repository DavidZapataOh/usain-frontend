import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    channelId: "chnl_001",
    status: "OPEN",
    balances: [
      { token: "USDC", amount: "250.00" },
      { token: "DAI", amount: "50.00" },
    ],
    nextNettingEtaSec: 420,
  })
}
