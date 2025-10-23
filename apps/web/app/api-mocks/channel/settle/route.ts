import { NextResponse } from "next/server"

export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return NextResponse.json({ success: true, txHash: "0xmock" })
}
