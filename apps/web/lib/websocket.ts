import { sdk } from './api'

export function connectWebSocket(onMessage: (data: any) => void) {
  // Use SDK's live metrics subscription
  const cleanup = sdk.api.subscribeLiveMetrics(
    (metrics) => {
      onMessage(metrics)
    },
    (error) => {
      console.debug("[SDK] Live metrics error:", error)
    }
  )

  // Return an object that mimics WebSocket interface for compatibility
  return {
    close: cleanup,
    addEventListener: (event: string, handler: any) => {
      if (event === "close") {
        // Store close handler for later use
        cleanup()
      } else if (event === "open") {
        // Simulate open event
        setTimeout(() => handler(), 0)
      }
    }
  }
}
