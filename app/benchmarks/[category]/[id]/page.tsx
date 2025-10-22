"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Archive, Save, X, FileText, MessageSquare, Reply, RotateCcw, Bot, TrendingUp, TrendingDown, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Mock data
const mockBenchmark = {
  id: "1",
  taskBrief: "Find KOL influencers in tech space with 10k+ followers",
  category: "KOL Sourcing",
  difficulty: "Medium",
  queries: 24,
  totalRuns: 8,
  avgScore: 7.2,
  lazyQuery: "Find tech influencers with over 10k followers",
  diligentQuery:
    "Identify key opinion leaders in the technology sector with a minimum of 10,000 followers across social media platforms, focusing on engagement rates and content quality",
  expectedOutput:
    "A curated list of tech influencers including their social media handles, follower counts, engagement rates, and primary content focus areas",
  uploadedFiles: [
    { name: "tech_influencers_template.xlsx", size: "45 KB", type: "xlsx" },
    { name: "evaluation_criteria.pdf", size: "128 KB", type: "pdf" },
    { name: "sample_output.csv", size: "23 KB", type: "csv" },
  ],
  scoringDimensions: [
    { name: "Accuracy", score: 3, description: "Correctness of identified influencers" },
    { name: "Completeness", score: 2, description: "Coverage of required data fields" },
    {
      name: "Relevance",
      score: 3,
      description: "Alignment with tech sector and follower criteria",
    },
    { name: "Quality", score: 2, description: "Engagement rate and content quality assessment" },
  ],
  updatedAt: "2024-01-15T10:30:00Z",
}

const mockModifications = [
  {
    id: "1",
    user: "Sarah Chen",
    action: "Updated scoring rubric",
    timestamp: "2 hours ago",
    details: "Modified accuracy dimension from 2 to 3 points",
  },
  {
    id: "2",
    user: "Mike Johnson",
    action: "Added expected output file",
    timestamp: "5 hours ago",
    details: "Uploaded sample_output.csv",
  },
  {
    id: "3",
    user: "Sarah Chen",
    action: "Updated diligent query",
    timestamp: "1 day ago",
    details: "Refined query to include engagement rate criteria",
  },
]

const mockDiscussions = [
  {
    id: "1",
    user: "Sarah Chen",
    avatar: "SC",
    comment: "Should we increase the follower threshold to 15k?",
    timestamp: "3 hours ago",
    replies: [
      {
        id: "1-1",
        user: "Mike Johnson",
        avatar: "MJ",
        comment: "I think 10k is good for now. We can create a separate benchmark for higher thresholds.",
        timestamp: "2 hours ago",
      },
    ],
  },
  {
    id: "2",
    user: "Alex Kim",
    avatar: "AK",
    comment: "The expected output format looks great! Very comprehensive.",
    timestamp: "1 day ago",
    replies: [],
  },
]

const mockAgentPerformance = [
  {
    id: "1",
    name: "Sophia v3",
    version: "3.0.2",
    avgScore: 8.4,
    accuracy: 91,
    latency: 850,
    successRate: 95,
    runs: 156,
    trend: "up",
    color: "bg-blue-500",
  },
  {
    id: "2",
    name: "Sophia v2",
    version: "2.1.5",
    avgScore: 7.2,
    accuracy: 84,
    latency: 920,
    successRate: 89,
    runs: 247,
    trend: "neutral",
    color: "bg-purple-500",
  },
  {
    id: "3",
    name: "Manus",
    version: "1.8.3",
    avgScore: 6.8,
    accuracy: 78,
    latency: 1100,
    successRate: 82,
    runs: 124,
    trend: "up",
    color: "bg-green-500",
  },
  {
    id: "4",
    name: "GPT-4o",
    version: "2024-11",
    avgScore: 7.9,
    accuracy: 88,
    latency: 780,
    successRate: 91,
    runs: 89,
    trend: "down",
    color: "bg-orange-500",
  },
]

