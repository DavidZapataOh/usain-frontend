"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Clock, DollarSign, Users } from "lucide-react"
import { connectWebSocket } from "@/lib/websocket"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    gasSavedUSD: "0.00",
    latencyP50: 0,
    latencyP95: 0,
    volume24h: "0",
    users: "0",
  })
  const [connected, setConnected] = useState(true)

  useEffect(() => {
    const ws = connectWebSocket((data) => {
      if (data.kpis) {
        setMetrics(data.kpis)
        setConnected(true)
      }
    })

    ws.addEventListener("close", () => setConnected(false))
    ws.addEventListener("open", () => setConnected(true))

    return () => {
      ws.close()
    }
  }, [])

  const kpis = [
    { label: "Gas Saved", value: `$${metrics.gasSavedUSD}`, icon: DollarSign, color: "text-accent", change: "+12.3%" },
    {
      label: "Latency p50/p95",
      value: `${metrics.latencyP50}/${metrics.latencyP95}ms`,
      icon: Clock,
      color: "text-primary",
      change: "-5.2%",
    },
    { label: "Volume 24h", value: `$${metrics.volume24h}`, icon: TrendingUp, color: "text-accent", change: "+23.1%" },
    { label: "Active Users", value: metrics.users, icon: Users, color: "text-primary", change: "+8.4%" },
  ]

  // Mock chart data
  const latencyData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    p50: 180 + Math.random() * 40,
    p95: 320 + Math.random() * 80,
  }))

  const volumeData = [
    { pair: "USDC-DAI", volume: 4523 },
    { pair: "USDT-USDC", volume: 3241 },
    { pair: "DAI-USDT", volume: 2156 },
  ]

  const gasSavedData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    saved: 10 + i * 1.2 + Math.random() * 5,
  }))

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-muted-text">Live telemetry and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5">
          <div className={`h-2 w-2 rounded-full ${connected ? "bg-accent animate-pulse" : "bg-danger"}`} />
          <span className="text-sm text-muted-text">{connected ? "Live" : "Reconnecting..."}</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <span className="text-xs font-medium text-accent">{kpi.change}</span>
            </div>
            <div className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
            <div className="text-sm text-muted-text">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Latency timeline */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Latency Timeline</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={latencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="#96A1B2" fontSize={12} />
              <YAxis stroke="#96A1B2" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12161F",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="p50" stroke="#FFD84D" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p95" stroke="#14B8A6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Volume by pair */}
        <div className="glass p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Volume by Pair</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="pair" stroke="#96A1B2" fontSize={12} />
              <YAxis stroke="#96A1B2" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#12161F",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="volume" fill="#14B8A6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gas saved cumulative */}
      <div className="glass p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Gas Saved (Cumulative)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={gasSavedData}>
            <defs>
              <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="time" stroke="#96A1B2" fontSize={12} />
            <YAxis stroke="#96A1B2" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12161F",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
              }}
            />
            <Area type="monotone" dataKey="saved" stroke="#14B8A6" fillOpacity={1} fill="url(#colorSaved)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent operations table */}
      <div className="glass p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Operations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-text">Pair</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-text">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-text">Latency</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-text">Saved</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-text">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { pair: "USDC-DAI", amount: "100.00", latency: "182ms", saved: "$1.24", status: "settled" },
                { pair: "USDT-USDC", amount: "250.00", latency: "195ms", saved: "$2.15", status: "settled" },
                { pair: "DAI-USDT", amount: "75.50", latency: "168ms", saved: "$0.89", status: "pending" },
              ].map((op, idx) => (
                <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm text-white">{op.pair}</td>
                  <td className="py-3 px-4 text-sm text-white">{op.amount}</td>
                  <td className="py-3 px-4 text-sm text-primary">{op.latency}</td>
                  <td className="py-3 px-4 text-sm text-accent">{op.saved}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        op.status === "settled" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {op.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
