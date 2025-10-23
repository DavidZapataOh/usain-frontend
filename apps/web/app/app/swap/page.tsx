"use client"
import { SwapForm } from "@/components/swap-form"
import { SwapTelemetry } from "@/components/swap-telemetry"

export default function SwapPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-bold text-white mb-2">Instant Swap</h1>
        <p className="text-muted-text">Execute swaps with zero gas and instant finality</p>
      </div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-6">
        <SwapForm />
        <SwapTelemetry />
      </div>
    </div>
  )
}