export default function TaskDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>
}) {
  // Unwrap params using React.use()
  const { category: categorySlug, id } = use(params)

  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({
    lazyQuery: mockBenchmark.lazyQuery,
    diligentQuery: mockBenchmark.diligentQuery,
    expectedOutput: mockBenchmark.expectedOutput,
    scoringDimensions: mockBenchmark.scoringDimensions,
  })
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState("")

  const handleSave = () => {
    console.log("[v0] Saving changes:", editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData({
      lazyQuery: mockBenchmark.lazyQuery,
      diligentQuery: mockBenchmark.diligentQuery,
      expectedOutput: mockBenchmark.expectedOutput,
      scoringDimensions: mockBenchmark.scoringDimensions,
    })
    setIsEditing(false)
  }

  const handleRevert = (modificationId: string) => {
    console.log("[v0] Reverting to modification:", modificationId)
  }

  const handlePostComment = () => {
    console.log("[v0] Posting comment:", newComment)
    setNewComment("")
  }

  const handlePostReply = (commentId: string) => {
    console.log("[v0] Posting reply to:", commentId, replyText)
    setReplyText("")
    setReplyingTo(null)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
      case "medium":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20"
      case "hard":
        return "text-rose-400 bg-rose-400/10 border-rose-400/20"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Link href={`/benchmarks/${categorySlug}`}>
              <Button variant="ghost" size="icon" className="mt-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{mockBenchmark.taskBrief}</h1>
                <Badge variant="outline" className={getDifficultyColor(mockBenchmark.difficulty)}>
                  {mockBenchmark.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated {new Date(mockBenchmark.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Query Information */}
            <Card>
              <CardHeader>
                <CardTitle>Query Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Lazy Query</label>
                  {isEditing ? (
                    <Textarea
                      value={editedData.lazyQuery}
                      onChange={(e) => setEditedData({ ...editedData, lazyQuery: e.target.value })}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{editedData.lazyQuery}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground mb-2 block">Diligent Query</label>
                  {isEditing ? (
                    <Textarea
                      value={editedData.diligentQuery}
                      onChange={(e) => setEditedData({ ...editedData, diligentQuery: e.target.value })}
                      className="min-h-[80px]"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{editedData.diligentQuery}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Expected Output */}
            <Card>
              <CardHeader>
                <CardTitle>Expected Output</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <Textarea
                    value={editedData.expectedOutput}
                    onChange={(e) => setEditedData({ ...editedData, expectedOutput: e.target.value })}
                    className="min-h-[80px]"
                  />
                ) : (
                  <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{editedData.expectedOutput}</p>
                )}

                {/* Uploaded Files */}
                {mockBenchmark.uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Uploaded Files</p>
                    <div className="space-y-2">
                      {mockBenchmark.uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary uppercase">{file.type}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Scoring Rubric */}
            <Card>
              <CardHeader>
                <CardTitle>Scoring Rubric</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {editedData.scoringDimensions.map((dimension, index) => (
                    <div key={index} className="flex items-start justify-between p-3 rounded-md bg-muted/30">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{dimension.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{dimension.description}</p>
                      </div>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={dimension.score}
                          onChange={(e) => {
                            const newDimensions = [...editedData.scoringDimensions]
                            newDimensions[index].score = Number.parseInt(e.target.value)
                            setEditedData({ ...editedData, scoringDimensions: newDimensions })
                          }}
                          className="w-20 ml-4"
                        />
                      ) : (
                        <div className="ml-4 text-right">
                          <p className="text-lg font-bold text-orange-500">{dimension.score}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <p className="font-semibold">Total Score</p>
                    <p className="text-xl font-bold text-orange-500">
                      {editedData.scoringDimensions.reduce((sum, dim) => sum + dim.score, 0)} / 10
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Modification History */}
            <Card>
              <CardHeader>
                <CardTitle>Modification History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockModifications.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-start justify-between p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{mod.user}</p>
                          <span className="text-xs text-muted-foreground">•</span>
                          <p className="text-xs text-muted-foreground">{mod.timestamp}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{mod.action}</p>
                        <p className="text-xs text-muted-foreground mt-1">{mod.details}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleRevert(mod.id)}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Discussion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Comments */}
                <div className="space-y-4">
                  {mockDiscussions.map((discussion) => (
                    <div key={discussion.id} className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">{discussion.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{discussion.user}</p>
                            <span className="text-xs text-muted-foreground">{discussion.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{discussion.comment}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => setReplyingTo(discussion.id)}
                          >
                            <Reply className="mr-1 h-3 w-3" />
                            Reply
                          </Button>
                        </div>
                      </div>

                      {/* Replies */}
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className="ml-11 flex items-start gap-3">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback className="text-xs">{reply.avatar}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{reply.user}</p>
                              <span className="text-xs text-muted-foreground">{reply.timestamp}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">{reply.comment}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      {replyingTo === discussion.id && (
                        <div className="ml-11 space-y-2">
                          <Textarea
                            placeholder="Write a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[60px] text-sm"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handlePostReply(discussion.id)}>
                              Post Reply
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setReplyingTo(null)
                                setReplyText("")
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* New Comment Input */}
                <div className="space-y-2 pt-4 border-t">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <Button onClick={handlePostComment} className="w-full">
                    Post Comment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agent Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  Agent Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAgentPerformance.map((agent) => (
                  <div
                    key={agent.id}
                    className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors space-y-3"
                  >
                    {/* Agent Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${agent.color}`} />
                        <div>
                          <p className="font-semibold text-sm">{agent.name}</p>
                          <p className="text-xs text-muted-foreground">v{agent.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {agent.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                        {agent.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                        <Badge variant="outline" className="text-xs">
                          {agent.runs} runs
                        </Badge>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-orange-500">{agent.avgScore}</span>
                      <span className="text-xs text-muted-foreground">avg score</span>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="font-medium">{agent.accuracy}%</span>
                      </div>
                      <Progress value={agent.accuracy} className="h-1.5" />

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-medium">{agent.successRate}%</span>
                      </div>
                      <Progress value={agent.successRate} className="h-1.5" />

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-muted-foreground">Avg Latency</span>
                        <span className="font-medium">{agent.latency}ms</span>
                      </div>
                    </div>

                    {/* Best Performer Badge */}
                    {agent.avgScore === Math.max(...mockAgentPerformance.map((a) => a.avgScore)) && (
                      <div className="flex items-center gap-1 pt-2 border-t">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="text-xs font-medium text-green-500">Best Performer</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
