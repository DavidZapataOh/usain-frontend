"use client"

import { useEffect, useState } from "react"

interface SpeedRailProps {
  lastFill: { latencyMs: number; ts: number } | null
}

export function SpeedRail({ lastFill }: SpeedRailProps) {
  const [showPulse, setShowPulse] = useState(false)
  const [fillTime, setFillTime] = useState<number | null>(null)

  // Clamp latency to 120-400ms range, fallback to 220ms if missing
  const clampLatency = (latencyMs: number): number => {
    if (!latencyMs || latencyMs <= 0) return 220; // Fallback
    return Math.max(120, Math.min(400, latencyMs)); // Clamp to 120-400ms
  };

  useEffect(() => {
    if (lastFill) {
      const clampedLatency = clampLatency(lastFill.latencyMs);
      setShowPulse(true)
      setFillTime(clampedLatency)

      // Use clamped latency for pulse duration (scaled to visual effect)
      const pulseDuration = Math.max(200, Math.min(500, clampedLatency * 1.2));
      
      const timer = setTimeout(() => {
        setShowPulse(false)
      }, pulseDuration)

      const clearTimer = setTimeout(() => {
        setFillTime(null)
      }, 3000)

      return () => {
        clearTimeout(timer)
        clearTimeout(clearTimer)
      }
    }
  }, [lastFill])

  return (
    <div className="relative h-2 bg-white/5 overflow-hidden">
      {/* Ambient animation */}
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.06)_50%,transparent_100%)]"
        style={{
          backgroundSize: "40px 100%",
          animation: "slide 2s linear infinite",
        }}
      />

      {/* Pulse on fill */}
      {showPulse && (
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent"
          style={{
            animation: `pulse-fill ${Math.max(0.2, Math.min(0.5, (fillTime || 220) / 1000))}s ease-out forwards`,
          }}
        />
      )}

      {/* Fill time indicator */}
      {fillTime !== null && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-primary animate-in fade-in slide-in-from-right-2 duration-200">
          Filled in {fillTime}ms
        </div>
      )}
    </div>
  )
}
