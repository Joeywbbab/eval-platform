"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/benchmark/page-header"
import { StickyActionsBar } from "@/components/benchmark/sticky-actions-bar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SplitPane } from "@/components/benchmark/split-pane"
import {
  Plus,
  Upload,
  X,
  FileText,
  Code2,
  CheckCircle2,
  Trash2,
  Save,
  ChevronDown,
  Settings,
  ExternalLink,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type BenchmarkStatus = "not_started" | "ready_for_testing" | "tech_feedback" | "raul_feedback" | "retesting" | "closed"
type Difficulty = "easy" | "medium" | "hard"

interface BenchmarkData {
  name: string
  category: string
  version: string
  status: BenchmarkStatus
  difficulty: Difficulty
  initialEnvironment: Record<string, string>
  lazyQuery: string
  diligentQuery: string
  notes: string
  expectedOutput: string
  uploadedFiles: Array<{ name: string; size: string }>
  rubricDimensions: Array<{
    id: string
    title: string
    description: string
    weight: number
    maxScore: number
  }>
}

export default function BenchmarkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("info")
  const [isSaving, setIsSaving] = useState(false)

  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData>({
    name: "",
    category: "",
    version: "1.0.0",
    status: "not_started",
    difficulty: "medium",
    initialEnvironment: {},
    lazyQuery: "",
    diligentQuery: "",
    notes: "",
    expectedOutput: "",
    uploadedFiles: [],
    rubricDimensions: [
      {
        id: "1",
        title: "Accuracy",
        description: "Correctness of the output",
        weight: 40,
        maxScore: 4,
      },
      {
        id: "2",
        title: "Completeness",
        description: "Coverage of all required aspects",
        weight: 30,
        maxScore: 3,
      },
      {
        id: "3",
        title: "Efficiency",
        description: "Resource usage and performance",
        weight: 30,
        maxScore: 3,
      },
    ],
  })

  const [newEnvKey, setNewEnvKey] = useState("")
  const [newEnvValue, setNewEnvValue] = useState("")

  const [savedTemplates, setSavedTemplates] = useState<Array<{ id: string; name: string; template: string }>>([
    {
      id: "1",
      name: "AI Influencers",
      template: "Find influencers in the {{niche}} space with {{min_followers}}+ followers",
    },
  ])
  const [savedEnvironments, setSavedEnvironments] = useState<Array<{ id: string; name: string; content: string }>>([
    { id: "1", name: "Basic Web Search", content: '{"tools": ["web_search", "calculator"], "memory": true}' },
  ])
  const [templateNameInput, setTemplateNameInput] = useState("")
  const [environmentNameInput, setEnvironmentNameInput] = useState("")
  const [showSaveTemplateInput, setShowSaveTemplateInput] = useState(false)
  const [showSaveEnvironmentInput, setShowSaveEnvironmentInput] = useState(false)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [selectedEnvironmentId, setSelectedEnvironmentId] = useState<string | null>(null)
  const [preliminaryFiles, setPreliminaryFiles] = useState<File[]>([])
  const [expectedOutputFiles, setExpectedOutputFiles] = useState<File[]>([])
  const [additionalInfo, setAdditionalInfo] = useState("")

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Saved successfully",
      description: "Your benchmark has been saved.",
    })
  }

  const handleNext = () => {
    const tabs = ["info", "query", "rubric", "review"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    const tabs = ["info", "query", "rubric", "review"]
    const currentIndex = tabs.indexOf(activeTab)
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1])
    }
  }

  const addEnvironmentVariable = () => {
    if (newEnvKey && newEnvValue) {
      setBenchmarkData({
        ...benchmarkData,
        initialEnvironment: {
          ...benchmarkData.initialEnvironment,
          [newEnvKey]: newEnvValue,
        },
      })
      setNewEnvKey("")
      setNewEnvValue("")
    }
  }

  const removeEnvironmentVariable = (key: string) => {
    const newEnv = { ...benchmarkData.initialEnvironment }
    delete newEnv[key]
    setBenchmarkData({ ...benchmarkData, initialEnvironment: newEnv })
  }

  const handleSaveTemplate = () => {
    if (showSaveTemplateInput && templateNameInput.trim()) {
      const newTemplate = {
        id: Date.now().toString(),
        name: templateNameInput,
        template: benchmarkData.diligentQuery,
      }
      setSavedTemplates([...savedTemplates, newTemplate])
      setTemplateNameInput("")
      setShowSaveTemplateInput(false)
      setSelectedTemplateId(newTemplate.id)
    } else {
      setShowSaveTemplateInput(true)
    }
  }

  const handleSaveEnvironment = () => {
    if (showSaveEnvironmentInput && environmentNameInput.trim()) {
      const newEnvironment = {
        id: Date.now().toString(),
        name: environmentNameInput,
        content: JSON.stringify(benchmarkData.initialEnvironment),
      }
      setSavedEnvironments([...savedEnvironments, newEnvironment])
      setEnvironmentNameInput("")
      setShowSaveEnvironmentInput(false)
      setSelectedEnvironmentId(newEnvironment.id)
    } else {
      setShowSaveEnvironmentInput(true)
    }
  }

  const handleSelectTemplate = (templateId: string) => {
    const template = savedTemplates.find((t) => t.id === templateId)
    if (template) {
      setBenchmarkData({ ...benchmarkData, diligentQuery: template.template })
      setSelectedTemplateId(templateId)
    }
  }

  const handleSelectEnvironment = (envId: string) => {
    const env = savedEnvironments.find((e) => e.id === envId)
    if (env) {
      try {
        const parsed = JSON.parse(env.content)
        setBenchmarkData({ ...benchmarkData, initialEnvironment: parsed })
        setSelectedEnvironmentId(envId)
      } catch (e) {
        console.error("Failed to parse environment", e)
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "preliminary" | "expected") => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      if (type === "preliminary") {
        setPreliminaryFiles([...preliminaryFiles, ...files])
      } else {
        setExpectedOutputFiles([...expectedOutputFiles, ...files])
      }
    }
  }

  const removeFile = (index: number, type: "preliminary" | "expected") => {
    if (type === "preliminary") {
      setPreliminaryFiles(preliminaryFiles.filter((_, i) => i !== index))
    } else {
      setExpectedOutputFiles(expectedOutputFiles.filter((_, i) => i !== index))
    }
  }

  const addDimension = () => {
    const newDimension = {
      id: Date.now().toString(),
      title: "New Dimension",
      description: "Enter description",
      weight: 0,
      maxScore: 1,
    }
    setBenchmarkData({
      ...benchmarkData,
      rubricDimensions: [...benchmarkData.rubricDimensions, newDimension],
    })
  }

  const removeDimension = (id: string) => {
    setBenchmarkData({
      ...benchmarkData,
      rubricDimensions: benchmarkData.rubricDimensions.filter((dim) => dim.id !== id),
    })
  }

  const totalWeight = benchmarkData.rubricDimensions.reduce((sum, dim) => sum + dim.weight, 0)
  const totalScore = benchmarkData.rubricDimensions.reduce((sum, dim) => sum + dim.maxScore, 0)

  return (
    <div className="flex h-full flex-col">
      <PageHeader
        name={benchmarkData.name}
        category={benchmarkData.category}
        version={benchmarkData.version}
        status={benchmarkData.status}
        difficulty={benchmarkData.difficulty}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b border-border bg-card px-6">
          <TabsList className="h-12 bg-transparent">
            <TabsTrigger value="info" className="data-[state=active]:bg-accent">
              Info
            </TabsTrigger>
            <TabsTrigger value="query" className="data-[state=active]:bg-accent">
              Query
            </TabsTrigger>
            <TabsTrigger value="rubric" className="data-[state=active]:bg-accent">
              Rubric
            </TabsTrigger>
            <TabsTrigger value="review" className="data-[state=active]:bg-accent">
              Review
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 overflow-auto">
          {/* Info Tab */}
          <TabsContent value="info" className="mt-0 h-full">
            <div className="px-12 md:px-24 pt-12 pb-24">
              <div className="max-w-3xl space-y-10">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-base leading-7">
                      Benchmark Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., Code Generation Benchmark"
                      value={benchmarkData.name}
                      onChange={(e) => setBenchmarkData({ ...benchmarkData, name: e.target.value })}
                      className="text-base"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-base leading-7">
                      Category
                    </Label>
                    <Select
                      value={benchmarkData.category}
                      onValueChange={(value) => setBenchmarkData({ ...benchmarkData, category: value })}
                    >
                      <SelectTrigger id="category" className="text-base">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="code-generation">Code Generation</SelectItem>
                        <SelectItem value="qa">Question Answering</SelectItem>
                        <SelectItem value="translation">Translation</SelectItem>
                        <SelectItem value="reasoning">Reasoning</SelectItem>
                        <SelectItem value="creative">Creative Writing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="version" className="text-base leading-7">
                      Version
                    </Label>
                    <Select
                      value={benchmarkData.version}
                      onValueChange={(value) => setBenchmarkData({ ...benchmarkData, version: value })}
                    >
                      <SelectTrigger id="version" className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0.0">1.0.0</SelectItem>
                        <SelectItem value="1.1.0">1.1.0</SelectItem>
                        <SelectItem value="2.0.0">2.0.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="status" className="text-base leading-7">
                      Status
                    </Label>
                    <Select
                      value={benchmarkData.status}
                      onValueChange={(value: BenchmarkStatus) => setBenchmarkData({ ...benchmarkData, status: value })}
                    >
                      <SelectTrigger id="status" className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not_started">Not Started</SelectItem>
                        <SelectItem value="ready_for_testing">Ready for Testing</SelectItem>
                        <SelectItem value="tech_feedback">Tech Feedback</SelectItem>
                        <SelectItem value="raul_feedback">Raul Feedback</SelectItem>
                        <SelectItem value="retesting">Retesting</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="difficulty" className="text-base leading-7">
                      Difficulty
                    </Label>
                    <Select
                      value={benchmarkData.difficulty}
                      onValueChange={(value: Difficulty) => setBenchmarkData({ ...benchmarkData, difficulty: value })}
                    >
                      <SelectTrigger id="difficulty" className="text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
            <StickyActionsBar onSave={handleSave} onNext={handleNext} showPrevious={false} isSaving={isSaving} />
          </TabsContent>

          {/* Query Tab */}
          <TabsContent value="query" className="mt-0 h-full">
            <div className="px-12 md:px-24 pt-12 pb-24">
              <div className="max-w-7xl">
                <SplitPane
                  left={
                    <div className="space-y-10">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base tracking-[-0.01em] leading-tight">
                            Preliminary Materials
                          </CardTitle>
                          <CardDescription className="text-base leading-7 mt-1">
                            Upload supporting documents or context files
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 bg-accent/20">
                            {preliminaryFiles.length === 0 ? (
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="p-3 bg-accent rounded-full">
                                  <Upload className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium leading-7">Upload preliminary materials</p>
                                  <p className="text-xs text-muted-foreground leading-7 mt-1">
                                    Drag and drop files here or click to browse
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  id="preliminary-upload"
                                  className="hidden"
                                  multiple
                                  onChange={(e) => handleFileUpload(e, "preliminary")}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById("preliminary-upload")?.click()}
                                >
                                  Select Files
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium leading-7">
                                      {preliminaryFiles.length} file(s) selected
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setPreliminaryFiles([])}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Remove All
                                  </Button>
                                </div>
                                <ul className="space-y-2">
                                  {preliminaryFiles.map((file, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center justify-between bg-accent px-3 py-2 rounded-md"
                                    >
                                      <span className="text-xs truncate leading-7">{file.name}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground leading-7">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeFile(index, "preliminary")}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="additional-info" className="text-base leading-7">
                              Additional Information
                            </Label>
                            <Textarea
                              id="additional-info"
                              placeholder="Enter any additional context or information about the preliminary materials..."
                              className="min-h-[80px] text-base leading-7"
                              value={additionalInfo}
                              onChange={(e) => setAdditionalInfo(e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground leading-7 mt-1">
                              Provide any relevant details that will help with understanding the uploaded materials
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base tracking-[-0.01em] leading-tight">Query Area</CardTitle>
                          <CardDescription className="text-base leading-7 mt-1">
                            Define the lazy and diligent query prompts
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-1.5">
                            <Label htmlFor="lazy-query" className="text-base leading-7">
                              Lazy Query
                            </Label>
                            <Textarea
                              id="lazy-query"
                              placeholder="Enter a simple query, e.g., 'Find influential people in tech'"
                              className="min-h-[120px] font-mono text-sm leading-7"
                              value={benchmarkData.lazyQuery}
                              onChange={(e) => setBenchmarkData({ ...benchmarkData, lazyQuery: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground leading-7 mt-1">
                              A simpler, less detailed query
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor="diligent-query" className="text-base leading-7">
                              Diligent Query
                            </Label>
                            <Textarea
                              id="diligent-query"
                              placeholder="Enter a detailed query with variables like {{variable_name}}"
                              className="min-h-[120px] font-mono text-sm leading-7"
                              value={benchmarkData.diligentQuery}
                              onChange={(e) => setBenchmarkData({ ...benchmarkData, diligentQuery: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground leading-7 mt-1">
                              A more detailed, specific query with template variables
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-base tracking-[-0.01em] leading-tight">
                              Expected Output
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={() => {
                                // Simulate opening deployed environment
                                window.open("https://example.com/deployed-output/benchmark-123", "_blank")
                                toast({
                                  title: "Opening deployed environment",
                                  description: "Viewing expected output in production",
                                })
                              }}
                            >
                              <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-orange-500" />
                            </Button>
                          </div>
                          <CardDescription className="text-base leading-7 mt-1">
                            Describe or upload examples of the expected output
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="expected-output" className="text-base leading-7">
                              Output Description
                            </Label>
                            <Textarea
                              id="expected-output"
                              placeholder="Describe what the expected output should look like..."
                              className="min-h-[100px] font-mono text-sm leading-7"
                              value={benchmarkData.expectedOutput}
                              onChange={(e) => setBenchmarkData({ ...benchmarkData, expectedOutput: e.target.value })}
                            />
                          </div>

                          <div className="border-2 border-dashed border-border rounded-lg p-6 bg-accent/20">
                            {expectedOutputFiles.length === 0 ? (
                              <div className="flex flex-col items-center justify-center space-y-3">
                                <div className="p-3 bg-accent rounded-full">
                                  <Upload className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium leading-7">Upload expected output examples</p>
                                  <p className="text-xs text-muted-foreground leading-7 mt-1">
                                    Drag and drop files here or click to browse
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  id="expected-output-upload"
                                  className="hidden"
                                  multiple
                                  onChange={(e) => handleFileUpload(e, "expected")}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => document.getElementById("expected-output-upload")?.click()}
                                >
                                  Select Files
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-medium leading-7">
                                      {expectedOutputFiles.length} file(s) selected
                                    </span>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setExpectedOutputFiles([])}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    Remove All
                                  </Button>
                                </div>
                                <ul className="space-y-2">
                                  {expectedOutputFiles.map((file, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center justify-between bg-accent px-3 py-2 rounded-md"
                                    >
                                      <span className="text-xs truncate leading-7">{file.name}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground leading-7">
                                          {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                        <Button variant="ghost" size="sm" onClick={() => removeFile(index, "expected")}>
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground leading-7">
                            Optional: Upload example files showing expected output format
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  }
                  right={
                    <div className="ml-6 space-y-6">
                      <Card className="sticky top-6">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base tracking-[-0.01em] leading-tight">
                              Template Preview
                            </CardTitle>
                            <div className="flex gap-2">
                              <div className="relative">
                                <button
                                  className="inline-flex items-center px-3 py-1.5 text-sm bg-accent hover:bg-accent/80 rounded-md"
                                  onClick={() => {
                                    const selectElement = document.getElementById(
                                      "template-select",
                                    ) as HTMLSelectElement
                                    if (selectElement) selectElement.click()
                                  }}
                                >
                                  <span>Templates</span>
                                  <ChevronDown className="ml-1 h-3 w-3" />
                                </button>
                                <select
                                  id="template-select"
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                  value={selectedTemplateId || ""}
                                  onChange={(e) => handleSelectTemplate(e.target.value)}
                                >
                                  <option value="" disabled>
                                    Select template
                                  </option>
                                  {savedTemplates.map((template) => (
                                    <option key={template.id} value={template.id}>
                                      {template.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {showSaveTemplateInput ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="text"
                                    className="h-8 w-32 text-sm"
                                    placeholder="Template name"
                                    value={templateNameInput}
                                    onChange={(e) => setTemplateNameInput(e.target.value)}
                                  />
                                  <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
                                    Save
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setShowSaveTemplateInput(false)}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" onClick={handleSaveTemplate}>
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                              )}
                            </div>
                          </div>
                          {/* Changed to escaped curly braces for the lint error fix */}
                          <CardDescription className="text-base leading-7 mt-1">
                            {"Variables like {{variable}} will be highlighted"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="rounded-md bg-accent/50 p-4 font-mono text-sm space-y-4 leading-7 min-h-[200px]">
                            {benchmarkData.lazyQuery || benchmarkData.diligentQuery ? (
                              <>
                                {benchmarkData.lazyQuery && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-2">Lazy Query:</p>
                                    <p className="whitespace-pre-wrap">
                                      {benchmarkData.lazyQuery.split(/(\{\{[^}]+\}\})/).map((part, i) =>
                                        part.match(/\{\{[^}]+\}\}/) ? (
                                          <span key={i} className="bg-orange-500/20 text-orange-500 px-1 rounded">
                                            {part}
                                          </span>
                                        ) : (
                                          part
                                        ),
                                      )}
                                    </p>
                                  </div>
                                )}
                                {benchmarkData.diligentQuery && (
                                  <div>
                                    <p className="text-xs text-muted-foreground mb-2">Diligent Query:</p>
                                    <p className="whitespace-pre-wrap">
                                      {benchmarkData.diligentQuery.split(/(\{\{[^}]+\}\})/).map((part, i) =>
                                        part.match(/\{\{[^}]+\}\}/) ? (
                                          <span key={i} className="bg-orange-500/20 text-orange-500 px-1 rounded">
                                            {part}
                                          </span>
                                        ) : (
                                          part
                                        ),
                                      )}
                                    </p>
                                  </div>
                                )}
                              </>
                            ) : (
                              <p className="text-muted-foreground text-center py-8">
                                Enter queries to see preview with variable highlighting
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base tracking-[-0.01em] leading-tight">
                              Initial Environment
                            </CardTitle>
                            <div className="flex gap-2">
                              <div className="relative">
                                <button
                                  className="inline-flex items-center px-3 py-1.5 text-sm bg-accent hover:bg-accent/80 rounded-md"
                                  onClick={() => {
                                    const selectElement = document.getElementById(
                                      "environment-select",
                                    ) as HTMLSelectElement
                                    if (selectElement) selectElement.click()
                                  }}
                                >
                                  <span>Environments</span>
                                  <ChevronDown className="ml-1 h-3 w-3" />
                                </button>
                                <select
                                  id="environment-select"
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full"
                                  value={selectedEnvironmentId || ""}
                                  onChange={(e) => handleSelectEnvironment(e.target.value)}
                                >
                                  <option value="" disabled>
                                    Select environment
                                  </option>
                                  {savedEnvironments.map((env) => (
                                    <option key={env.id} value={env.id}>
                                      {env.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              {showSaveEnvironmentInput ? (
                                <div className="flex items-center gap-1">
                                  <Input
                                    type="text"
                                    className="h-8 w-32 text-sm"
                                    placeholder="Environment name"
                                    value={environmentNameInput}
                                    onChange={(e) => setEnvironmentNameInput(e.target.value)}
                                  />
                                  <Button variant="outline" size="sm" onClick={handleSaveEnvironment}>
                                    Save
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setShowSaveEnvironmentInput(false)}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" onClick={handleSaveEnvironment}>
                                  <Save className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                              )}
                            </div>
                          </div>
                          <CardDescription className="text-base leading-7 mt-1">
                            Key-value pairs for the execution environment
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            {Object.entries(benchmarkData.initialEnvironment).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-2 p-2 rounded-md bg-accent/50">
                                <code className="flex-1 text-sm leading-7">
                                  {key}: {value}
                                </code>
                                <Button variant="ghost" size="sm" onClick={() => removeEnvironmentVariable(key)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            {Object.keys(benchmarkData.initialEnvironment).length === 0 && (
                              <p className="text-sm text-muted-foreground text-center py-4 leading-7">
                                No environment variables added
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Key"
                              value={newEnvKey}
                              onChange={(e) => setNewEnvKey(e.target.value)}
                              className="text-sm"
                            />
                            <Input
                              placeholder="Value"
                              value={newEnvValue}
                              onChange={(e) => setNewEnvValue(e.target.value)}
                              className="text-sm"
                            />
                            <Button onClick={addEnvironmentVariable} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground leading-7">
                            <Settings className="h-3 w-3 mr-1" />
                            <span>Define the initial environment configuration for the agent</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  }
                />
              </div>
            </div>
            <StickyActionsBar onSave={handleSave} onNext={handleNext} onPrevious={handlePrevious} isSaving={isSaving} />
          </TabsContent>

          {/* Rubric Tab */}
          <TabsContent value="rubric" className="mt-0 h-full">
            <div className="px-12 md:px-24 pt-12 pb-24">
              <div className="max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold tracking-[-0.01em] leading-tight">Scoring Dimensions</h3>
                      <Button variant="outline" size="sm" onClick={addDimension}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Dimension
                      </Button>
                    </div>

                    {benchmarkData.rubricDimensions.map((dimension, index) => (
                      <Card key={dimension.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={dimension.title}
                                onChange={(e) => {
                                  const newDimensions = [...benchmarkData.rubricDimensions]
                                  newDimensions[index].title = e.target.value
                                  setBenchmarkData({ ...benchmarkData, rubricDimensions: newDimensions })
                                }}
                                className="font-semibold text-base"
                              />
                              <Textarea
                                value={dimension.description}
                                onChange={(e) => {
                                  const newDimensions = [...benchmarkData.rubricDimensions]
                                  newDimensions[index].description = e.target.value
                                  setBenchmarkData({ ...benchmarkData, rubricDimensions: newDimensions })
                                }}
                                className="text-sm leading-7"
                                rows={2}
                              />
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeDimension(dimension.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-base leading-7">Weight (%)</Label>
                              <Input
                                type="number"
                                value={dimension.weight}
                                onChange={(e) => {
                                  const newDimensions = [...benchmarkData.rubricDimensions]
                                  newDimensions[index].weight = Number.parseInt(e.target.value) || 0
                                  setBenchmarkData({ ...benchmarkData, rubricDimensions: newDimensions })
                                }}
                                className="text-base"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-base leading-7">Score</Label>
                              <Input
                                type="number"
                                value={dimension.maxScore}
                                onChange={(e) => {
                                  const newDimensions = [...benchmarkData.rubricDimensions]
                                  newDimensions[index].maxScore = Number.parseInt(e.target.value) || 0
                                  setBenchmarkData({ ...benchmarkData, rubricDimensions: newDimensions })
                                }}
                                className="text-base"
                              />
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-border space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground leading-7">Weight per point</span>
                              <span className="font-medium text-orange-500 leading-7">
                                {dimension.maxScore > 0 ? (dimension.weight / dimension.maxScore).toFixed(2) : 0}% per
                                point
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground leading-7">Total weighted contribution</span>
                              <span className="font-medium text-orange-500 leading-7">
                                {((dimension.weight / 100) * dimension.maxScore).toFixed(2)} pts
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="ml-6 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base tracking-[-0.01em] leading-tight">Score Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm leading-7">
                            <span className="text-muted-foreground">Total Weight</span>
                            <span
                              className={
                                totalWeight === 100 ? "text-green-500 font-semibold" : "text-destructive font-semibold"
                              }
                            >
                              {totalWeight}%
                            </span>
                          </div>
                          <div className="flex justify-between text-sm leading-7">
                            <span className="text-muted-foreground">Total Score</span>
                            <span className="font-semibold">{totalScore} points</span>
                          </div>
                          <div className="flex justify-between text-sm leading-7 pt-2 border-t border-border">
                            <span className="text-muted-foreground">Total Weighted Score</span>
                            <span className="font-semibold text-orange-500">
                              {benchmarkData.rubricDimensions
                                .reduce((sum, dim) => sum + (dim.weight / 100) * dim.maxScore, 0)
                                .toFixed(2)}{" "}
                              pts
                            </span>
                          </div>
                        </div>

                        {totalWeight !== 100 && (
                          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                            <p className="text-xs text-destructive leading-7">Warning: Total weight must equal 100%</p>
                          </div>
                        )}

                        <div className="space-y-3">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Dimension Breakdown
                          </p>
                          {benchmarkData.rubricDimensions.map((dimension) => {
                            const weightedScore = (dimension.weight / 100) * dimension.maxScore
                            return (
                              <div key={dimension.id} className="space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">{dimension.title}</span>
                                  <span className="font-medium text-orange-500">{weightedScore.toFixed(2)} pts</span>
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>{dimension.weight}% weight</span>
                                  <span>{dimension.maxScore} score</span>
                                </div>
                                <div className="h-2 rounded-full bg-accent overflow-hidden">
                                  <div className="h-full bg-orange-500" style={{ width: `${dimension.weight}%` }} />
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base tracking-[-0.01em] leading-tight">Export</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <Code2 className="h-4 w-4 mr-2" />
                          Export as JSON
                        </Button>
                        <Button variant="outline" className="w-full justify-start bg-transparent">
                          <FileText className="h-4 w-4 mr-2" />
                          Export as Markdown
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
            <StickyActionsBar onSave={handleSave} onNext={handleNext} onPrevious={handlePrevious} isSaving={isSaving} />
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="mt-0 h-full">
            <div className="px-12 md:px-24 pt-12 pb-24">
              <div className="max-w-3xl space-y-10">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="tracking-[-0.01em] leading-tight">Basic Information</CardTitle>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground leading-7">Name</p>
                        <p className="font-medium text-base leading-7">{benchmarkData.name || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground leading-7">Category</p>
                        <p className="font-medium text-base leading-7">{benchmarkData.category || "Not set"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground leading-7">Version</p>
                        <p className="font-medium text-base leading-7">v{benchmarkData.version}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground leading-7">Status</p>
                        <Badge variant="outline">
                          {benchmarkData.status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground leading-7">Difficulty</p>
                        <Badge variant="outline">{benchmarkData.difficulty}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="tracking-[-0.01em] leading-tight">Query Configuration</CardTitle>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 leading-7">Initial Environment</p>
                      <div className="rounded-md bg-accent/50 p-3 font-mono text-sm leading-7">
                        {Object.keys(benchmarkData.initialEnvironment).length > 0 ? (
                          Object.entries(benchmarkData.initialEnvironment).map(([key, value]) => (
                            <div key={key}>
                              {key}: {value}
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground">No environment variables</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 leading-7">Lazy Query</p>
                      <div className="rounded-md bg-accent/50 p-3 font-mono text-sm whitespace-pre-wrap leading-7">
                        {benchmarkData.lazyQuery || <span className="text-muted-foreground">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 leading-7">Diligent Query</p>
                      <div className="rounded-md bg-accent/50 p-3 font-mono text-sm whitespace-pre-wrap leading-7">
                        {benchmarkData.diligentQuery || <span className="text-muted-foreground">Not set</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2 leading-7">Expected Output</p>
                      <div className="rounded-md bg-accent/50 p-3 font-mono text-sm whitespace-pre-wrap leading-7">
                        {benchmarkData.expectedOutput || <span className="text-muted-foreground">Not set</span>}
                      </div>
                      {expectedOutputFiles.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <p className="text-xs text-muted-foreground leading-7">Attached files:</p>
                          {expectedOutputFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs leading-7">
                              <FileText className="h-3 w-3 text-orange-500" />
                              <span>{file.name}</span>
                              <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="tracking-[-0.01em] leading-tight">Scoring Rubric</CardTitle>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {benchmarkData.rubricDimensions.map((dimension) => (
                        <div
                          key={dimension.id}
                          className="flex items-start justify-between p-3 rounded-md bg-accent/50"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-base leading-7">{dimension.title}</p>
                            <p className="text-sm text-muted-foreground leading-7">{dimension.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium leading-7">{dimension.weight}%</p>
                            <p className="text-xs text-muted-foreground leading-7">{dimension.maxScore} pts</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between">
                      <span className="font-medium text-base leading-7">Total</span>
                      <div className="text-right">
                        <span className="font-semibold text-base leading-7">{totalWeight}%</span>
                        <span className="text-muted-foreground mx-2">•</span>
                        <span className="font-semibold text-base leading-7">{totalScore} points</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20 bg-green-500/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 tracking-[-0.01em] leading-tight">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Ready to Submit
                    </CardTitle>
                    <CardDescription className="text-base leading-7 mt-1">
                      Review all information above. Once submitted, this benchmark will be available for evaluation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-3">
                    <Button onClick={() => setActiveTab("info")} variant="outline">
                      Back to Edit
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">Submit Benchmark</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <StickyActionsBar onSave={handleSave} onPrevious={handlePrevious} showNext={false} isSaving={isSaving} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
