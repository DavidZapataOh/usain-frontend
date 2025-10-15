import { create } from "zustand"
import { fetchPolicies as apiFetchPolicies, createPolicy as apiCreatePolicy, updatePolicyStatus } from "@/lib/api"

interface Policy {
  id: string
  name: string
  status: "active" | "paused" | "revoked"
  dailyLimitUSD: string
  usedToday: string
  allowedPairs: string[]
  createdAt: number
}

interface PolicyState {
  policies: Policy[]
  activePolicyId: string | null
  fetchPolicies: () => Promise<void>
  createPolicy: (data: { name: string; dailyLimitUSD: string; allowedPairs: string[] }) => Promise<void>
  pausePolicy: (id: string) => Promise<void>
  resumePolicy: (id: string) => Promise<void>
  revokePolicy: (id: string) => Promise<void>
}

export const usePolicyStore = create<PolicyState>((set, get) => ({
  policies: [],
  activePolicyId: null,

  fetchPolicies: async () => {
    const policies = await apiFetchPolicies()
    set({ policies })
  },

  createPolicy: async (data) => {
    const newPolicy = await apiCreatePolicy(data)
    set((state) => ({ policies: [...state.policies, newPolicy] }))
  },

  pausePolicy: async (id) => {
    await updatePolicyStatus(id, "pause")
    set((state) => ({
      policies: state.policies.map((p) => (p.id === id ? { ...p, status: "paused" as const } : p)),
    }))
  },

  resumePolicy: async (id) => {
    await updatePolicyStatus(id, "resume")
    set((state) => ({
      policies: state.policies.map((p) => (p.id === id ? { ...p, status: "active" as const } : p)),
    }))
  },

  revokePolicy: async (id) => {
    await updatePolicyStatus(id, "revoke")
    set((state) => ({
      policies: state.policies.map((p) => (p.id === id ? { ...p, status: "revoked" as const } : p)),
    }))
  },
}))
