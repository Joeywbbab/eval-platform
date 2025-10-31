import { handleStorageError, AppError, ErrorType } from "./error-handler"

/**
 * Safe localStorage wrapper with error handling and type safety
 */
export const storage = {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string, defaultValue?: T): T | null {
    if (typeof window === "undefined") return defaultValue ?? null

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) return defaultValue ?? null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Failed to get item "${key}" from localStorage:`, error)
      return defaultValue ?? null
    }
  },

  /**
   * Set item in localStorage with error handling
   */
  set<T>(key: string, value: T): boolean {
    if (typeof window === "undefined") return false

    try {
      const serialized = JSON.stringify(value)
      window.localStorage.setItem(key, serialized)
      return true
    } catch (error) {
      handleStorageError(error, `storage.set("${key}")`)
      return false
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    if (typeof window === "undefined") return false

    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error(`Failed to remove item "${key}" from localStorage:`, error)
      return false
    }
  },

  /**
   * Clear all items from localStorage
   */
  clear(): boolean {
    if (typeof window === "undefined") return false

    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      console.error("Failed to clear localStorage:", error)
      return false
    }
  },

  /**
   * Check if key exists in localStorage
   */
  has(key: string): boolean {
    if (typeof window === "undefined") return false

    try {
      return window.localStorage.getItem(key) !== null
    } catch (error) {
      console.error(`Failed to check if "${key}" exists in localStorage:`, error)
      return false
    }
  },

  /**
   * Get all keys from localStorage
   */
  keys(): string[] {
    if (typeof window === "undefined") return []

    try {
      return Object.keys(window.localStorage)
    } catch (error) {
      console.error("Failed to get localStorage keys:", error)
      return []
    }
  },

  /**
   * Get storage usage information
   */
  getUsage(): { used: number; available: number; percentage: number } | null {
    if (typeof window === "undefined") return null

    try {
      let used = 0
      for (const key of Object.keys(window.localStorage)) {
        used += key.length + (window.localStorage.getItem(key)?.length || 0)
      }

      // Most browsers allow ~5-10MB for localStorage
      const available = 5 * 1024 * 1024 // 5MB estimate
      const percentage = Math.round((used / available) * 100)

      return { used, available, percentage }
    } catch (error) {
      console.error("Failed to get storage usage:", error)
      return null
    }
  },
}

/**
 * Storage keys constants to avoid typos
 */
export const STORAGE_KEYS = {
  FEEDBACK_QUEUE: "feedbackQueue",
  FEEDBACK_QUEUES: "feedbackQueues",
  BENCHMARKS: "benchmarks",
  TRACES: "traces",
  USER_PREFERENCES: "userPreferences",
  THEME: "theme",
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
