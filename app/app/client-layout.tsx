"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, ArrowLeftRight, Shield, LayoutDashboard, Radio, Settings, Menu, X, Globe, Wallet } from "lucide-react"
import { SpeedRail } from "@/components/speed-rail"
import { useSwapStore } from "@/lib/stores/swap-store"

const navigation = [
  { name: "Swap", href: "/app/swap", icon: ArrowLeftRight },
  { name: "Policies", href: "/app/policies", icon: Shield },
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Channel", href: "/app/channel", icon: Radio },
  { name: "Settings", href: "/app/settings", icon: Settings },
]

export default function ClientAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lastFill = useSwapStore((state) => state.lastFill)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-card/95 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="h-5 w-5 text-black" />
              </div>
              <span className="font-sans text-xl font-bold text-white">USAIN</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 text-sm">
              <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-muted-text">Base Sepolia</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" aria-label="Change language">
              <Globe className="h-5 w-5 text-muted-text" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline text-sm font-medium">0x1234...5678</span>
            </button>
          </div>
        </div>

        {/* SpeedRail */}
        <SpeedRail lastFill={lastFill} />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 
          border-r border-white/10 bg-card/95 backdrop-blur-sm
          transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-colors
                    ${isActive ? "bg-primary/10 text-primary" : "text-muted-text hover:bg-white/5 hover:text-white"}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
