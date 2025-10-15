"use client"

import { useState } from "react"
import { Globe, Moon, Network, Code } from "lucide-react"

export default function SettingsPage() {
  const [language, setLanguage] = useState("en")
  const [network, setNetwork] = useState("base-sepolia")
  const [useMocks, setUseMocks] = useState(true)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-sans text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-muted-text">Configure your USAIN experience</p>
      </div>

      <div className="space-y-6">
        {/* Language */}
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Language</h3>
          </div>
          <div className="flex gap-3">
            {[
              { code: "en", label: "English" },
              { code: "es", label: "Español" },
            ].map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  language === lang.code ? "bg-primary/10 text-primary" : "bg-white/5 text-muted-text hover:bg-white/10"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Network */}
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Network className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-white">Network</h3>
          </div>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-primary/50"
          >
            <option value="base-sepolia">Base Sepolia</option>
            <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
          </select>
        </div>

        {/* Theme */}
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-white">Theme</h3>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <span className="text-white">Dark Mode</span>
            <div className="h-6 w-11 rounded-full bg-primary relative">
              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-black" />
            </div>
          </div>
        </div>

        {/* Dev flags */}
        <div className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-semibold text-white">Developer</h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-4 rounded-xl bg-white/5 cursor-pointer">
              <span className="text-white">Use Mock APIs</span>
              <input
                type="checkbox"
                checked={useMocks}
                onChange={(e) => setUseMocks(e.target.checked)}
                className="h-5 w-5 rounded accent-primary"
              />
            </label>
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary">Mock APIs are enabled. All data is simulated for development.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
