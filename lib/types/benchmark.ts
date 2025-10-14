// Benchmark Type Definitions
// Centralized type definitions for benchmark-related data structures

export type BenchmarkStatus =
  | "not_started"
  | "ready_for_testing"
  | "tech_feedback"
  | "raul_feedback"
  | "retesting"
  | "closed"

export type Difficulty = "easy" | "medium" | "hard"

export type BenchmarkCategory =
  | "kol-sourcing"
  | "email-outreach"
  | "geo"
  | "social-listening"

export interface RubricDimension {
  id: string
  title: string
  description: string
  maxScore: number
}

export interface BenchmarkData {
  taskBrief: string
  category: string
  status: BenchmarkStatus
  difficulty: Difficulty
  environment: string
  lazyQuery: string
  diligentQuery: string
  notes: string
  expectedOutput: string
  uploadedFiles: Array<{ name: string; size: string }>
  rubricDimensions: RubricDimension[]
}

export interface Benchmark {
  id: string
  name: string
  taskBrief: string
  category: string
  version: string
  status: BenchmarkStatus
  difficulty: Difficulty
  owner: string
  queryCount?: number
  runCount?: number
  avgScore?: number
  updated: string
}

export interface Template {
  id: string
  name: string
  template: string
}

export interface Environment {
  id: string
  name: string
  content: string
}
