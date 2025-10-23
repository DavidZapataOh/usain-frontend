import type React from "react"
import ClientAppLayout from "./client-layout"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientAppLayout>{children}</ClientAppLayout>
}
