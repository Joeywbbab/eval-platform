"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Share2, Search, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"

type TrajectoryItem = { id: string; name: string; source: "online" | "offline"; createdAt: string }

// Mock online traces for search
const mockOnlineTraces = [
  { id: "trace-001", name: "User Query Processing", input: "What is the weather today?", createdAt: "2025-01-10 14:30" },
  { id: "trace-003", name: "Data Analysis", input: "Analyze sales data for Q4", createdAt: "2025-01-10 14:20" },
  { id: "trace-005", name: "Content Generation", input: "Generate blog post about AI", createdAt: "2025-01-10 13:45" },
  { id: "trace-006", name: "Customer Support", input: "Help customer with refund request", createdAt: "2025-01-10 13:30" },
]

export default function TrajectoryPage() {
  const router = useRouter()
  const [items, setItems] = useState<TrajectoryItem[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

  const loadingSteps = ["查找 trace", "添加到加载队列", "加载轨迹数据", "准备视图"]

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("trajectories") : null
    const list: TrajectoryItem[] = stored
      ? JSON.parse(stored)
      : [
          { id: "trace-001", name: "User Query Processing", source: "online", createdAt: "2025-01-10" },
          { id: "trace-002", name: "Code Generation", source: "offline", createdAt: "2025-01-09" },
        ]
    setItems(list)
  }, [])

  const rows = useMemo(() => items, [items])

  const handleSelectTrace = (traceId: string) => {
    setIsSearchOpen(false)
    setIsLoading(true)
    setLoadingStep(0)

    const run = (step: number) => {
      setLoadingStep(step)
      if (step < loadingSteps.length - 1) {
        setTimeout(() => run(step + 1), 500)
      } else {
        setTimeout(() => {
          setIsLoading(false)
          router.push(`/tracing/trajectory/${traceId}`)
        }, 500)
      }
    }
    run(0)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/tracing/traces">Tracing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Trajectory</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-semibold text-foreground">Trajectory</h1>
          <div className="flex items-center gap-2">
            <div className="relative w-[420px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                readOnly
                placeholder="search and add online traces"
                className="pl-9"
                onFocus={() => setIsSearchOpen(true)}
                onClick={() => setIsSearchOpen(true)}
              />
            </div>
            <Button variant="outline" size="icon" title="Upload traces">
              <Upload className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} title="搜索 Online Traces">
        <CommandInput placeholder="搜索 trace ID、任务名称或输入内容..." />
        <CommandList>
          <CommandEmpty>未找到匹配的 online traces</CommandEmpty>
          <CommandGroup heading="Online Traces">
            {mockOnlineTraces.map((trace) => (
              <CommandItem
                key={trace.id}
                value={`${trace.id} ${trace.name} ${trace.input}`}
                onSelect={() => handleSelectTrace(trace.id)}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">{trace.id}</span>
                    <Badge variant="default">online</Badge>
                  </div>
                  <span className="text-sm font-medium">{trace.name}</span>
                  <span className="text-xs text-muted-foreground line-clamp-1">{trace.input}</span>
                  <span className="text-xs text-muted-foreground">{trace.createdAt}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
      <Dialog open={isLoading}>
        <DialogContent showCloseButton={false} className="max-w-sm">
          <DialogHeader className="sr-only">
            <DialogTitle>正在加载轨迹</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Spinner className="h-5 w-5" />
            <div className="text-sm font-medium">正在加载轨迹...</div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">
            {loadingSteps[loadingStep]}
          </div>
          <Progress value={((loadingStep + 1) / loadingSteps.length) * 100} />
        </DialogContent>
      </Dialog>
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Trace ID</TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>CreatedAt</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-mono text-sm">{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>
                    <Badge variant={t.source === "online" ? "default" : "secondary"}>{t.source}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.createdAt}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/tracing/trajectory/${t.id}`}>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}
