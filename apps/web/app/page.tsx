import Link from "next/link"
import { Zap, Shield, Activity, Layers } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-20 text-center">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-muted-text mb-6">
          <Zap className="h-4 w-4 text-primary" />
          <span>Powered by ERC-7824 State Channels</span>
        </div>

        <h1 className="font-sans text-5xl md:text-7xl font-bold text-white tracking-tight text-balance">
          Swap instantly. <span className="text-primary">No gas per interaction.</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-text max-w-2xl mx-auto text-pretty">
          State channels (ERC-7824) + secure delegation + live telemetry. Experience DeFi at the speed of thought.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/app/swap"
            className="bg-primary text-primary-foreground rounded-xl font-semibold hover:brightness-95 active:scale-[0.98] transition-all px-8 py-4 text-lg inline-flex items-center justify-center gap-2"
          >
            <Zap className="h-5 w-5" />
            Open App
          </Link>
          <button className="px-8 py-4 rounded-xl bg-white/10 text-white hover:bg-white/15 transition-colors text-lg font-medium">
            How it works
          </button>
        </div>

        {/* Comparison */}
        <div className="mt-20 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="glass p-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Traditional DEX</h3>
              <div className="text-sm text-muted-text">~12s</div>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-text/30 rounded-full animate-pulse"
                  style={{ width: "100%", animationDuration: "12s" }}
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-text">
                <span className="text-danger">⛽</span>
                <span>Gas fee: $1.24</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 text-left border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">USAIN</h3>
              <div className="text-sm text-primary font-semibold">~0.18s</div>
            </div>
            <div className="space-y-3">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse-fill" />
              </div>
              <div className="flex items-center gap-2 text-sm text-accent">
                <Zap className="h-4 w-4" />
                <span>No gas per swap</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">MEV-free</h3>
            <p className="text-muted-text text-pretty">
              Execute swaps in state channels with instant finality and zero MEV exposure.
            </p>
          </div>

          <div className="glass p-8">
            <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Layers className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Batch Settlement</h3>
            <p className="text-muted-text text-pretty">
              Multiple swaps netted and settled on-chain in a single transaction.
            </p>
          </div>

          <div className="glass p-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure Delegation</h3>
            <p className="text-muted-text text-pretty">
              Set spending limits and allowed pairs with Lit Protocol integration.
            </p>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-white/10">
        <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-text">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span>Powered by Envio</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Lit Protocol</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>ERC-7824 Channels</span>
          </div>
        </div>
      </section>
    </div>
  )
}
