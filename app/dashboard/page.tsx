"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, ThumbsUp, ThumbsDown } from "lucide-react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { FeedbackChart } from "@/components/dashboard/feedback-chart"
import { ErrorBoundary } from "@/components/error-boundary"

// Tracing performance trend data
const tracingTrendData = [
  { date: "Jan 5", latency: 0.75, cost: 0.88 },
  { date: "Jan 6", latency: 0.77, cost: 0.86 },
  { date: "Jan 7", latency: 0.76, cost: 0.87 },
  { date: "Jan 8", latency: 0.78, cost: 0.85 },
  { date: "Jan 9", latency: 0.79, cost: 0.86 },
  { date: "Jan 10", latency: 0.8, cost: 0.84 },
]

// Human Feedback distribution data (star ratings)
const feedbackDistributionData = [
  { rating: "1 Star", count: 2 },
  { rating: "2 Stars", count: 5 },
  { rating: "3 Stars", count: 12 },
  { rating: "4 Stars", count: 28 },
  { rating: "5 Stars", count: 35 },
]

// Mock queue data
const queueItems = [
  { id: "eval-001", traceId: "trace-1234", createdAt: "2025-01-10 14:30", status: "pending" },
  { id: "eval-002", traceId: "trace-1235", createdAt: "2025-01-10 13:15", status: "pending" },
  { id: "eval-003", traceId: "trace-1236", createdAt: "2025-01-10 12:00", status: "pending" },
  { id: "eval-004", traceId: "trace-1237", createdAt: "2025-01-10 11:45", status: "pending" },
  { id: "eval-005", traceId: "trace-1238", createdAt: "2025-01-10 10:30", status: "pending" },
]

// Mock good cases
const goodCases = [
  { id: "case-g1", traceId: "trace-2001", score: 95, feedback: "Excellent response quality", evaluatedAt: "2025-01-10" },
  { id: "case-g2", traceId: "trace-2002", score: 92, feedback: "Fast and accurate", evaluatedAt: "2025-01-10" },
  { id: "case-g3", traceId: "trace-2003", score: 90, feedback: "Good context understanding", evaluatedAt: "2025-01-09" },
  { id: "case-g4", traceId: "trace-2004", score: 88, feedback: "Comprehensive answer", evaluatedAt: "2025-01-09" },
]

// Mock bad cases
const badCases = [
  { id: "case-b1", traceId: "trace-3001", score: 45, feedback: "Inaccurate information", evaluatedAt: "2025-01-10" },
  { id: "case-b2", traceId: "trace-3002", score: 38, feedback: "Missed key context", evaluatedAt: "2025-01-10" },
  { id: "case-b3", traceId: "trace-3003", score: 52, feedback: "Slow response time", evaluatedAt: "2025-01-09" },
]

