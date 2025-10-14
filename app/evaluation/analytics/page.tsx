"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Eye } from "lucide-react"

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

// KPIs and charts moved to Dashboard

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
