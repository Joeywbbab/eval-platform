import { Badge } from "@/components/ui/badge"

export function VersionPill({ version }: { version: string }) {
  return (
    <Badge variant="secondary" className="font-mono text-xs">
      v{version}
    </Badge>
  )
}
