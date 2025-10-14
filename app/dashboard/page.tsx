"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts"

const scoresTrendData = [
  { date: "Jan 5", accuracy: 0.82, latency: 0.75, cost: 0.88 },
  { date: "Jan 6", accuracy: 0.84, latency: 0.77, cost: 0.86 },
  { date: "Jan 7", accuracy: 0.85, latency: 0.76, cost: 0.87 },
  { date: "Jan 8", accuracy: 0.86, latency: 0.78, cost: 0.85 },
  { date: "Jan 9", accuracy: 0.87, latency: 0.79, cost: 0.86 },
  { date: "Jan 10", accuracy: 0.89, latency: 0.8, cost: 0.84 },
]

const radarData = [
  { metric: "Accuracy", value: 87 },
  { metric: "Latency", value: 78 },
  { metric: "Cost Efficiency", value: 85 },
  { metric: "Reliability", value: 92 },
  { metric: "Coherence", value: 88 },
]

// Sophia versions comparison (mock data)
const sophiaVersionsData = [
  { version: "Sophia v1", accuracy: 0.84, latencyScore: 0.76, costEfficiency: 0.82 },
  { version: "Sophia v2", accuracy: 0.88, latencyScore: 0.79, costEfficiency: 0.85 },
  { version: "Sophia v3", accuracy: 0.91, latencyScore: 0.81, costEfficiency: 0.87 },
]

// Agent vs Scenario heatmap (mock data 0-100)
const agents = ["Sophia v1", "Sophia v2", "Sophia v3"]
const scenarios = [
  "Web QA",
  "Data Cleanup",
  "Email Draft",
  "Code Review",
  "Research Brief",
]
const agentScenarioScores: Record<string, Record<string, number>> = {
  "Sophia v1": { "Web QA": 72, "Data Cleanup": 65, "Email Draft": 78, "Code Review": 69, "Research Brief": 74 },
  "Sophia v2": { "Web QA": 80, "Data Cleanup": 74, "Email Draft": 83, "Code Review": 76, "Research Brief": 81 },
  "Sophia v3": { "Web QA": 86, "Data Cleanup": 79, "Email Draft": 88, "Code Review": 83, "Research Brief": 87 },
}

// Heatmap palette based on suggested colors: low=#393028, high=#ffe0c2
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (v: number) => v.toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function interpolateColor(a: string, b: string, t: number): string {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const r = Math.round(ca.r + (cb.r - ca.r) * t)
  const g = Math.round(ca.g + (cb.g - ca.g) * t)
  const bch = Math.round(ca.b + (cb.b - ca.b) * t)
  return rgbToHex(r, g, bch)
}

function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const srgb = [r, g, b].map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

function valueToHeatColor(value: number): { bg: string; text: string } {
  const v = Math.max(0, Math.min(100, value))
  const low = '#393028'
  const high = '#ffe0c2'
  const t = v / 100
  const bg = interpolateColor(low, high, t)
  const text = luminance(bg) > 0.6 ? '#111827' : '#ffffff'
  return { bg, text }
}

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Key evaluation metrics and trends</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Summary Cards (moved to top) */}
          <div className="grid gap-4 md:grid-cols-4">
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
                  <TrendingDown className="h-3 w-3 text-red-500" />
                  <span className="text-red-500">-2%</span> vs target
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sophia versions comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Sophia Versions Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={sophiaVersionsData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="version" className="text-xs" />
                  <YAxis domain={[0.6, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} className="text-xs" />
                  <Tooltip
                    formatter={(v: number) => `${Math.round(v * 100)}%`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar
                    dataKey="accuracy"
                    name="Accuracy"
                    fill="hsl(220 12% 92%)"
                    stroke="hsl(220 12% 80%)"
                    strokeOpacity={0.8}
                    radius={[4,4,0,0]}
                  />
                  <Bar
                    dataKey="latencyScore"
                    name="Latency Score"
                    fill="hsl(260 14% 90%)"
                    stroke="hsl(260 14% 78%)"
                    strokeOpacity={0.8}
                    radius={[4,4,0,0]}
                  />
                  <Bar
                    dataKey="costEfficiency"
                    name="Cost Efficiency"
                    fill="hsl(28 30% 88%)"
                    stroke="hsl(28 30% 76%)"
                    strokeOpacity={0.8}
                    radius={[4,4,0,0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent x Scenario heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Agent × Scenario Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto">
                <div className="min-w-[640px]">
                  <div className="grid" style={{ gridTemplateColumns: `160px repeat(${scenarios.length}, minmax(100px, 1fr))` }}>
                    {/* Header row */}
                    <div className="p-2 text-sm font-medium text-muted-foreground">Agent / Scenario</div>
                    {scenarios.map((s) => (
                      <div key={s} className="p-2 text-xs font-medium text-muted-foreground text-center">{s}</div>
                    ))}
                    {/* Rows */}
                    {agents.map((agent) => (
                      <>
                        <div key={`${agent}-label`} className="p-2 text-sm font-medium">{agent}</div>
                        {scenarios.map((s) => {
                          const v = agentScenarioScores[agent][s]
                          const c = valueToHeatColor(v)
                          return (
                            <div
                              key={`${agent}-${s}`}
                              className="p-2 text-center text-xs"
                              style={{ backgroundColor: c.bg, color: c.text }}
                            >
                              {v}%
                            </div>
                          )
                        })}
                      </>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={scoresTrendData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis domain={[0.7, 1]} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Line type="monotone" dataKey="accuracy" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="latency" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="cost" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance Radar</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis dataKey="metric" className="text-xs" />
                    <PolarRadiusAxis domain={[0, 100]} className="text-xs" />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


