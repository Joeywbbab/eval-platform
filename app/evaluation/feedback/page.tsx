"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { MoreHorizontal, ChevronUp, ChevronDown, Share2, X } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

type FeedbackQueue = {
  id: string
  name: string
  completedItems: number
  pendingItems: number
  createdAt: string
  assignedTo: string
  status: "finish" | "process"
  traces?: Array<{
    id: string
    name: string
    feedback?: string
    deliverables?: string
    createdAt?: string
    evalId?: string
  }>
}

// Mock data
const mockQueues: FeedbackQueue[] = [
  {
    id: "queue-001",
    name: "Ungrouped",
    completedItems: 12,
    pendingItems: 0,
    createdAt: "2025.9.4",
    assignedTo: "John Smith",
    status: "finish",
    traces: [
      { id: "trace-001", name: "UI interface optimization suggestions.......", deliverables: "design_v1.html", evalId: "Eval 101", createdAt: "2025.09.18" },
      { id: "trace-002", name: "Data analysis report.......", deliverables: "analysis_v2.csv", evalId: "Eval 102", createdAt: "2025.09.19" },
    ],
  },
  {
    id: "queue-002",
    name: "Pending Evaluation",
    completedItems: 2,
    pendingItems: 1,
    createdAt: "2025.9.4",
    assignedTo: "Sarah Johnson",
    status: "process",
    traces: [
      { id: "trace-003", name: "API interface design review.......", deliverables: "api_design.md", evalId: "Eval 103", createdAt: "2025.09.20" },
    ],
  },
  {
    id: "queue-003",
    name: "Review Deliverables",
    completedItems: 17,
    pendingItems: 80,
    createdAt: "2025.9.2",
    assignedTo: "Mike Chen",
    status: "process",
    traces: [
      { id: "trace-004", name: "Performance optimization plan.......", deliverables: "performance_report.pdf", evalId: "Eval 104", createdAt: "2025.09.21" },
      { id: "trace-005", name: "Security assessment.......", deliverables: "security_audit.txt", evalId: "Eval 105", createdAt: "2025.09.22" },
    ],
  },
]

export default function FeedbackPage() {
  const router = useRouter()
  const [queues, setQueues] = useState<FeedbackQueue[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem("feedbackQueues") : null
    const list: FeedbackQueue[] = stored ? JSON.parse(stored) : mockQueues
    setQueues(list)
    
    // Initialize data to localStorage
    if (!stored && typeof window !== "undefined") {
      window.localStorage.setItem("feedbackQueues", JSON.stringify(mockQueues))
    }
  }, [])

  const totalPages = Math.ceil(queues.length / itemsPerPage)
  const paginatedQueues = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return queues.slice(start, end)
  }, [queues, currentPage])

  const handleQueueClick = (queueId: string) => {
    router.push(`/evaluation/feedback/queue/${queueId}`)
  }

  const handleProcessQueue = (queueId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/evaluation/feedback/queue/${queueId}`)
  }

  const handleFinish = (queueId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setQueues((prev) =>
      prev.map((q) => (q.id === queueId ? { ...q, status: "finish" as const, pendingItems: 0 } : q))
    )
    if (typeof window !== "undefined") {
      window.localStorage.setItem("feedbackQueues", JSON.stringify(queues.map((q) => (q.id === queueId ? { ...q, status: "finish" as const, pendingItems: 0 } : q))))
    }
  }

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
              <BreadcrumbPage>Human Feedback</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-foreground mt-4">Human Feedback</h1>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Completed Items</TableHead>
                <TableHead>Pending Items</TableHead>
                <TableHead>CreatedAt</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQueues.map((queue) => (
                <TableRow
                  key={queue.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleQueueClick(queue.id)}
                >
                  <TableCell className="font-medium">{queue.name}</TableCell>
                  <TableCell>{queue.completedItems}</TableCell>
                  <TableCell>{queue.pendingItems}</TableCell>
                  <TableCell>{queue.createdAt}</TableCell>
                  <TableCell>{queue.assignedTo}</TableCell>
                  <TableCell>
                    {queue.status === "finish" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => handleFinish(queue.id, e)}
                        className="bg-gray-100 hover:bg-gray-200"
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={(e) => handleProcessQueue(queue.id, e)}
                        className="bg-black text-white hover:bg-black/90"
                      >
                        Process queue
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) setCurrentPage(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage(page)
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </div>
  )
}
