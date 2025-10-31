import { toast } from "sonner"

/**
 * Error types for better error handling
 */
export enum ErrorType {
  STORAGE_QUOTA_EXCEEDED = "STORAGE_QUOTA_EXCEEDED",
  STORAGE_ERROR = "STORAGE_ERROR",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  NETWORK_ERROR = "NETWORK_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public type: ErrorType = ErrorType.UNKNOWN_ERROR,
    public context?: string
  ) {
    super(message)
    this.name = "AppError"
  }
}

/**
 * Handle storage-related errors (localStorage/sessionStorage)
 */
export function handleStorageError(error: unknown, context: string): void {
  console.error(`Storage error in ${context}:`, error)

  if (error instanceof DOMException) {
    switch (error.name) {
      case "QuotaExceededError":
        toast.error("Storage space is full", {
          description: "Please clear your browser cache and try again.",
          duration: 5000,
        })
        break
      case "SecurityError":
        toast.error("Storage access denied", {
          description: "Please check your browser privacy settings.",
          duration: 5000,
        })
        break
      default:
        toast.error("Storage operation failed", {
          description: "An unexpected error occurred. Please try again.",
          duration: 5000,
        })
    }
  } else {
    toast.error("Storage operation failed", {
      description: "An unexpected error occurred. Please try again.",
      duration: 5000,
    })
  }
}

/**
 * Handle validation errors
 */
export function handleValidationError(errors: Record<string, string[]>): void {
  const firstError = Object.values(errors).flat()[0]
  if (firstError) {
    toast.error("Validation failed", {
      description: firstError,
      duration: 4000,
    })
  }
}

/**
 * Handle generic errors with user-friendly messages
 */
export function handleError(error: unknown, context?: string): void {
  console.error(context ? `Error in ${context}:` : "Error:", error)

  if (error instanceof AppError) {
    switch (error.type) {
      case ErrorType.STORAGE_QUOTA_EXCEEDED:
        toast.error("Storage space is full", {
          description: "Please clear your browser cache and try again.",
          duration: 5000,
        })
        break
      case ErrorType.VALIDATION_ERROR:
        toast.error("Validation failed", {
          description: error.message,
          duration: 4000,
        })
        break
      case ErrorType.NETWORK_ERROR:
        toast.error("Network error", {
          description: "Please check your internet connection and try again.",
          duration: 4000,
        })
        break
      default:
        toast.error("An error occurred", {
          description: error.message || "Please try again later.",
          duration: 4000,
        })
    }
  } else if (error instanceof Error) {
    toast.error("An error occurred", {
      description: error.message || "Please try again later.",
      duration: 4000,
    })
  } else {
    toast.error("An unexpected error occurred", {
      description: "Please try again later.",
      duration: 4000,
    })
  }
}

/**
 * Safe async operation wrapper with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    handleError(error, context)
    return null
  }
}

/**
 * Safe sync operation wrapper with error handling
 */
export function withErrorHandlingSync<T>(
  operation: () => T,
  context?: string
): T | null {
  try {
    return operation()
  } catch (error) {
    handleError(error, context)
    return null
  }
}
