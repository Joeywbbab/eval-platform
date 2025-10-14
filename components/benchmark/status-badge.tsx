import { Badge } from "@/components/ui/badge"

type BenchmarkStatus = "not_started" | "ready_for_testing" | "tech_feedback" | "raul_feedback" | "retesting" | "closed"

const statusConfig: Record<
  BenchmarkStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className: string }
> = {
  not_started: {
    label: "Not Started",
    variant: "outline",
    className: "border-gray-300 text-gray-700 bg-gray-50",
  },
  ready_for_testing: {
    label: "Ready for Testing",
    variant: "outline",
    className: "border-blue-300 text-blue-700 bg-blue-50",
  },
  tech_feedback: {
    label: "Tech Feedback",
    variant: "outline",
    className: "border-amber-300 text-amber-700 bg-amber-50",
  },
  raul_feedback: {
    label: "Raul Feedback",
    variant: "outline",
    className: "border-purple-300 text-purple-700 bg-purple-50",
  },
  retesting: {
    label: "Retesting",
    variant: "outline",
    className: "border-indigo-300 text-indigo-700 bg-indigo-50",
  },
  closed: {
    label: "Closed",
    variant: "outline",
    className: "border-green-300 text-green-700 bg-green-50",
  },
}

export function StatusBadge({ status }: { status: BenchmarkStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}
