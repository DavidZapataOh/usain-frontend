import { create } from "zustand"
import {
  getChannelStatus,
  openChannel as apiOpenChannel,
  closeChannel as apiCloseChannel,
  requestSettlement as apiRequestSettlement,
} from "@/lib/api"

interface Channel {
  channelId: string
  status: "OPEN" | "CLOSED"
  balances: { token: string; amount: string }[]
  nextNettingEtaSec: number
}

interface ChannelState {
  channel: Channel | null
  fetchStatus: () => Promise<void>
  openChannel: () => Promise<void>
  closeChannel: () => Promise<void>
  requestSettlement: () => Promise<void>
}

export const useChannelStore = create<ChannelState>((set) => ({
  channel: null,

  fetchStatus: async () => {
    const channel = await getChannelStatus()
    set({ channel })
  },

  openChannel: async () => {
    await apiOpenChannel()
    const channel = await getChannelStatus()
    set({ channel })
  },

  closeChannel: async () => {
    await apiCloseChannel()
    set({ channel: null })
  },

  requestSettlement: async () => {
    await apiRequestSettlement()
  },
}))
