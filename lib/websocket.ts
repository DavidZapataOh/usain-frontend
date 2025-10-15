export function connectWebSocket(onMessage: (data: any) => void) {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URI || "ws://localhost:3000/api-mocks/live")

  ws.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (error) {
      console.error("[v0] WebSocket parse error:", error)
    }
  })

  ws.addEventListener("error", (error) => {
    console.error("[v0] WebSocket error:", error)
  })

  return ws
}
