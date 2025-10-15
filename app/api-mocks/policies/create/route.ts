import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const body = await request.json()

  return NextResponse.json({
    id: `poly-${Date.now()}`,
    ...body,
    status: "active",
    usedToday: "0.00",
    createdAt: Date.now(),
  })
}
