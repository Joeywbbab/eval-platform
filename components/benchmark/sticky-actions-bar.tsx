"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Save } from "lucide-react"

interface StickyActionsBarProps {
  onSave?: () => void
  onPrevious?: () => void
  onNext?: () => void
  onSubmit?: () => void
  showPrevious?: boolean
  showNext?: boolean
  nextLabel?: string
  previousLabel?: string
  submitLabel?: string
  isSaving?: boolean
}

export function StickyActionsBar({
  onSave,
  onPrevious,
  onNext,
  onSubmit,
  showPrevious = true,
  showNext = true,
  nextLabel = "Next",
  previousLabel = "Previous",
  submitLabel = "Submit",
  isSaving = false,
}: StickyActionsBarProps) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 px-6 py-4">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          {showPrevious && onPrevious && (
            <Button variant="outline" onClick={onPrevious}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {previousLabel}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onSave && (
            <Button onClick={onSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
          {onSubmit && (
            <Button onClick={onSubmit} className="bg-green-600 hover:bg-green-700">
              {submitLabel}
            </Button>
          )}
          {showNext && onNext && (
            <Button onClick={onNext}>
              {nextLabel}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
