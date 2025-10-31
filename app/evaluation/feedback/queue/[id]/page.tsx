"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Move } from "lucide-react"

type FeedbackQueue = {
  id: string
  name: string
  completedItems: number
  pendingItems: number
  createdAt: string
  assignedTo: string
  status: "finish" | "process"
  traces?: Array<{
    id: string
    name: string
    feedback?: string
    deliverables?: string
    createdAt?: string
    evalId?: string
  }>
}

export default function QueuePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const queueId = params?.id
  const [queue, setQueue] = useState<FeedbackQueue | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")
  const [visible, setVisible] = useState({
    evalId: true,
    feedback: true,
    deliverables: true,
    traceId: true,
    createdAt: true,
    process: true,
    input: false,
    output: false,
  })

  useEffect(() => {
    const existing = typeof window !== "undefined" ? window.localStorage.getItem("feedbackQueues") : null
    const queues: FeedbackQueue[] = existing ? JSON.parse(existing) : []
    const q = queues.find((q) => q.id === queueId) || null
    setQueue(q)
  }, [queueId])

  const allSelected = useMemo(() => {
    const ids = queue?.traces?.map((t) => t.id) || []
    return ids.length > 0 && ids.every((id) => selected.includes(id))
  }, [queue, selected])

  const toggleAll = () => {
    const ids = queue?.traces?.map((t) => t.id) || []
    if (ids.length === 0) return
    if (allSelected) setSelected((prev) => prev.filter((id) => !ids.includes(id)))
    else setSelected((prev) => Array.from(new Set([...(prev || []), ...ids])))
  }

  const toggleRow = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return queue?.traces || []
    return (queue?.traces || []).filter((t) =>
      [
        t.id,
        t.name,
        t.feedback,
        t.deliverables,
        t.evalId,
        t.createdAt,
      ].some((v) => (v || "").toLowerCase().includes(q)),
    )
  }, [queue, search])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/evaluation">Evaluation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/evaluation/feedback">Human Feedback</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{queue?.name || "Queue"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-semibold text-foreground">{queue?.name || "Feedback Queue"}</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New eval
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Input placeholder="Add filter" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Move className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">Columns</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[
                      { key: "evalId", label: "Eval ID" },
                      { key: "feedback", label: "Feedback" },
                      { key: "deliverables", label: "Deliverables" },
                      { key: "traceId", label: "Trace ID" },
                      { key: "createdAt", label: "Created At" },
                      { key: "process", label: "Process" },
                      { key: "input", label: "Input" },
                      { key: "output", label: "Output" },
                    ].map((c) => (
                      <DropdownMenuCheckboxItem
                        key={c.key}
                        checked={(visible as any)[c.key]}
                        onCheckedChange={(v) => setVisible((prev) => ({ ...prev, [c.key]: Boolean(v) }))}
                      >
                        {c.label}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox checked={allSelected} onCheckedChange={toggleAll} aria-label="Select all" />
                </TableHead>
                {visible.evalId && <TableHead>EVAL ID</TableHead>}
                {visible.feedback && <TableHead>FEEDBACK</TableHead>}
                {visible.deliverables && <TableHead>DELIVERABLES</TableHead>}
                {visible.traceId && <TableHead>TRACE ID</TableHead>}
                {visible.createdAt && <TableHead>CREATEDAT</TableHead>}
                {visible.input && <TableHead>INPUT</TableHead>}
                {visible.output && <TableHead>OUTPUT</TableHead>}
                {visible.process && <TableHead className="text-right">PROCESS</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>
                    <Checkbox checked={selected.includes(t.id)} onCheckedChange={() => toggleRow(t.id)} />
                  </TableCell>
                  {visible.evalId && (
                    <TableCell className="font-mono text-sm">{t.evalId || `Eval ${t.id.slice(-3)}`}</TableCell>
                  )}
                  {visible.feedback && (
                    <TableCell className="max-w-[260px] truncate text-muted-foreground">{t.name || t.feedback}</TableCell>
                  )}
                  {visible.deliverables && (
                    <TableCell className="max-w-[220px] truncate text-muted-foreground">{t.deliverables || "-"}</TableCell>
                  )}
                  {visible.traceId && <TableCell className="font-mono text-sm">{t.id}</TableCell>}
                  {visible.createdAt && (
                    <TableCell className="text-sm text-muted-foreground">{t.createdAt || "-"}</TableCell>
                  )}
                  {visible.input && (
                    <TableCell className="max-w-[220px] truncate text-muted-foreground">-</TableCell>
                  )}
                  {visible.output && (
                    <TableCell className="max-w-[220px] truncate text-muted-foreground">-</TableCell>
                  )}
                  {visible.process && (
                    <TableCell className="text-right">
                      <Link href={`/evaluation/feedback/queue/${queueId}/${t.id}`}>
                        <Button size="sm" variant="default" className="bg-black text-white hover:bg-black/90">
                          Process eval
                        </Button>
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  )
}


