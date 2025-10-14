import { Badge } from "@/components/ui/badge"

interface PageHeaderProps {
  name?: string
  category?: string
  version?: string
  status?: "not_started" | "ready_for_testing" | "tech_feedback" | "raul_feedback" | "retesting" | "closed"
  difficulty?: "easy" | "medium" | "hard"
}

const statusColors = {
  not_started: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  ready_for_testing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  tech_feedback: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  raul_feedback: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  retesting: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  closed: "bg-green-500/10 text-green-500 border-green-500/20",
}

const statusDisplayNames = {
  not_started: "Not Started",
  ready_for_testing: "Ready for Testing",
  tech_feedback: "Tech Feedback",
  raul_feedback: "Raul Feedback",
  retesting: "Retesting",
  closed: "Closed",
}

const difficultyColors = {
  easy: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  hard: "bg-red-500/10 text-red-500 border-red-500/20",
}

export function PageHeader({ name, category, version, status, difficulty }: PageHeaderProps) {
  return (
    <div className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-[-0.01em] leading-tight">
            {name || "New Benchmark"}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {category && <span>{category}</span>}
            {version && (
              <>
                <span className="text-border">•</span>
                <span>v{version}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status && (
            <Badge variant="outline" className={statusColors[status]}>
              {statusDisplayNames[status]}
            </Badge>
          )}
          {difficulty && (
            <Badge variant="outline" className={difficultyColors[difficulty]}>
              {difficulty}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
