"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, BarChart3, GitBranch, MessageSquare, FileText, User } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Tracing",
    items: [
      { name: "Traces", href: "/tracing/traces", icon: Activity },
      { name: "Trajectory View", href: "/tracing/trajectory", icon: GitBranch },
    ],
  },
  {
    name: "Evaluation",
    items: [
      { name: "Analytics", href: "/evaluation/analytics", icon: BarChart3 },
      { name: "Human Feedback", href: "/evaluation/feedback", icon: MessageSquare },
    ],
  },
  {
    name: "Benchmark",
    items: [{ name: "Benchmark", href: "/benchmarks", icon: FileText }],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">AI Eval Console</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((section) => (
          <div key={section.name} className="mb-6">
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              {section.name}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors">
          <div className="h-8 w-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
          <span>Account</span>
        </button>
      </div>
    </div>
  )
}
