"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data
const feedbackItems = [
  {
    id: "fb-001",
    traceId: "trace-001",
    input: "What is the weather today?",
    output: "The weather is sunny with 72°F",
    model: "GPT-4",
    rating: null,
    comment: "",
    status: "pending",
  },
  {
    id: "fb-002",
    traceId: "trace-002",
    input: "Generate a React component",
    output: "Created Button component with TypeScript...",
    model: "Claude",
    rating: 5,
    comment: "Excellent code quality and documentation",
    status: "reviewed",
  },
  {
    id: "fb-003",
    traceId: "trace-003",
    input: "Analyze sales data for Q4",
    output: "Sales increased by 23% in Q4 compared to Q3...",
    model: "GPT-4",
    rating: 4,
    comment: "Good analysis but could include more details",
    status: "reviewed",
  },
]

const feedbackDistribution = [
  { rating: "1 Star", count: 2 },
  { rating: "2 Stars", count: 5 },
  { rating: "3 Stars", count: 12 },
  { rating: "4 Stars", count: 28 },
  { rating: "5 Stars", count: 35 },
]

export default function FeedbackPage() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [rating, setRating] = useState<number>(0)
  const [comment, setComment] = useState("")

  const handleSubmitFeedback = () => {
    console.log("Submitting feedback:", { rating, comment })
    setRating(0)
    setComment("")
    setSelectedItem(null)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Human Feedback Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and annotate AI agent outputs for quality assessment
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Feedback Items List */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbackItems.map((item) => (
                  <div
                    key={item.id}
                    className={`border border-border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedItem === item.id ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                    onClick={() => setSelectedItem(item.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-muted-foreground">{item.traceId}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.model}
                          </Badge>
                          {item.status === "reviewed" ? (
                            <Badge variant="default" className="text-xs">
                              Reviewed
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground mb-2">{item.input}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">{item.output}</p>
                      </div>
                    </div>
                    {item.status === "reviewed" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= (item.rating || 0) ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        {item.comment && (
                          <span className="text-xs text-muted-foreground ml-2">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            {item.comment}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Feedback Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={feedbackDistribution}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="rating" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItem ? (
                  <>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-8 w-8 ${
                                star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Quick Actions</label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          Good
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          Poor
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comment</label>
                      <Textarea
                        placeholder="Add your feedback comments..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button className="w-full" onClick={handleSubmitFeedback}>
                      Submit Feedback
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">Select a trace to provide feedback</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
