"use client"

import { useParams } from "next/navigation"
import TrajectoryView from "../view"

export default function TrajectoryDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id || "trace-001"
  return <TrajectoryView traceId={id} />
}




