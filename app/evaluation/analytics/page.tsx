"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, Eye } from "lucide-react"

// Mock data
const evaluationReports = [
  {
    id: "eval-001",
    category: "code-generation",
    created: "2025-01-10 14:00",
    status: "completed",
    trajectories: [
      { id: "trace-001", name: "User Query Processing", source: "online" },
    ],
  },
  {
    id: "eval-002",
    category: "qa",
    created: "2025-01-10 12:30",
    status: "completed",
    trajectories: [
      { id: "trace-002", name: "Code Generation", source: "offline" },
    ],
  },
  {
    id: "eval-003",
    category: "translation",
    created: "2025-01-10 10:15",
    status: "uploading",
  },
  {
    id: "eval-004",
    category: "reasoning",
    created: "2025-01-09 16:45",
    status: "completed",
  },
]

// KPIs and charts moved to Dashboard

export default function AnalyticsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const fileInputId = "upload-report-input"

  const onFilesSelected = (list: FileList | null) => {
    if (!list || list.length === 0) return
    setFiles(Array.from(list))
  }

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    onFilesSelected(e.dataTransfer.files)
  }

  const onSend = () => {
    try {
      if (typeof window !== "undefined") {
        const prev = window.localStorage.getItem("uploadedReports")
        const next = [
          ...(prev ? JSON.parse(prev) : []),
          ...files.map((f) => ({ name: f.name, size: f.size, type: f.type, uploadedAt: new Date().toISOString() })),
        ]
        window.localStorage.setItem("uploadedReports", JSON.stringify(next))
      }
    } catch {}
    setIsUploadOpen(false)
    setFiles([])
  }

  // Persist reports and their trajectories for other pages
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem("analyticsReports", JSON.stringify(evaluationReports))
      const trajs = evaluationReports.flatMap((r: any) =>
        (r.trajectories || []).map((t: any) => ({ id: t.id, name: t.name, source: t.source, createdAt: r.created })),
      )
      const existing = window.localStorage.getItem("trajectories")
      const merged = Array.from(new Map([...(existing ? JSON.parse(existing) : []), ...trajs].map((x: any) => [x.id, x]))).map(([, v]) => v)
      window.localStorage.setItem("trajectories", JSON.stringify(merged))
    } catch {}
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/evaluation">Evaluation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Analytics</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-1">View and analyze uploaded evaluation reports by category</p>
          </div>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload files</DialogTitle>
              </DialogHeader>
              <div
                className="rounded-md border border-dashed p-8 text-center select-none"
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
              >
                <h3 className="text-xl font-semibold mb-2">Drag and drop local files to upload</h3>
                <p className="text-muted-foreground mb-4">The files will be evaluated automatically</p>
                <div className="flex items-center justify-center">
                  <input id={fileInputId} type="file" className="hidden" multiple onChange={(e) => onFilesSelected(e.target.files)} />
                  <Button variant="secondary" onClick={() => document.getElementById(fileInputId)?.click()}>Select files</Button>
                </div>
                {files.length > 0 && (
                  <div className="text-left mt-4 space-y-1">
                    {files.map((f) => (
                      <div key={f.name} className="text-sm text-muted-foreground">{f.name}</div>
                    ))}
                  </div>
                )}
              </div>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => { setIsUploadOpen(false); setFiles([]) }}>Cancel</Button>
                <Button onClick={onSend} disabled={files.length === 0}>Send</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid gap-6">
          {/* Reports Table */}
          <Card>
            <CardHeader>
              <CardTitle>Evaluation Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Eval ID</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluationReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-mono text-sm">{report.id}</TableCell>
                      <TableCell className="font-medium">{report.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{report.created}</TableCell>
                      <TableCell><Badge variant="outline">{report.status}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Link href={`/evaluation/analytics/${report.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
