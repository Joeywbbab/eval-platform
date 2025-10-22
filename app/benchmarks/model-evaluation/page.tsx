"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageSquare, Users, Trophy } from "lucide-react"
import {
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts"

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

export default function ModelEvaluationPage() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])

  // Filter logic
  const filteredAgents = selectedAgents.length > 0 ? selectedAgents : agents
  const filteredScenarios = selectedScenarios.length > 0 ? selectedScenarios : scenarios

  const handleClearAll = () => {
    setSelectedAgents([])
    setSelectedScenarios([])
  }

  const handleAgentChange = (value: string) => {
    if (value === "all") {
      setSelectedAgents([])
    } else {
      setSelectedAgents([value])
    }
  }

  const handleScenarioChange = (value: string) => {
    if (value === "all") {
      setSelectedScenarios([])
    } else {
      setSelectedScenarios([value])
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Model Evaluation</h1>
        <p className="text-sm text-muted-foreground mt-1">Compare model versions and analyze performance across scenarios</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Sophia versions comparison section with metrics */}
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Metrics Cards */}
            <div className="flex flex-col gap-4">
              <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Query 数量</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-muted-foreground mt-1">Total queries evaluated</p>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agent 数量</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Active agent versions</p>
                </CardContent>
              </Card>

              <Card className="flex-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sophia v3 排名</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">#1</div>
                    <Badge variant="secondary" className="text-xs">Top Performer</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Best overall performance</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
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
          </div>

          {/* Agent x Scenario heatmap */}
          <Card>
            <CardHeader>
              <CardTitle>Agent × Scenario Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Agent:</label>
                  <Select
                    value={selectedAgents.length === 0 ? "all" : selectedAgents[0]}
                    onValueChange={handleAgentChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Agents" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent} value={agent}>
                          {agent}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-muted-foreground">Scenario:</label>
                  <Select
                    value={selectedScenarios.length === 0 ? "all" : selectedScenarios[0]}
                    onValueChange={handleScenarioChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Scenarios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Scenarios</SelectItem>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario} value={scenario}>
                          {scenario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  disabled={selectedAgents.length === 0 && selectedScenarios.length === 0}
                >
                  Clear All
                </Button>
              </div>

              {/* Heatmap */}
              <div className="overflow-auto">
                <div className="min-w-[640px]">
                  <div className="grid" style={{ gridTemplateColumns: `160px repeat(${filteredScenarios.length}, minmax(100px, 1fr))` }}>
                    {/* Header row */}
                    <div className="p-2 text-sm font-medium text-muted-foreground">Agent / Scenario</div>
                    {filteredScenarios.map((s) => (
                      <div key={s} className="p-2 text-xs font-medium text-muted-foreground text-center">{s}</div>
                    ))}
                    {/* Rows */}
                    {filteredAgents.map((agent) => (
                      <>
                        <div key={`${agent}-label`} className="p-2 text-sm font-medium">{agent}</div>
                        {filteredScenarios.map((s) => {
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
        </div>
      </div>
    </div>
  )
}
