"use client"

import { useState } from "react"
import { Zap, ChevronDown, ArrowDown, Info, Wallet } from "lucide-react"
import { useSwapStore } from "@/lib/stores/swap-store"
import { quoteIntent, submitIntent } from "@/lib/api"
import { useEIP712Signer } from "@/lib/use-eip712-signer"
import { useToast } from "@/lib/use-toast"
import { useAccount } from "wagmi"
import { usePolicies } from "@/lib/use-policies"

const TOKENS = [
  { symbol: "USDC", name: "USD Coin", logo: "💵" },
  { symbol: "DAI", name: "Dai Stablecoin", logo: "💰" },
  { symbol: "USDT", name: "Tether USD", logo: "💲" },
]

export function SwapForm() {
  const [fromToken, setFromToken] = useState("USDC")
  const [toToken, setToToken] = useState("DAI")
  const [amount, setAmount] = useState("")
  const [isQuoting, setIsQuoting] = useState(false)
  const [quote, setQuote] = useState<any>(null)

  const { setLastFill, isSwapping, setIsSwapping } = useSwapStore()
  const { address, isConnected } = useAccount()
  const { signIntent, isSigning } = useEIP712Signer()
  const { showSuccess, showError, showLoading, dismiss } = useToast()
  const { activePolicy, refreshPolicies } = usePolicies()

  const handleQuote = async () => {
    if (!amount || Number.parseFloat(amount) <= 0) return

    setIsQuoting(true)
    try {
      const result = await quoteIntent({
        fromToken,
        toToken,
        amount,
        address: address || "0x0000000000000000000000000000000000000000",
      })
      setQuote(result)
    } catch (error) {
      console.debug("[Swap] Quote error:", error)
      showError("Failed to get quote. Please try again.", error)
    } finally {
      setIsQuoting(false)
    }
  }

  const handleSwap = async () => {
    if (!quote || !address) return

    // Check if there's an active policy
    if (!activePolicy) {
      showError('No active policy found. Please create a policy first.');
      return;
    }

    const loadingToast = showLoading("Signing transaction...")
    setIsSwapping(true)
    
    try {
      // Create intent data for EIP-712 signing
      const intentData = {
        pair: `${fromToken}-${toToken}`,
        amount,
        fromToken,
        toToken,
        userAddress: address,
        nonce: Date.now().toString(),
        deadline: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
      }

      // Sign the intent
      const signature = await signIntent(intentData)
      if (!signature) {
        throw new Error("Failed to sign transaction")
      }

      dismiss(loadingToast)
      const swapToast = showLoading("Submitting swap...")

      // Submit the intent with signature
      const result = await submitIntent({
        intent: { pair: intentData.pair, amount: intentData.amount },
        signature,
        policyId: activePolicy.id,
      })

      dismiss(swapToast)
      showSuccess(`Filled in ${result.latencyMs}ms!`)

      setLastFill({
        latencyMs: result.latencyMs,
        ts: result.ts,
      })

      // Reset form
      setAmount("")
      setQuote(null)
    } catch (error) {
      console.debug("[Swap] Swap error:", error)
      showError("Swap failed. Please try again.", error)
      
      // Auto-retry: refresh policies in case policy was enabled
      try {
        await refreshPolicies();
      } catch (refreshError) {
        console.debug("[Swap] Failed to refresh policies:", refreshError);
      }
    } finally {
      dismiss(loadingToast)
      setIsSwapping(false)
    }
  }

  const percentages = [25, 50, 75, 100]

  return (
    <div className="glass p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-white">Instant Swap</h2>
        <div className="flex items-center gap-3">
          <PolicyStatus />
          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent">MEV-free</span>
        </div>
      </div>

      {/* From */}
      <div className="p-4 bg-white/5 rounded-xl mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-text">From</span>
          <span className="text-sm text-muted-text">Balance: 1,000.00</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-semibold text-white outline-none focus:ring-2 focus:ring-primary/30 rounded px-2"
            aria-label={`Amount of ${fromToken} to swap`}
          />
          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:ring-2 focus:ring-primary/50"
            aria-label={`Select token to swap from (currently ${fromToken})`}
          >
            <span className="text-xl">{TOKENS.find((t) => t.symbol === fromToken)?.logo}</span>
            <span className="font-medium text-white">{fromToken}</span>
            <ChevronDown className="h-4 w-4 text-muted-text" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          {percentages.map((pct) => (
            <button
              key={pct}
              onClick={() => setAmount(((1000 * pct) / 100).toString())}
              className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-muted-text transition-colors focus:ring-2 focus:ring-primary/50"
              aria-label={`Set amount to ${pct}% of balance`}
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Swap direction */}
      <div className="flex justify-center -my-2 relative z-10">
        <button 
          className="p-2 rounded-lg bg-card border border-white/10 hover:bg-white/5 transition-colors focus:ring-2 focus:ring-primary/50"
          aria-label="Reverse swap direction"
        >
          <ArrowDown className="h-4 w-4 text-muted-text" />
        </button>
      </div>

      {/* To */}
      <div className="p-4 bg-white/5 rounded-xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-text">To</span>
          <span className="text-sm text-muted-text">Balance: 250.00</span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={quote ? (Number.parseFloat(amount) * Number.parseFloat(quote.price)).toFixed(2) : "0.00"}
            readOnly
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-semibold text-white outline-none"
            aria-label={`Amount of ${toToken} you will receive`}
          />
          <button 
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors focus:ring-2 focus:ring-primary/50"
            aria-label={`Select token to swap to (currently ${toToken})`}
          >
            <span className="text-xl">{TOKENS.find((t) => t.symbol === toToken)?.logo}</span>
            <span className="font-medium text-white">{toToken}</span>
            <ChevronDown className="h-4 w-4 text-muted-text" />
          </button>
        </div>
      </div>

      {/* Quote details */}
      {quote && (
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
          <div className="flex justify-between p-3 rounded-lg bg-white/5">
            <span className="text-muted-text">Price</span>
            <span className="text-white font-medium">{quote.price}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-white/5">
            <span className="text-muted-text">Fee</span>
            <span className="text-white font-medium">${quote.fee}</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-white/5">
            <span className="text-muted-text">ETA</span>
            <span className="text-accent font-medium">~{quote.etaMs}ms</span>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-white/5">
            <span className="text-muted-text">Saved</span>
            <span className="text-accent font-medium">${quote.savingsUSD}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {!isConnected ? (
          <button
            disabled
            className="bg-muted text-muted-foreground rounded-xl font-semibold w-full py-4 text-lg flex items-center justify-center gap-2 cursor-not-allowed"
            aria-label="Connect wallet to swap"
          >
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </button>
        ) : !quote ? (
          <button
            onClick={handleQuote}
            disabled={!amount || Number.parseFloat(amount) <= 0 || isQuoting}
            className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-primary/50"
            aria-label="Get quote for swap"
          >
            {isQuoting ? "Getting Quote..." : "Get Quote"}
          </button>
        ) : (
          <button
            onClick={handleSwap}
            disabled={isSwapping || isSigning || !activePolicy}
            className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all w-full py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-primary/50"
            aria-label={!activePolicy ? "No active policy - create one first" : "Execute instant swap"}
          >
            <Zap className="h-5 w-5" />
            {!activePolicy ? "No Active Policy" : isSigning ? "Signing..." : isSwapping ? "Swapping..." : "Instant Swap"}
          </button>
        )}
      </div>

      {/* Comparison */}
      {quote && (
        <div className="mt-4 p-3 rounded-lg bg-white/5 border border-accent/20">
          <div className="flex items-start gap-2 text-xs">
            <Info className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-muted-text">
              <span className="text-white">Uniswap est.:</span> ${quote.savingsUSD} / 12s •{" "}
              <span className="text-accent font-medium">You saved ${quote.savingsUSD} & ~11.8s</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
