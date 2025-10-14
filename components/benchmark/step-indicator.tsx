"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: number
  steps: string[]
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="border-b border-border bg-card px-8 md:px-12 lg:px-24 py-6">
      <div className="max-w-3xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isLast = index === steps.length - 1

            return (
              <div key={step} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      isCompleted && "border-green-500 bg-green-500 text-white",
                      isCurrent && "border-blue-500 bg-blue-500 text-white",
                      !isCompleted && !isCurrent && "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors",
                      isCurrent && "text-foreground",
                      !isCurrent && "text-muted-foreground",
                    )}
                  >
                    {step}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn("mx-4 h-0.5 flex-1 transition-colors", isCompleted ? "bg-green-500" : "bg-border")}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
