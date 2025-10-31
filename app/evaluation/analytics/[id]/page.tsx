"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

type Report = {
  id: string
  category: string
  created: string
  status: string
  trajectories?: Array<{ id: string; name: string; source: "online" | "offline" }>
}

export default function AnalyticsReportDetailPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("analyticsReports") : null
    const list: Report[] = raw ? JSON.parse(raw) : []
    const r = list.find((x) => x.id === id) || null
    setReport(r)

    // Sync trajectories to global store for Trajectory table
    if (r?.trajectories?.length) {
      const existing = typeof window !== "undefined" ? window.localStorage.getItem("trajectories") : null
      const current = existing ? JSON.parse(existing) : []
      const additions = r.trajectories.map((t) => ({ id: t.id, name: t.name, source: t.source, createdAt: r.created }))
      const merged = Array.from(new Map([...current, ...additions].map((x: any) => [x.id, x]))).map(([, v]) => v)
      try { window.localStorage.setItem("trajectories", JSON.stringify(merged)) } catch {}
    }
  }, [id])

  const trajectories = useMemo(() => report?.trajectories || [], [report])

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/evaluation">Evaluation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/evaluation/analytics">Analytics</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Report {report?.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-foreground mt-4">Report {report?.id}</h1>
        <p className="text-sm text-muted-foreground mt-1">Category: {report?.category} • Created: {report?.created}</p>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trajectories">Trajectories</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">Status: <Badge variant="outline">{report?.status}</Badge></div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trajectories">
            <Card>
              <CardHeader>
                <CardTitle>Included Trajectories</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trace ID</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trajectories.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell className="font-mono text-sm">{t.id}</TableCell>
                        <TableCell className="font-medium">{t.name}</TableCell>
                        <TableCell><Badge variant={t.source === "online" ? "default" : "secondary"}>{t.source}</Badge></TableCell>
                        <TableCell className="text-right">
                          <Link href={`/tracing/trajectory/${t.id}`}>
                            <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}



