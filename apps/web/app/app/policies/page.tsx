"use client"

import { useState, useEffect } from "react"
import { Shield, Plus, Pause, Play, Trash2 } from "lucide-react"
import { usePolicyStore } from "@/lib/stores/policy-store"

export default function PoliciesPage() {
  const { policies, fetchPolicies, createPolicy, pausePolicy, resumePolicy, revokePolicy } = usePolicyStore()
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "revoked">("all")

  useEffect(() => {
    fetchPolicies()
  }, [fetchPolicies])

  const filteredPolicies = policies.filter((p) => {
    if (filter === "all") return true
    return p.status === filter
  })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sans text-3xl font-bold text-white mb-2">Policies</h1>
          <p className="text-muted-text">Manage delegation permissions and spending limits</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all px-6 py-3 flex items-center gap-2 focus:ring-2 focus:ring-primary/50"
          aria-label="Create new policy"
        >
          <Plus className="h-5 w-5" />
          Create Policy
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {(["all", "active", "paused", "revoked"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize focus:ring-2 focus:ring-primary/50 ${
              filter === f ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-text hover:bg-white/10"
            }`}
            aria-label={`Filter policies by ${f}`}
            aria-pressed={filter === f}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Policies list */}
      <div className="space-y-4">
        {filteredPolicies.map((policy) => (
          <div key={policy.id} className="glass p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    policy.status === "active" ? "bg-accent/10" : "bg-white/5"
                  }`}
                >
                  <Shield className={`h-5 w-5 ${policy.status === "active" ? "text-accent" : "text-muted-text"}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{policy.name}</h3>
                  <p className="text-sm text-muted-text">Created {new Date(policy.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  policy.status === "active"
                    ? "bg-accent/10 text-accent"
                    : policy.status === "paused"
                      ? "bg-primary/10 text-primary"
                      : "bg-danger/10 text-danger"
                }`}
              >
                {policy.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-xs text-muted-text mb-1">Daily Limit</div>
                <div className="text-sm font-medium text-white">${policy.dailyLimitUSD}</div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">Used Today</div>
                <div className="text-sm font-medium text-white">${policy.usedToday}</div>
              </div>
              <div>
                <div className="text-xs text-muted-text mb-1">Allowed Pairs</div>
                <div className="text-sm font-medium text-white">{policy.allowedPairs.join(", ")}</div>
              </div>
            </div>

            <div className="flex gap-2">
              {policy.status === "active" && (
                <button
                  onClick={() => pausePolicy(policy.id)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pause
                </button>
              )}
              {policy.status === "paused" && (
                <button
                  onClick={() => resumePolicy(policy.id)}
                  className="px-4 py-2 rounded-lg bg-accent/10 hover:bg-accent/20 text-sm font-medium text-accent transition-colors flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Resume
                </button>
              )}
              {policy.status !== "revoked" && (
                <button
                  onClick={() => revokePolicy(policy.id)}
                  className="px-4 py-2 rounded-lg bg-danger/10 hover:bg-danger/20 text-sm font-medium text-danger transition-colors flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Revoke
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create policy modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="glass p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-white mb-4">Create Policy</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-text mb-2 block">Policy Name</label>
                <input
                  type="text"
                  placeholder="My Trading Policy"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50"
                />
              </div>
              <div>
                <label className="text-sm text-muted-text mb-2 block">Daily Limit (USD)</label>
                <input
                  type="number"
                  placeholder="1000"
                  className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    createPolicy({
                      name: "New Policy",
                      dailyLimitUSD: "1000",
                      allowedPairs: ["USDC-DAI"],
                    })
                    setShowCreate(false)
                  }}
                  className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all flex-1 py-2"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
