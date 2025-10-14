"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Download, Search, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react" // Import Activity component

// Mock data
const mockTraces = [
  {
    id: "trace-001",
    name: "User Query Processing",
    input: "What is the weather today?",
    output: "The weather is sunny with 72°F",
    tokens: 1250,
    latency: "1.2s",
    cost: "$0.0025",
    createdAt: "2025-01-10 14:30",
    status: "success",
  },
  {
    id: "trace-002",
    name: "Code Generation Task",
    input: "Generate a React component",
    output: "Created Button component with...",
    tokens: 3420,
    latency: "2.8s",
    cost: "$0.0068",
    createdAt: "2025-01-10 14:25",
    status: "success",
  },
  {
    id: "trace-003",
    name: "Data Analysis",
    input: "Analyze sales data for Q4",
    output: "Sales increased by 23% in Q4...",
    tokens: 2100,
    latency: "1.9s",
    cost: "$0.0042",
    createdAt: "2025-01-10 14:20",
    status: "success",
  },
  {
    id: "trace-004",
    name: "Translation Request",
    input: "Translate to Spanish",
    output: "Error: Invalid language code",
    tokens: 450,
    latency: "0.5s",
    cost: "$0.0009",
    createdAt: "2025-01-10 14:15",
    status: "error",
  },
]

export default function TracesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgent, setSelectedAgent] = useState("all")

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Execution Traces</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage all online traces and uploaded offline data
        </p>
      </div>

      {/* Toolbar */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search traces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Trace
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trace ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Output</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Latency</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTraces.map((trace) => (
                <TableRow key={trace.id}>
                  <TableCell className="font-mono text-sm">{trace.id}</TableCell>
                  <TableCell className="font-medium">{trace.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{trace.input}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{trace.output}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{trace.tokens.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{trace.latency}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{trace.cost}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trace.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={trace.status === "success" ? "default" : "destructive"}>{trace.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {/* Empty state would go here if no traces */}
        {mockTraces.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No traces yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Run an evaluation or upload offline data to get started
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Trace
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
