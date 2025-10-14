"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, DollarSign, Zap, Code } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data for trajectory
const trajectorySteps = [
  {
    id: 1,
    type: "model_call",
    name: "Initial Query Processing",
    model: "gpt-4",
    tokens: 450,
    latency: 320,
    cost: 0.0009,
    timestamp: "14:30:01.234",
  },
  {
    id: 2,
    type: "tool_call",
    name: "Web Search",
    tool: "search_api",
    tokens: 0,
    latency: 850,
    cost: 0.0001,
    timestamp: "14:30:01.554",
  },
  {
    id: 3,
    type: "model_call",
    name: "Result Synthesis",
    model: "gpt-4",
    tokens: 800,
    latency: 580,
    cost: 0.0016,
    timestamp: "14:30:02.404",
  },
  {
    id: 4,
    type: "tool_call",
    name: "Format Output",
    tool: "formatter",
    tokens: 0,
    latency: 45,
    cost: 0,
    timestamp: "14:30:02.984",
  },
]

const tokenUsageData = [
  { step: "Query", input: 120, output: 330 },
  { step: "Search", input: 0, output: 0 },
  { step: "Synthesis", input: 250, output: 550 },
  { step: "Format", input: 0, output: 0 },
]

const latencyCostData = [
  { name: "Query", latency: 320, cost: 0.9 },
  { name: "Search", latency: 850, cost: 0.1 },
  { name: "Synthesis", latency: 580, cost: 1.6 },
  { name: "Format", latency: 45, cost: 0 },
]

export default function TrajectoryPage() {
  const [selectedTrace, setSelectedTrace] = useState("trace-001")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Trajectory View</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Visualize execution flow, tool usage, and performance metrics
            </p>
          </div>
          <Select value={selectedTrace} onValueChange={setSelectedTrace}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select trace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trace-001">trace-001</SelectItem>
              <SelectItem value="trace-002">trace-002</SelectItem>
              <SelectItem value="trace-003">trace-003</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,250</div>
                <p className="text-xs text-muted-foreground">450 input / 800 output</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Latency</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.79s</div>
                <p className="text-xs text-muted-foreground">4 steps executed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$0.0026</div>
                <p className="text-xs text-muted-foreground">Model + tools</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">GPT-4</div>
                <p className="text-xs text-muted-foreground">2 model calls</p>
              </CardContent>
            </Card>
          </div>

          {/* Trajectory Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Execution Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trajectorySteps.map((step, index) => (
                  <div key={step.id}>
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            step.type === "model_call" ? "bg-primary/20 text-primary" : "bg-chart-2/20 text-chart-2"
                          }`}
                        >
                          {step.type === "model_call" ? <Code className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                        </div>
                        {index < trajectorySteps.length - 1 && <div className="h-12 w-0.5 bg-border mt-2" />}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{step.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {step.type === "model_call" ? step.model : step.tool}
                            </p>
                          </div>
                          <Badge variant="outline">{step.timestamp}</Badge>
                        </div>
                        <div className="flex gap-6 text-sm">
                          {step.tokens > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Zap className="h-3 w-3" />
                              <span>{step.tokens} tokens</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{step.latency}ms</span>
                          </div>
                          {step.cost > 0 && (
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <DollarSign className="h-3 w-3" />
                              <span>${step.cost.toFixed(4)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs for detailed views */}
          <Tabs defaultValue="visualization" className="w-full">
            <TabsList>
              <TabsTrigger value="visualization">Visualization</TabsTrigger>
              <TabsTrigger value="tokens">Token Usage</TabsTrigger>
              <TabsTrigger value="raw">Raw Log</TabsTrigger>
            </TabsList>
            <TabsContent value="visualization" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Latency Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={latencyCostData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar dataKey="latency" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Cost Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={latencyCostData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "var(--radius)",
                          }}
                        />
                        <Bar dataKey="cost" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="tokens">
              <Card>
                <CardHeader>
                  <CardTitle>Token Usage by Step</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={tokenUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="step" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "var(--radius)",
                        }}
                      />
                      <Bar dataKey="input" stackId="a" fill="hsl(var(--chart-3))" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="output" stackId="a" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="raw">
              <Card>
                <CardHeader>
                  <CardTitle>Raw Execution Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-xs font-mono">
                    {JSON.stringify(
                      {
                        trace_id: "trace-001",
                        name: "User Query Processing",
                        input: "What is the weather today?",
                        output: "The weather is sunny with 72°F",
                        steps: trajectorySteps,
                        total_tokens: 1250,
                        total_latency_ms: 1795,
                        total_cost: 0.0026,
                      },
                      null,
                      2,
                    )}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
