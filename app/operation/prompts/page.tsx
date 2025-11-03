"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

type Prompt = {
  id: string
  prompt: string
  intent: string
  visibility: number
  status: "active" | "suggested" | "inactive"
}

const mockPrompts: Prompt[] = [
  {
    id: "p1",
    prompt: "What are the best project management tools for remote teams?",
    intent: "Informational",
    visibility: 72,
    status: "active",
  },
  {
    id: "p2",
    prompt: "Asana vs Monday.com: which is better for agile teams?",
    intent: "Comparative",
    visibility: 85,
    status: "active",
  },
  {
    id: "p3",
    prompt: "How to set up automated workflows in project management software?",
    intent: "Transactional",
    visibility: 92,
    status: "active",
  },
  {
    id: "p4",
    prompt: "Best practices for sprint planning in distributed teams",
    intent: "Informational",
    visibility: 68,
    status: "suggested",
  },
  {
    id: "p5",
    prompt: "Compare Jira and ClickUp features for software development",
    intent: "Comparative",
    visibility: 45,
    status: "inactive",
  },
]

export default function PromptsPage() {
  const [activeTab, setActiveTab] = useState<"active" | "suggested" | "inactive">("active")

  const filteredPrompts = mockPrompts.filter((p) => p.status === activeTab)

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/operation">Operation</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Prompts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-2xl font-semibold text-foreground mt-4">Prompt Management</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and monitor prompt performance</p>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="suggested">Suggested</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground w-[40%] sticky left-0 bg-muted/50">
                        Prompt
                      </th>
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground w-[30%]">
                        Intent
                      </th>
                      <th className="text-left p-4 font-medium text-sm text-muted-foreground w-[30%]">
                        Visibility
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPrompts.map((prompt) => (
                      <tr key={prompt.id} className="border-b border-border hover:bg-accent/50 transition-colors">
                        <td className="p-4 sticky left-0 bg-card w-[40%]">
                          <div className="line-clamp-3 text-sm leading-relaxed">
                            {prompt.prompt}
                          </div>
                        </td>
                        <td className="p-4 w-[30%]">
                          <span className="text-sm">{prompt.intent}</span>
                        </td>
                        <td className="p-4 w-[30%]">
                          <span className="text-sm font-semibold">{prompt.visibility}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
