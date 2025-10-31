"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Clock, MessageSquare, Send, CheckCircle2, Circle, Share2, X } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type TimelineStep = {
  id: number
  timestamp: string
  status: "completed" | "processing" | "pending"
  description: string
  score?: number
  maxScore?: number
}

type EvaluationResult = {
  criteria: string
  score: number
  maxScore: number
}

type Insight = {
  type: "strength" | "improvement"
  text: string
}

type Comment = {
  id: string
  author: string
  content: string
  createdAt: string
}

const mockTask = {
  id: "trace-001",
  title: "Task 12: Wegic Campaign Brief Translation",
  description: "Translate marketing brief from English to Spanish with brand messaging preservation",
  status: "Completed",
  timeline: [
    { id: 1, timestamp: "2025-07-31 06:52:43", status: "completed" as const, description: "Agent received translation task with evaluation criteria." },
    { id: 2, timestamp: "", status: "processing" as const, description: "Analyzed source document structure and content requirements." },
    { id: 3, timestamp: "", status: "completed" as const, description: "Translated all 7 sections maintaining format consistency." },
    { id: 4, timestamp: "", status: "completed" as const, description: "Evaluation completed with detailed criteria analysis.", score: 4.2, maxScore: 5.0 },
  ] as TimelineStep[],
  evaluationResults: [
    { criteria: "Brand Messaging", score: 0.8, maxScore: 1.5 },
    { criteria: "Local Terminology", score: 1.0, maxScore: 1.0 },
    { criteria: "Format Consistency", score: 0.5, maxScore: 0.5 },
    { criteria: "Technical Accuracy", score: 0.9, maxScore: 1.0 },
    { criteria: "Completeness", score: 1.0, maxScore: 1.0 },
  ] as EvaluationResult[],
  insights: {
    strengths: [{ type: "strength" as const, text: "Perfect structural preservation (7/7 sections)" }],
    improvements: [{ type: "improvement" as const, text: "AI feature emphasis reduced (29→8 mentions)" }],
  },
}

export default function TrajectoryView({ traceId }: { traceId: string }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([
    { id: "c1", author: "John Doe", content: "Great work on maintaining brand messaging consistency!", createdAt: "2025-01-10 15:30" },
    { id: "c2", author: "Jane Smith", content: "Consider adjusting terminology for better localization.", createdAt: "2025-01-10 16:00" },
  ])
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    // Load comments from localStorage for this traceId
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(`trajectory-comments-${traceId}`) : null
    if (stored) {
      try {
        setComments(JSON.parse(stored))
      } catch {}
    }
  }, [traceId])

  const handleAddComment = () => {
    if (!newComment.trim()) return
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "Current User",
      content: newComment,
      createdAt: new Date().toLocaleString(),
    }
    const updated = [...comments, comment]
    setComments(updated)
    setNewComment("")
    // Persist to localStorage
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(`trajectory-comments-${traceId}`, JSON.stringify(updated))
      } catch {}
    }
  }

  return (
    <div className="flex h-full flex-col relative">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/tracing/traces">Tracing</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/tracing/trajectory">Trajectory</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{traceId}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Trajectory view</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsCommentsOpen(!isCommentsOpen)}>
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 overflow-auto p-6">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{mockTask.title}</h2>
                  <p className="text-sm text-muted-foreground">{mockTask.description}</p>
                </div>
                <Badge variant="outline">{mockTask.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Execution Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Execution Timeline</h3>
                  <div className="space-y-4">
                    {mockTask.timeline.map((step, index) => (
                      <div key={step.id} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          {step.status === "completed" ? (
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step.score ? "bg-green-500/20 text-green-600" : "bg-primary/20 text-primary"}`}>
                              {step.score ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4 fill-current" />}
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-yellow-500/20 text-yellow-600">
                              <Clock className="h-4 w-4" />
                            </div>
                          )}
                          {index < mockTask.timeline.length - 1 && <div className="h-10 w-0.5 bg-border mt-2" />}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-3 mb-1">
                            {step.timestamp && <span className="text-sm font-mono text-muted-foreground">{step.timestamp}</span>}
                            {step.status === "processing" && <Badge variant="outline">Processing</Badge>}
                            {step.status === "completed" && !step.score && <Badge variant="default">Completed</Badge>}
                            {step.score && <Badge variant="default" className="bg-green-600">Score: {step.score}/{step.maxScore}</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Evaluation Results */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Evaluation Results</h3>
                  <div className="space-y-3">
                    {mockTask.evaluationResults.map((result) => {
                      const isPerfect = result.score === result.maxScore
                      return (
                        <div key={result.criteria} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{result.criteria}</span>
                          <span className={`text-sm font-semibold ${isPerfect ? "text-green-600" : "text-foreground"}`}>
                            {result.score}/{result.maxScore}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                {/* Key Insights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {mockTask.insights.strengths.map((insight, idx) => (
                          <li key={idx} className="text-sm text-green-600">• {insight.text}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-red-600 mb-2">Areas for Improvement</h4>
                      <ul className="space-y-1">
                        {mockTask.insights.improvements.map((insight, idx) => (
                          <li key={idx} className="text-sm text-red-600">• {insight.text}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comments Panel */}
        {isCommentsOpen && (
          <div className="w-80 border-l border-border bg-card flex flex-col h-full">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold">Comments</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsCommentsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.content}</p>
                      <Separator />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t border-border space-y-2">
              <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={3} />
              <Button onClick={handleAddComment} size="sm" className="w-full" disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}