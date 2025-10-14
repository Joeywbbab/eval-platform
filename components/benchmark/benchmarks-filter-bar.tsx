"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function BenchmarksFilterBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<string>("all")

  const statuses = [
    { value: "not_started", label: "Not Started" },
    { value: "ready_for_testing", label: "Ready for Testing" },
    { value: "tech_feedback", label: "Tech Feedback" },
    { value: "raul_feedback", label: "Raul Feedback" },
    { value: "retesting", label: "Retesting" },
    { value: "closed", label: "Closed" },
  ]

  const categories = [
    { value: "code-generation", label: "Code Generation" },
    { value: "qa", label: "Question Answering" },
    { value: "translation", label: "Translation" },
    { value: "reasoning", label: "Reasoning" },
    { value: "creative", label: "Creative Writing" },
  ]

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedStatuses([])
    setSelectedCategories([])
    setDifficulty("all")
  }

  const hasActiveFilters =
    searchQuery || selectedStatuses.length > 0 || selectedCategories.length > 0 || difficulty !== "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulty</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground flex items-center">
            <Filter className="h-3 w-3 mr-1" />
            Status:
          </span>
          {statuses.map((status) => (
            <Badge
              key={status.value}
              variant={selectedStatuses.includes(status.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleStatus(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground flex items-center">
          <Filter className="h-3 w-3 mr-1" />
          Category:
        </span>
        {categories.map((category) => (
          <Badge
            key={category.value}
            variant={selectedCategories.includes(category.value) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => toggleCategory(category.value)}
          >
            {category.label}
          </Badge>
        ))}
      </div>
    </div>
  )
}
