"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock, ThumbsUp, ThumbsDown } from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts"

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
  return (
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
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Traces</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+12%</span> from last week
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Latency Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+3%</span> faster
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85%</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+2%</span> improved
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Performance Trend Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <LineChart data={tracingTrendData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="date" className="text-xs" />
                        <YAxis domain={[0.7, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} className="text-xs" />
                        <Tooltip
                          formatter={(v: number) => `${Math.round(v * 100)}%`}
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="latency"
                          name="Latency Score"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          name="Cost Efficiency"
                          stroke="hsl(var(--chart-2))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Evaluation Visualization Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">Evaluation Visualization</h2>

                {/* Evaluation Metrics */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">227</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+18%</span> this month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Avg Accuracy</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">87%</div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-green-500">+5%</span> improvement
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Human Feedback Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">82</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Total ratings: {feedbackDistributionData.reduce((sum, item) => sum + item.count, 0)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="text-xs">
                          <span className="text-primary font-semibold">
                            {feedbackDistributionData[4].count + feedbackDistributionData[3].count}
                          </span>
                          <span className="text-muted-foreground"> high ratings</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-muted-foreground font-semibold">
                            {feedbackDistributionData[0].count + feedbackDistributionData[1].count}
                          </span>
                          <span className="text-muted-foreground"> low ratings</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Feedback Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={feedbackDistributionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="rating" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
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
  )
}


