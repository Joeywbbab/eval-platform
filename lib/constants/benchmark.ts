// Benchmark Constants
// Centralized configuration for benchmark-related constants

import type { BenchmarkCategory, BenchmarkStatus, Difficulty } from "@/lib/types/benchmark"

// Benchmark Creation Steps
export const BENCHMARK_STEPS = ["Info", "Query", "Rubric", "Review"] as const

// Category Configuration
export const CATEGORY_OPTIONS: Array<{ value: BenchmarkCategory; label: string }> = [
  { value: "kol-sourcing", label: "KOL Sourcing" },
  { value: "email-outreach", label: "Email Outreach" },
  { value: "geo", label: "Geo" },
  { value: "social-listening", label: "Social Listening" },
]

export const CATEGORY_COLORS: Record<string, string> = {
  "kol sourcing": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "kol-sourcing": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "email outreach": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "email-outreach": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  geo: "bg-green-500/10 text-green-400 border-green-500/20",
  "social listening": "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "social-listening": "bg-pink-500/10 text-pink-400 border-pink-500/20",
}

// Status Configuration
export const STATUS_OPTIONS: Array<{ value: BenchmarkStatus; label: string }> = [
  { value: "not_started", label: "Not Started" },
  { value: "ready_for_testing", label: "Ready for Testing" },
  { value: "tech_feedback", label: "Tech Feedback" },
  { value: "raul_feedback", label: "Raul Feedback" },
  { value: "retesting", label: "Retesting" },
  { value: "closed", label: "Closed" },
]

export const STATUS_COLORS: Record<BenchmarkStatus, string> = {
  not_started: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  ready_for_testing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  tech_feedback: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  raul_feedback: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  retesting: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

// Difficulty Configuration
export const DIFFICULTY_OPTIONS: Array<{ value: Difficulty; label: string }> = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
]

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  easy: "bg-green-500/10 text-green-400 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  hard: "bg-red-500/10 text-red-400 border-red-500/20",
}

// Default Rubric Dimensions
export const DEFAULT_RUBRIC_DIMENSIONS = [
  {
    id: "1",
    title: "Accuracy",
    description: "Correctness of the output",
    maxScore: 4,
  },
  {
    id: "2",
    title: "Completeness",
    description: "Coverage of all required aspects",
    maxScore: 3,
  },
  {
    id: "3",
    title: "Efficiency",
    description: "Resource usage and performance",
    maxScore: 3,
  },
]
