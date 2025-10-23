import { NextResponse } from "next/server"

export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return NextResponse.json({ success: true, channelId: "chnl_001" })
}
