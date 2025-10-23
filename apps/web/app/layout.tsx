import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Sora, Inter } from "next/font/google"
import { WagmiProviderWrapper } from "../lib/wagmi-provider"
import { Toaster } from "react-hot-toast"
import "./globals.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
})

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "USAIN - Instant Swaps with State Channels",
  description:
    "Swap instantly with no gas per interaction. State channels (ERC-7824) + secure delegation + live telemetry.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${sora.variable} ${inter.variable}`}>
      <body>
        <WagmiProviderWrapper>
          {children}
          <Toaster />
        </WagmiProviderWrapper>
      </body>
    </html>
  )
}
