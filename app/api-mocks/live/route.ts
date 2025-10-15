import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const sendMetrics = () => {
        const data = {
          kpis: {
            gasSavedUSD: (37.42 + Math.random() * 5).toFixed(2),
            latencyP50: 180 + Math.floor(Math.random() * 40),
            latencyP95: 320 + Math.floor(Math.random() * 80),
            volume24h: (12845 + Math.random() * 1000).toFixed(0),
            users: (42 + Math.floor(Math.random() * 10)).toString(),
          },
          lastFill: {
            pair: "USDC-DAI",
            amount: (Math.random() * 100).toFixed(2),
            price: "0.9994",
            savingsUSD: (Math.random() * 2).toFixed(2),
            ts: Date.now(),
          },
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      // Send initial data
      sendMetrics()

      // Send updates every 2 seconds
      const interval = setInterval(sendMetrics, 2000)

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