export default function DashboardPage() {
  // Memoize computed values to avoid unnecessary recalculations
  const totalRatings = useMemo(
    () => feedbackDistributionData.reduce((sum, item) => sum + item.count, 0),
    []
  )

  const highRatings = useMemo(
    () => feedbackDistributionData[4].count + feedbackDistributionData[3].count,
    []
  )

  const lowRatings = useMemo(
    () => feedbackDistributionData[0].count + feedbackDistributionData[1].count,
    []
  )

  return (
    <ErrorBoundary>
      <div className="flex h-full flex-col">
        <div className="border-b border-border bg-card px-6 py-4">
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">System overview and key metrics</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="flex h-full">
            {/* Left side - Main metrics */}
            <div className="flex-1 p-6 overflow-auto">
              <div className="space-y-6">
                {/* Tracing Visualization Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Tracing Visualization</h2>

                  {/* Tracing Metrics */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard
                      title="Total Traces"
                      value={24}
                      trend={{ value: "+12%", direction: "up", label: "from last week" }}
                    />
                    <MetricCard
                      title="Avg Latency Score"
                      value="78%"
                      trend={{ value: "+3%", direction: "up", label: "faster" }}
                    />
                    <MetricCard
                      title="Cost Efficiency"
                      value="85%"
                      trend={{ value: "+2%", direction: "up", label: "improved" }}
                    />
                  </div>

                  {/* Performance Trend Chart with error boundary */}
                  <ErrorBoundary>
                    <PerformanceChart data={tracingTrendData} />
                  </ErrorBoundary>
                </div>

                {/* Evaluation Visualization Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Evaluation Visualization</h2>

                  {/* Evaluation Metrics */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <MetricCard
                      title="Total Evaluations"
                      value={227}
                      trend={{ value: "+18%", direction: "up", label: "this month" }}
                    />
                    <MetricCard
                      title="Avg Accuracy"
                      value="87%"
                      trend={{ value: "+5%", direction: "up", label: "improvement" }}
                    />
                    <div className="space-y-2">
                      <MetricCard title="Human Feedback Summary" value={82} />
                      <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                        <p className="text-xs text-muted-foreground">
                          Total ratings: {totalRatings}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="text-xs">
                            <span className="text-primary font-semibold">{highRatings}</span>
                            <span className="text-muted-foreground"> high ratings</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-muted-foreground font-semibold">{lowRatings}</span>
                            <span className="text-muted-foreground"> low ratings</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Distribution Chart with error boundary */}
                  <ErrorBoundary>
                    <FeedbackChart data={feedbackDistributionData} />
                  </ErrorBoundary>
                </div>
              </div>
            </div>

            {/* Right side - Evaluation Details */}
            <div className="w-96 border-l border-border bg-muted/30 p-6 overflow-auto">
              <h2 className="text-lg font-semibold text-foreground mb-4">Evaluation Details</h2>

              <Tabs defaultValue="queue" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="queue">Queue</TabsTrigger>
                  <TabsTrigger value="good">Good</TabsTrigger>
                  <TabsTrigger value="bad">Bad</TabsTrigger>
                </TabsList>

                <TabsContent value="queue" className="space-y-3 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{queueItems.length} items pending</p>
                  </div>
                  {queueItems.map((item) => (
                    <Link
                      key={item.id}
                      href="/evaluation/feedback"
                      className="block p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs font-mono text-muted-foreground truncate">{item.traceId}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{item.createdAt}</p>
                        </div>
                        <Badge variant="secondary" className="flex-shrink-0">Pending</Badge>
                      </div>
                    </Link>
                  ))}
                </TabsContent>

                <TabsContent value="good" className="space-y-3 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{goodCases.length} good cases</p>
                  </div>
                  {goodCases.map((item) => (
                    <Link
                      key={item.id}
                      href={`/tracing/traces?traceId=${item.traceId}`}
                      className="block p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-3 w-3 text-green-600 flex-shrink-0" />
                          <span className="text-xs font-mono text-muted-foreground">{item.traceId}</span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600 flex-shrink-0">
                          {item.score}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground mb-1">{item.feedback}</p>
                      <p className="text-xs text-muted-foreground">{item.evaluatedAt}</p>
                    </Link>
                  ))}
                </TabsContent>

                <TabsContent value="bad" className="space-y-3 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">{badCases.length} bad cases</p>
                  </div>
                  {badCases.map((item) => (
                    <Link
                      key={item.id}
                      href={`/tracing/traces?traceId=${item.traceId}`}
                      className="block p-3 rounded-lg border border-border bg-card hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <ThumbsDown className="h-3 w-3 text-red-600 flex-shrink-0" />
                          <span className="text-xs font-mono text-muted-foreground">{item.traceId}</span>
                        </div>
                        <Badge variant="outline" className="text-red-600 border-red-600 flex-shrink-0">
                          {item.score}
                        </Badge>
                      </div>
                      <p className="text-xs text-foreground mb-1">{item.feedback}</p>
                      <p className="text-xs text-muted-foreground">{item.evaluatedAt}</p>
                    </Link>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
