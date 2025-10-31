"use client"

import { useParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Share2, ChevronUp, ChevronDown, MessageSquare, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"

const mockTrace = {
  id: "trace-003",
  name: "Sample agent Trace",
  status: "success",
  duration: "323s",
  cost: "$223.98",
  createdAt: "2025-09-02 21:54:06",
  steps: [
    { id: "s1", name: "ChatOpenAI", duration: "0.95s", icon: "AI" },
    { id: "s2", name: "search_latest_knowledge", duration: "0.76s", icon: "🔎" },
    { id: "s3", name: "VectorStoreRetriever", duration: "0.52s", icon: "📚" },
    { id: "s4", name: "ChatOpenAI", duration: "3.44s", icon: "AI" },
  ],
  input: "What is a document loader?",
  output:
    "BEEP BOOP! A document loader is a component that loads data from a source and returns it as a LangChain Document...",
}

export default function TraceDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id || mockTrace.id

  const trace = { ...mockTrace, id }

  const [allIds, setAllIds] = useState<string[]>([])
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  useEffect(() => {
    // derive ids from localStorage trajectories if available
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("trajectories") : null
    if (stored) {
      try {
        const list = JSON.parse(stored) as Array<{ id: string }>
        setAllIds(Array.from(new Set(list.map((t) => t.id))))
      } catch {}
    }
    if (allIds.length === 0) {
      setAllIds(["trace-001", "trace-002", "trace-003", "trace-004"]) // fallback order
    }
  }, [])

  const goRelative = (delta: number) => {
    if (allIds.length === 0) return
    const idx = allIds.findIndex((v) => v === id)
    const nextIdx = Math.min(Math.max(idx + delta, 0), allIds.length - 1)
    const nextId = allIds[nextIdx]
    if (nextId && nextId !== id) {
      window.location.href = `/tracing/traces/${nextId}`
    }
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
              <BreadcrumbLink href="/tracing/traces">Traces</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{trace.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
          <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Link href="/tracing/traces">
              <Button variant="ghost" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="text-2xl font-semibold text-foreground">Trace Detail</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => goRelative(-1)}><ChevronUp className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => goRelative(1)}><ChevronDown className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left - Waterfall */}
          <Card className="h-fit">
            <CardHeader>
              <div className="font-semibold">TRACE</div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border p-3">
                <div className="font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                  {trace.name}
                </div>
                <div className="text-xs text-muted-foreground mt-2 flex items-center gap-4">
                  <span className="text-red-400">{trace.duration}</span>
                  <span>at {trace.createdAt}</span>
                  <span className="font-medium">{trace.cost}</span>
                </div>
              </div>

              {trace.steps.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-md border p-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                      {s.icon}
                    </div>
                    <div className="text-sm">{s.name}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.duration}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right - Detail */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <div className="text-lg font-semibold">{trace.name}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsCommentsOpen(true)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-4">
                <span className="text-red-400">{trace.duration}</span>
                <span>at {trace.createdAt}</span>
                <span className="font-medium">{trace.cost}</span>
              </div>
            </CardHeader>
            <CardContent>
              {isCommentsOpen && (
                <div className="mb-4 rounded-md border">
                  <div className="flex items-center justify-between p-3 border-b">
                    <div className="text-sm font-semibold">Comments</div>
                    <Button variant="ghost" size="icon" onClick={() => setIsCommentsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-3">
                    <ScrollArea className="h-40 pr-2">
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>No comments yet.</div>
                      </div>
                    </ScrollArea>
                    <div className="pt-3">
                      <Textarea placeholder="Add a comment..." rows={3} />
                      <div className="mt-2 text-right">
                        <Button size="sm">Send</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Tabs defaultValue="run" className="w-full">
                <TabsList>
                  <TabsTrigger value="run">Run</TabsTrigger>
                  <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
                </TabsList>
                <TabsContent value="run" className="space-y-4">
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-3 border-b">
                      <div className="font-medium">Input</div>
                    </div>
                    <div className="p-3 text-sm rounded-b-md bg-muted/30">{trace.input}</div>
                  </div>
                  <div className="rounded-md border">
                    <div className="flex items-center justify-between p-3 border-b">
                      <div className="font-medium">Output</div>
                    </div>
                    <div className="p-3 text-sm rounded-b-md bg-muted/30 whitespace-pre-wrap">{trace.output}</div>
                  </div>
                </TabsContent>
                <TabsContent value="deliverables">
                  <div className="text-sm text-muted-foreground">No deliverables.</div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


