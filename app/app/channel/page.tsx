"use client"

import { useEffect, useState } from "react"
import { Radio, Clock } from "lucide-react"
import { useChannelStore } from "@/lib/stores/channel-store"

export default function ChannelPage() {
  const { channel, fetchStatus, openChannel, closeChannel, requestSettlement } = useChannelStore()
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  useEffect(() => {
    if (channel?.nextNettingEtaSec) {
      setCountdown(channel.nextNettingEtaSec)
      const timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [channel?.nextNettingEtaSec])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-bold text-white mb-2">State Channel</h1>
        <p className="text-muted-text">Manage your ERC-7824 state channel</p>
      </div>

      {/* Channel status */}
      <div className="glass p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                channel?.status === "OPEN" ? "bg-accent/10" : "bg-white/5"
              }`}
            >
              <Radio className={`h-8 w-8 ${channel?.status === "OPEN" ? "text-accent" : "text-muted-text"}`} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {channel?.status === "OPEN" ? "Channel Open" : "Channel Closed"}
              </h2>
              <p className="text-sm text-muted-text">{channel?.channelId || "No active channel"}</p>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              channel?.status === "OPEN" ? "bg-accent/10 text-accent" : "bg-white/5 text-muted-text"
            }`}
          >
            {channel?.status || "CLOSED"}
          </span>
        </div>

        {channel?.status === "OPEN" && (
          <>
            {/* Balances */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {channel.balances.map((balance) => (
                <div key={balance.token} className="p-4 rounded-xl bg-white/5">
                  <div className="text-sm text-muted-text mb-1">{balance.token}</div>
                  <div className="text-2xl font-bold text-white">{balance.amount}</div>
                </div>
              ))}
            </div>

            {/* Next netting */}
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-white">Next Netting ETA</span>
                </div>
                <div className="text-2xl font-bold text-primary">{formatTime(countdown)}</div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {channel?.status === "OPEN" ? (
            <>
              <button
                onClick={requestSettlement}
                className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all px-6 py-3 flex-1"
              >
                Request Settlement
              </button>
              <button
                onClick={closeChannel}
                className="px-6 py-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-colors font-medium"
              >
                Close Channel
              </button>
            </>
          ) : (
            <button
              onClick={openChannel}
              className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all px-6 py-3 flex-1"
            >
              Open Channel
            </button>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="glass p-8">
        <h3 className="text-xl font-semibold text-white mb-6">How State Channels Work</h3>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Swap in-channel</h4>
              <p className="text-sm text-muted-text text-pretty">
                Execute swaps instantly within the state channel with zero gas cost per transaction.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-bold">2</span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">Netting</h4>
              <p className="text-sm text-muted-text text-pretty">
                Multiple swaps are netted together to calculate the final balance changes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">3</span>
            </div>
            <div>
              <h4 className="text-white font-medium mb-1">On-chain batch</h4>
              <p className="text-sm text-muted-text text-pretty">
                Netted results are settled on-chain in a single transaction, saving gas for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
