"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "./status-badge"
import { DifficultyBadge } from "./difficulty-badge"
import { VersionPill } from "./version-pill"
import { MoreHorizontal, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Benchmark } from "@/lib/types/benchmark"

interface BenchmarksTableProps {
  benchmarks: Benchmark[]
}

export function BenchmarksTable({ benchmarks }: BenchmarksTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benchmarks.map((benchmark) => (
            <TableRow key={benchmark.id}>
              <TableCell>
                <Link href={`/benchmarks/${benchmark.id}`} className="font-medium hover:text-orange-500">
                  {benchmark.name}
                </Link>
              </TableCell>
              <TableCell>{benchmark.category}</TableCell>
              <TableCell>
                <VersionPill version={benchmark.version} />
              </TableCell>
              <TableCell>
                <StatusBadge status={benchmark.status} />
              </TableCell>
              <TableCell>
                <DifficultyBadge difficulty={benchmark.difficulty} />
              </TableCell>
              <TableCell>{benchmark.owner}</TableCell>
              <TableCell className="text-muted-foreground">{benchmark.updated}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/benchmarks/${benchmark.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    <DropdownMenuItem>Archive</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
