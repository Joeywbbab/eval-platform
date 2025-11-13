"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ErrorBoundary } from "@/components/error-boundary"

// Mock queue data
const queueItems = [
  { id: "eval-001", traceId: "trace-1234", createdAt: "2025-01-10 14:30", status: "pending" },
  { id: "eval-002", traceId: "trace-1235", createdAt: "2025-01-10 13:15", status: "pending" },
  { id: "eval-003", traceId: "trace-1236", createdAt: "2025-01-10 12:00", status: "pending" },
  { id: "eval-004", traceId: "trace-1237", createdAt: "2025-01-10 11:45", status: "pending" },
  { id: "eval-005", traceId: "trace-1238", createdAt: "2025-01-10 10:30", status: "pending" },
]

export default function DashboardPage() {
  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System overview and key metrics</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Left side - Summary Cards */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="grid gap-4 md:grid-cols-2 mb-6">
                <MetricCard
                  title="Total Conversations"
                  value={24}
                  trend={{ value: "+12%", direction: "up", label: "from last week" }}
                />
                <MetricCard
                  title="Total Evaluations"
                  value={227}
                  trend={{ value: "+18%", direction: "up", label: "this month" }}
                />
              </div>

              {/* Evaluation Details Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Evaluation Queue</h2>
                  <p className="text-sm text-muted-foreground">{queueItems.length} items pending</p>
                </div>

                <div className="space-y-2">
                  {queueItems.map((item) => (
                    <Link
                      key={item.id}
                      href="/evaluation/feedback"
                      className="block p-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm font-mono text-foreground truncate">{item.traceId}</span>
                          <span className="text-sm text-muted-foreground">{item.createdAt}</span>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">Pending</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side - Removed */}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
