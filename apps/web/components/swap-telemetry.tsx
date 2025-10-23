"use client"

import { useState } from "react"
import { TrendingUp, Clock, DollarSign, Users } from "lucide-react"
import { useLiveMetrics } from "@/lib/use-live-metrics"
import { ReconnectBadge } from "./reconnect-badge"

export function SwapTelemetry() {
  const [metrics, setMetrics] = useState({
    gasSavedUSD: "0.00",
    latencyP50: 0,
    latencyP95: 0,
    volume24h: "0",
    users: "0",
  })
  const [recentFills, setRecentFills] = useState<any[]>([])

  const { isConnected, isReconnecting, reconnectAttempts, reconnect } = useLiveMetrics((data) => {
    if (data.kpis) {
      setMetrics(data.kpis)
    }
    if (data.lastFill) {
      setRecentFills((prev) => [data.lastFill, ...prev].slice(0, 5))
    }
  })

  const kpis = [
    { label: "Gas Saved", value: `$${metrics.gasSavedUSD}`, icon: DollarSign, color: "text-accent" },
    { label: "Latency p95", value: `${metrics.latencyP95}ms`, icon: Clock, color: "text-primary" },
    { label: "Volume 24h", value: `$${metrics.volume24h}`, icon: TrendingUp, color: "text-accent" },
    { label: "Active Users", value: metrics.users, icon: Users, color: "text-primary" },
  ]

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Live Metrics</h3>
          <ReconnectBadge 
            isConnected={isConnected}
            isReconnecting={isReconnecting}
            reconnectAttempts={reconnectAttempts}
            onManualReconnect={reconnect}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="kpi">
              <div className="flex items-center gap-2 mb-1">
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                <span className="text-xs text-muted-text">{kpi.label}</span>
              </div>
              <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent fills */}
      <div className="glass p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Fills</h3>
        <div className="space-y-3">
          {recentFills.length === 0 ? (
            <p className="text-sm text-muted-text text-center py-4">No recent fills</p>
          ) : (
            recentFills.map((fill, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                <div>
                  <div className="text-sm font-medium text-white">{fill.pair}</div>
                  <div className="text-xs text-muted-text">
                    {fill.amount} @ {fill.price}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-accent">${fill.savingsUSD}</div>
                  <div className="text-xs text-muted-text">saved</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
