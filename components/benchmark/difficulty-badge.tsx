import { Badge } from "@/components/ui/badge"

type Difficulty = "easy" | "medium" | "hard"

const difficultyConfig: Record<Difficulty, { className: string }> = {
  easy: { className: "border-green-300 text-green-700 bg-green-50" },
  medium: { className: "border-amber-300 text-amber-700 bg-amber-50" },
  hard: { className: "border-red-300 text-red-700 bg-red-50" },
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty]
  return (
    <Badge variant="outline" className={config.className}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </Badge>
  )
}
