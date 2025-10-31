"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Upload, Search, Eye, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react" // Import Activity component
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

// Mock data
const mockTraces = [
  {
    id: "trace-001",
    name: "User Query Processing",
    input: "What is the weather today?",
    output: "The weather is sunny with 72°F",
    deliverables: "Weather summary",
    categoryL1: "qa",
    categoryL2: "weather",
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
    deliverables: "React Button component",
    categoryL1: "code-generation",
    categoryL2: "react",
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
    deliverables: "Q4 sales analysis",
    categoryL1: "reasoning",
    categoryL2: "analytics",
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
    deliverables: "Spanish translation",
    categoryL1: "translation",
    categoryL2: "es",
    tokens: 450,
    latency: "0.5s",
    cost: "$0.0009",
    createdAt: "2025-01-10 14:15",
    status: "error",
  },
]

export default function TracesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryL1, setSelectedCategoryL1] = useState("all")
  const [selectedCategoryL2, setSelectedCategoryL2] = useState("all")
  const [selectedTraceIds, setSelectedTraceIds] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [assignee, setAssignee] = useState("")
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false)

  const categoryOptionsL1 = useMemo(() => {
    const set = new Set<string>()
    for (const t of mockTraces) {
      if (t.categoryL1) set.add(t.categoryL1)
    }
    return ["all", ...Array.from(set)]
  }, [])

  const categoryMap = useMemo(() => {
    const map = new Map<string, Set<string>>()
    for (const t of mockTraces) {
      const l1 = t.categoryL1 || ""
      const l2 = t.categoryL2 || ""
      if (!map.has(l1)) map.set(l1, new Set<string>())
      if (l2) map.get(l1)!.add(l2)
    }
    return map
  }, [])

  const categoryOptionsL2 = useMemo(() => {
    if (selectedCategoryL1 === "all") return ["all"]
    const set = new Set<string>()
    for (const t of mockTraces) {
      if (t.categoryL1 === selectedCategoryL1 && t.categoryL2) set.add(t.categoryL2)
    }
    return ["all", ...Array.from(set)]
  }, [selectedCategoryL1])

  const filteredTraces = useMemo(() => {
    return mockTraces.filter((t) => {
      const matchCategoryL1 = selectedCategoryL1 === "all" || t.categoryL1 === selectedCategoryL1
      const matchCategoryL2 = selectedCategoryL2 === "all" || t.categoryL2 === selectedCategoryL2
      const q = searchQuery.trim().toLowerCase()
      const matchQuery =
        q === "" ||
        t.id.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.input.toLowerCase().includes(q) ||
        t.output.toLowerCase().includes(q) ||
        (t.deliverables?.toLowerCase().includes(q) ?? false) ||
        (t.categoryL1?.toLowerCase().includes(q) ?? false) ||
        (t.categoryL2?.toLowerCase().includes(q) ?? false)
      return matchCategoryL1 && matchCategoryL2 && matchQuery
    })
  }, [selectedCategoryL1, selectedCategoryL2, searchQuery])

  const allVisibleSelected = filteredTraces.length > 0 && filteredTraces.every((t) => selectedTraceIds.includes(t.id))

  const toggleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedTraceIds((prev) => prev.filter((id) => !filteredTraces.some((t) => t.id === id)))
    } else {
      const visibleIds = filteredTraces.map((t) => t.id)
      setSelectedTraceIds((prev) => Array.from(new Set([...prev, ...visibleIds])))
    }
  }

  const toggleRow = (id: string) => {
    setSelectedTraceIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const handleAddToQueue = () => {
    if (selectedTraceIds.length === 0) return
    setIsDialogOpen(true)
  }

  const handleConfirmAdd = () => {
    const existing = typeof window !== "undefined" ? window.localStorage.getItem("feedbackQueue") : null
    const queue = existing ? JSON.parse(existing) : []
    const tracesSnapshot = mockTraces
      .filter((t) => selectedTraceIds.includes(t.id))
      .map((t) => ({
        id: t.id,
        name: t.name,
        input: t.input,
        output: t.output,
        deliverables: t.deliverables,
        categoryL1: t.categoryL1,
        categoryL2: t.categoryL2,
        createdAt: t.createdAt,
      }))
    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName || `Group ${new Date().toLocaleString()}`,
      assignee: assignee || "unassigned",
      traceIds: selectedTraceIds,
      traces: tracesSnapshot,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
    try {
      window.localStorage.setItem("feedbackQueue", JSON.stringify([newGroup, ...queue]))
    } catch {}
    setIsDialogOpen(false)
    setGroupName("")
    setAssignee("")
    setSelectedTraceIds([])
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/tracing/traces">Tracing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Traces</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-foreground mt-4">Execution Traces</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage all online traces and uploaded offline data</p>
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
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[340px] justify-between">
                  {selectedCategoryL1 === "all"
                    ? "All Categories"
                    : selectedCategoryL2 === "all"
                    ? `${selectedCategoryL1} / All`
                    : `${selectedCategoryL1} / ${selectedCategoryL2}`}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[340px]">
                <DropdownMenuItem onClick={() => { setSelectedCategoryL1("all"); setSelectedCategoryL2("all") }}>All Categories</DropdownMenuItem>
                <DropdownMenuSeparator />
                {Array.from(categoryMap.entries()).map(([l1, subs]) => (
                  <DropdownMenuSub key={l1}>
                    <DropdownMenuSubTrigger>{l1}</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => { setSelectedCategoryL1(l1); setSelectedCategoryL2("all") }}>All of {l1}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {Array.from(subs.values()).map((l2) => (
                        <DropdownMenuItem key={`${l1}-${l2}`} onClick={() => { setSelectedCategoryL1(l1); setSelectedCategoryL2(l2) }}>{l2}</DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="ml-auto flex gap-2">
            <Button variant="default" size="sm" onClick={handleAddToQueue} disabled={selectedTraceIds.length === 0}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Feedback Queue
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
                <TableHead className="w-8">
                  <Checkbox checked={allVisibleSelected} onCheckedChange={toggleSelectAllVisible} aria-label="Select all" />
                </TableHead>
                <TableHead>Trace ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Output</TableHead>
              <TableHead>Deliverables</TableHead>
              <TableHead>Category L1</TableHead>
              <TableHead>Category L2</TableHead>
                <TableHead className="text-right">Tokens</TableHead>
                <TableHead className="text-right">Latency</TableHead>
                <TableHead className="text-right">Cost</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTraces.map((trace) => (
                <TableRow key={trace.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedTraceIds.includes(trace.id)}
                      onCheckedChange={() => toggleRow(trace.id)}
                      aria-label={`Select ${trace.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm">{trace.id}</TableCell>
                  <TableCell className="font-medium">{trace.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{trace.input}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{trace.output}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{trace.deliverables}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-muted-foreground">{trace.categoryL1}</TableCell>
                  <TableCell className="max-w-[160px] truncate text-muted-foreground">{trace.categoryL2}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{trace.tokens.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{trace.latency}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{trace.cost}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{trace.createdAt}</TableCell>
                  <TableCell>
                    <Badge variant={trace.status === "success" ? "default" : "destructive"}>{trace.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/tracing/traces/${trace.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
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
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Feedback Queue</DialogTitle>
            <DialogDescription>
              Group {selectedTraceIds.length} selected {selectedTraceIds.length === 1 ? 'trace' : 'traces'} for review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Group Name</label>
              <Input placeholder="e.g., Q4 Review Batch" value={groupName} onChange={(e) => setGroupName(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Assign To</label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="alice">Alice</SelectItem>
                  <SelectItem value="bob">Bob</SelectItem>
                  <SelectItem value="charlie">Charlie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmAdd} disabled={selectedTraceIds.length === 0}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
