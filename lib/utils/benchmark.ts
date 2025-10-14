// Benchmark Utility Functions
// Helper functions for benchmark-related operations

import type { BenchmarkStatus, RubricDimension } from "@/lib/types/benchmark"

/**
 * Format benchmark status for display
 */
export function formatStatus(status: BenchmarkStatus): string {
  return status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

/**
 * Calculate total score from rubric dimensions
 */
export function calculateTotalScore(dimensions: RubricDimension[]): number {
  return dimensions.reduce((sum, dim) => sum + dim.maxScore, 0)
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Validate benchmark data for submission
 */
export function validateBenchmarkData(data: {
  taskBrief: string
  category: string
  lazyQuery?: string
  diligentQuery?: string
  rubricDimensions?: RubricDimension[]
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!data.taskBrief?.trim()) {
    errors.push("Task Brief is required")
  }

  if (!data.category?.trim()) {
    errors.push("Category is required")
  }

  if (!data.lazyQuery?.trim() && !data.diligentQuery?.trim()) {
    errors.push("At least one query (Lazy or Diligent) is required")
  }

  if (data.rubricDimensions && data.rubricDimensions.length === 0) {
    errors.push("At least one rubric dimension is required")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Highlight template variables in a query string
 */
export function highlightTemplateVariables(text: string): Array<{ text: string; isVariable: boolean }> {
  const parts = text.split(/(\{\{[^}]+\}\})/)
  return parts.map((part) => ({
    text: part,
    isVariable: /\{\{[^}]+\}\}/.test(part),
  }))
}

/**
 * Generate a unique ID for new items
 */
export function generateId(): string {
  return Date.now().toString()
}

/**
 * Format category slug for URL
 */
export function formatCategorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-")
}

/**
 * Parse category slug from URL
 */
export function parseCategorySlug(slug: string): string {
  return slug.replace(/-/g, " ")
}
