"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, GitBranch, FileText } from "lucide-react"

export default function OperationHome() {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <h1 className="text-2xl font-semibold text-foreground">Operation</h1>
        <p className="text-sm text-muted-foreground mt-1">Operational tools and tracing</p>
      </div>
      <div className="flex-1 overflow-auto p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" /> Traces
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">View and filter online traces</p>
            <Link href="/tracing/traces">
              <Button size="sm" variant="default">Open</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-4 w-4" /> Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Inspect agent trajectories</p>
            <Link href="/tracing/trajectory">
              <Button size="sm" variant="default">Open</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Prompts
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Manage prompt library</p>
            <Link href="/operation/prompts">
              <Button size="sm" variant="default">Open</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}



