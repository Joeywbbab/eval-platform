"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronRight, ExternalLink, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data for task briefs in a category
const mockTaskBriefs = [
  {
    id: "1",
    taskBrief: "Find KOL influencers in tech space with 10k+ followers",
    difficulty: "Medium",
    lazyQuery: "Find tech influencers with over 10k followers",
    diligentQuery:
      "Identify key opinion leaders in the technology sector with a minimum of 10,000 followers across social media platforms, focusing on engagement rates and content quality",
    expectedOutput:
      "A curated list of tech influencers including their social media handles, follower counts, engagement rates, and primary content focus areas",
    uploadedFiles: [
      { name: "tech_influencers_template.xlsx", size: "45 KB", type: "xlsx" },
      { name: "evaluation_criteria.pdf", size: "128 KB", type: "pdf" },
    ],
    queries: 24,
    runs: 8,
    score: 7.2,
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    taskBrief: "Identify micro-influencers in sustainable fashion",
    difficulty: "Hard",
    lazyQuery: "Find sustainable fashion micro-influencers",
    diligentQuery:
      "Locate micro-influencers (5k-50k followers) in the sustainable fashion niche who actively promote eco-friendly brands and have authentic engagement with their audience",
    expectedOutput:
      "Detailed profiles of sustainable fashion micro-influencers with metrics on audience demographics, engagement patterns, and brand collaboration history",
    uploadedFiles: [{ name: "fashion_influencer_data.csv", size: "67 KB", type: "csv" }],
    queries: 18,
    runs: 5,
    score: 6.8,
    updatedAt: "5 hours ago",
  },
  {
    id: "3",
    taskBrief: "Source gaming content creators on YouTube",
    difficulty: "Easy",
    lazyQuery: "Find gaming YouTubers",
    diligentQuery:
      "Identify gaming content creators on YouTube with consistent upload schedules, strong community engagement, and expertise in specific gaming genres",
    expectedOutput:
      "List of gaming YouTubers with channel statistics, content categories, upload frequency, and audience engagement metrics",
    uploadedFiles: [],
    queries: 32,
    runs: 12,
    score: 8.1,
    updatedAt: "1 day ago",
  },
]

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // Unwrap params using React.use()
  const { category } = use(params)

  // Handle navigation to create page
  if (typeof window !== "undefined" && (category === "create" || category === "new")) {
    window.location.href = "/benchmarks/create"
    return null
  }

  const categoryName = decodeURIComponent(category)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  // Calculate category-level stats
  const totalQueries = mockTaskBriefs.reduce((sum, task) => sum + task.queries, 0)
  const totalRuns = mockTaskBriefs.reduce((sum, task) => sum + task.runs, 0)
  const avgScore = (mockTaskBriefs.reduce((sum, task) => sum + task.score, 0) / mockTaskBriefs.length).toFixed(1)

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/benchmarks">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
              <p className="text-sm text-muted-foreground mt-1">{mockTaskBriefs.length} task briefs</p>
            </div>
          </div>
          <Link href="/benchmarks/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Task
            </Button>
          </Link>
        </div>

        {/* Category Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQueries}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRuns}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{avgScore}</div>
              <p className="text-xs text-muted-foreground mt-1">out of 10 points</p>
            </CardContent>
          </Card>
        </div>

        <TaskBriefsList taskBriefs={mockTaskBriefs} category={category} getDifficultyColor={getDifficultyColor} />
      </div>
    </div>
  )
}

function TaskBriefsList({
  taskBriefs,
  category,
  getDifficultyColor,
}: {
  taskBriefs: typeof mockTaskBriefs
  category: string
  getDifficultyColor: (difficulty: string) => string
}) {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-3">
      {taskBriefs.map((task) => (
        <Collapsible key={task.id} open={openItems.includes(task.id)} onOpenChange={() => toggleItem(task.id)}>
          <Card className="overflow-hidden transition-all hover:border-primary/50">
            <CollapsibleTrigger className="w-full">
              <CardHeader className="cursor-pointer">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {openItems.includes(task.id) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Link
                          href={`/benchmarks/${category}/${task.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hover:underline"
                        >
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            {task.taskBrief}
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          </h3>
                        </Link>
                        <Badge variant="outline" className={getDifficultyColor(task.difficulty)}>
                          {task.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{task.queries} queries</span>
                        <span>•</span>
                        <span>{task.runs} runs</span>
                        <span>•</span>
                        <span className="text-orange-500 font-medium">{task.score} points</span>
                        <span>•</span>
                        <span>Updated {task.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="pt-0 pb-6 space-y-6">
                {/* Lazy Query */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Lazy Query</h4>
                  <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{task.lazyQuery}</p>
                </div>

                {/* Diligent Query */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Diligent Query</h4>
                  <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md">{task.diligentQuery}</p>
                </div>

                {/* Expected Output */}
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Expected Output</h4>
                  <p className="text-sm leading-relaxed bg-muted/50 p-3 rounded-md mb-3">{task.expectedOutput}</p>

                  {/* Uploaded Files */}
                  {task.uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">Uploaded Files</p>
                      <div className="space-y-2">
                        {task.uploadedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium text-primary uppercase">{file.type}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View Full Details Link */}
                <div className="pt-2 border-t">
                  <Link href={`/benchmarks/${category}/${task.id}`}>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View Full Details
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      ))}
    </div>
  )
}
