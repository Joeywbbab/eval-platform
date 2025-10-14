"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Eye, TrendingUp, TrendingDown } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

// Mock data
const evaluationReports = [
  {
    id: "eval-001",
    source: "Auto-generated",
    type: "Accuracy Test",
    created: "2025-01-10 14:00",
    avgScore: 0.87,
    status: "completed",
    dataset: "QA-Benchmark-v2",
  },
  {
    id: "eval-002",
    source: "Uploaded",
    type: "Human Eval",
    created: "2025-01-10 12:30",
    avgScore: 0.92,
    status: "completed",
    dataset: "Custom-Dataset",
  },
  {
    id: "eval-003",
    source: "Auto-generated",
    type: "Latency Test",
    created: "2025-01-10 10:15",
    avgScore: 0.78,
    status: "completed",
    dataset: "Performance-Suite",
  },
  {
    id: "eval-004",
    source: "Uploaded",
    type: "Cost Analysis",
    created: "2025-01-09 16:45",
    avgScore: 0.85,
    status: "completed",
    dataset: "Cost-Benchmark",
  },
]

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

export default function AnalyticsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Evaluation Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and analyze evaluation reports from uploaded and auto-generated sources
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
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

          {/* Reports Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Evaluation Reports</CardTitle>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Report
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Eval ID</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Dataset</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Avg Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">{report.id}</TableCell>
                      <TableCell>
                        <Badge variant={report.source === "Auto-generated" ? "default" : "secondary"}>
                          {report.source}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{report.type}</TableCell>
                      <TableCell className="text-muted-foreground">{report.dataset}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{report.created}</TableCell>
                      <TableCell className="text-right">
                        <span className="font-semibold">{(report.avgScore * 100).toFixed(0)}%</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedReport(report.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
