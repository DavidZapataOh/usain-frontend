export function connectWebSocket(onMessage: (data: any) => void) {
  const eventSource = new EventSource(process.env.NEXT_PUBLIC_WS_URI || "http://localhost:3000/api-mocks/live")

  eventSource.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data)
      onMessage(data)
    } catch (error) {
      console.error("[v0] EventSource parse error:", error)
    }
  })

  eventSource.addEventListener("error", (error) => {
    console.error("[v0] EventSource error:", error)
  })

  // Return an object that mimics WebSocket interface for compatibility
  return {
    close: () => eventSource.close(),
    addEventListener: (event: string, handler: any) => {
      if (event === "close") {
        eventSource.addEventListener("error", handler)
      } else if (event === "open") {
        // EventSource doesn't have an "open" event, so we'll simulate it
        setTimeout(() => handler(), 0)
      } else {
        eventSource.addEventListener(event, handler)
      }
    }
  }
}
