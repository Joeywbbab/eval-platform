import type React from "react"
import type { Metadata } from "next/metadata"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"
import { Suspense } from "react"
import { TopNav } from "@/components/top-nav"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "AI Agent Benchmark & Evaluation Console",
  description: "Manage execution traces, evaluations, and benchmarks for AI agents",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="flex h-screen">
            <AppSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <TopNav />
              <div className="flex-1 overflow-auto">{children}</div>
            </main>
          </div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
