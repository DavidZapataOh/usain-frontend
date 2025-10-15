import { create } from "zustand"

interface SwapState {
  lastFill: { latencyMs: number; ts: number } | null
  isSwapping: boolean
  setLastFill: (fill: { latencyMs: number; ts: number }) => void
  setIsSwapping: (isSwapping: boolean) => void
}

export const useSwapStore = create<SwapState>((set) => ({
  lastFill: null,
  isSwapping: false,
  setLastFill: (fill) => set({ lastFill: fill }),
  setIsSwapping: (isSwapping) => set({ isSwapping }),
}))
