"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"
import type { Benchmark, Difficulty } from "@/lib/types/benchmark"
import { DIFFICULTY_COLORS, DIFFICULTY_OPTIONS } from "@/lib/constants/benchmark"
import { formatCategorySlug } from "@/lib/utils/benchmark"

// Mock data - replace with API call in production
const mockBenchmarks: Benchmark[] = [
  {
    id: "1",
    name: "KOL Sourcing v1",
    taskBrief: "KOL Sourcing",
    category: "kol sourcing",
    version: "1.0",
    status: "ready_for_testing",
    difficulty: "medium",
    owner: "John Doe",
    queryCount: 144,
    runCount: 247,
    avgScore: 6.8,
    updated: "2 hours ago",
  },
  {
    id: "2",
    name: "Email Outreach v1",
    taskBrief: "Email Outreach",
    category: "email outreach",
    version: "1.0",
    status: "tech_feedback",
    difficulty: "hard",
    owner: "Jane Smith",
    queryCount: 89,
    runCount: 156,
    avgScore: 5.4,
    updated: "1 day ago",
  },
  {
    id: "3",
    name: "Geo Analysis v1",
    taskBrief: "Geo",
    category: "geo",
    version: "1.0",
    status: "closed",
    difficulty: "easy",
    owner: "Mike Johnson",
    queryCount: 203,
    runCount: 412,
    avgScore: 8.3,
    updated: "3 days ago",
  },
  {
    id: "4",
    name: "Social Listening v1",
    taskBrief: "Social Listening",
    category: "social listening",
    version: "1.0",
    status: "ready_for_testing",
    difficulty: "easy",
    owner: "Sarah Williams",
    queryCount: 178,
    runCount: 324,
    avgScore: 7.7,
    updated: "5 days ago",
  },
  {
    id: "5",
    name: "KOL Sourcing v2",
    taskBrief: "KOL Sourcing",
    category: "kol sourcing",
    version: "2.0",
    status: "not_started",
    difficulty: "hard",
    owner: "John Doe",
    queryCount: 95,
    runCount: 189,
    avgScore: 6.2,
    updated: "1 week ago",
  },
  {
    id: "6",
    name: "Email Outreach v2",
    taskBrief: "Email Outreach",
    category: "email outreach",
    version: "2.0",
    status: "retesting",
    difficulty: "medium",
    owner: "Jane Smith",
    queryCount: 167,
    runCount: 298,
    avgScore: 7.1,
    updated: "2 weeks ago",
  },
]

export default function BenchmarksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [difficultyFilter, setDifficultyFilter] = useState<Difficulty | "all">("all")

  const filteredBenchmarks = mockBenchmarks.filter((benchmark) => {
    const matchesSearch =
      benchmark.taskBrief.toLowerCase().includes(searchQuery.toLowerCase()) ||
      benchmark.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = difficultyFilter === "all" || benchmark.difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty
  })

  return (
    <div className="h-full overflow-auto bg-background">
      <div className="px-8 md:px-12 lg:px-16 pt-16 pb-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">Benchmarks</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage evaluation benchmarks and test suites</p>
            </div>
            <Button asChild size="sm" className="h-8 gap-2">
              <Link href="/benchmarks/create">
                <Plus className="h-4 w-4" />
                Create New Task
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search task/query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 bg-background border-border"
              />
            </div>
            <Select value={difficultyFilter} onValueChange={(value) => setDifficultyFilter(value as Difficulty | "all")}>
              <SelectTrigger className="w-[160px] h-9 bg-background border-border">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulties</SelectItem>
                {DIFFICULTY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBenchmarks.map((benchmark) => (
              <Link
                key={benchmark.id}
                href={`/benchmarks/${formatCategorySlug(benchmark.category)}`}
                className="group block rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/20"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm text-foreground leading-snug group-hover:text-foreground/80 transition-colors">
                        {benchmark.taskBrief}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{benchmark.name}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${DIFFICULTY_COLORS[benchmark.difficulty]} capitalize text-xs shrink-0 border font-normal`}
                    >
                      {benchmark.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{benchmark.queryCount} queries</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span>{benchmark.runCount} runs</span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-emerald-400">{benchmark.avgScore} points</span>
                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground/60">{benchmark.updated}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredBenchmarks.length === 0 && (
            <div className="text-center py-20">
              <p className="text-sm text-muted-foreground">No benchmarks found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
