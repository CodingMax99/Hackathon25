import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "DealBrief - Strategic Alignment Copilot",
  description: "Turns public news + CRM history into a synergy-first sales brief",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "'Segoe UI Semibold', 'Segoe UI', system-ui, sans-serif", fontWeight: 600 }}>{children}</body>
    </html>
  )
}
