"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface SplitPaneProps {
  left: React.ReactNode
  right: React.ReactNode
  leftClassName?: string
  rightClassName?: string
}

export function SplitPane({ left, right, leftClassName, rightClassName }: SplitPaneProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
      <div className={cn("md:col-span-2", leftClassName)}>{left}</div>
      <div className={cn("md:col-span-1", rightClassName)}>{right}</div>
    </div>
  )
}
