"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { ChevronUp, ChevronDown, Share2, X } from "lucide-react"

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

export default function EvaluationDetailPage() {
  const params = useParams<{ id: string; traceId: string }>()
  const router = useRouter()
  const queueId = params?.id
  const traceId = params?.traceId

  const [queue, setQueue] = useState<FeedbackQueue | null>(null)
  const [information, setInformation] = useState("")
  const [deliverables, setDeliverables] = useState("")
  const [comments, setComments] = useState("")

  useEffect(() => {
    const existing = typeof window !== "undefined" ? window.localStorage.getItem("feedbackQueues") : null
    const queues: FeedbackQueue[] = existing ? JSON.parse(existing) : []
    const q = queues.find((q) => q.id === queueId) || null
    setQueue(q)
    
    // Load saved data if exists
    const savedData = typeof window !== "undefined" ? window.localStorage.getItem(`eval-${queueId}-${traceId}`) : null
    if (savedData) {
      try {
        const data = JSON.parse(savedData)
        setInformation(data.information || "")
        setDeliverables(data.deliverables || "")
        setComments(data.comments || "")
      } catch {}
    }
  }, [queueId, traceId])

  const trace = useMemo(() => queue?.traces?.find((t) => t.id === traceId) || null, [queue, traceId])

  const save = () => {
    if (typeof window !== "undefined") {
      const data = { information, deliverables, comments }
      window.localStorage.setItem(`eval-${queueId}-${traceId}`, JSON.stringify(data))
    }
    // In a real app, post to API
  }

  const complete = () => {
    save()
    // In a real app, persist completion and update queue status
    router.back()
  }

  const handlePrevious = () => {
    // Navigate to previous trace in the queue
    const traces = queue?.traces || []
    const currentIndex = traces.findIndex((t) => t.id === traceId)
    if (currentIndex > 0) {
      router.push(`/evaluation/feedback/queue/${queueId}/${traces[currentIndex - 1].id}`)
    }
  }

  const handleNext = () => {
    // Navigate to next trace in the queue
    const traces = queue?.traces || []
    const currentIndex = traces.findIndex((t) => t.id === traceId)
    if (currentIndex < traces.length - 1) {
      router.push(`/evaluation/feedback/queue/${queueId}/${traces[currentIndex + 1].id}`)
    }
  }

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
              <BreadcrumbLink href={`/evaluation/feedback/queue/${queueId}`}>{queue?.name || "Queue"}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{trace?.evalId || traceId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-2xl font-semibold text-foreground">Evaluation detail</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={save}>
              Save
            </Button>
            <Button onClick={complete} className="bg-black text-white hover:bg-black/90">
              Complete
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrevious}>
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNext}>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <label className="text-sm font-medium mb-2 block">information</label>
              <Textarea
                rows={12}
                placeholder="Enter information..."
                value={information}
                onChange={(e) => setInformation(e.target.value)}
                className="resize-none"
              />
            </Card>
            <Card className="p-6">
              <label className="text-sm font-medium mb-2 block">Deliverables</label>
              <Textarea
                rows={12}
                placeholder="Enter deliverables..."
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                className="resize-none"
              />
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <label className="text-sm font-medium mb-2 block">Comments</label>
              <Textarea
                rows={20}
                placeholder="Enter comments..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="resize-none"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
