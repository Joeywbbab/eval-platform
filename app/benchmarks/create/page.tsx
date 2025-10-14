"use client"

// This page handles the 4-step benchmark creation flow
// Steps: Info → Query → Rubric → Review
// For viewing existing benchmarks, see /app/benchmarks/[id]/page.tsx

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { StepIndicator } from "@/components/benchmark/step-indicator"
import { StickyActionsBar } from "@/components/benchmark/sticky-actions-bar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SplitPane } from "@/components/benchmark/split-pane"
import { Plus, Upload, X, FileText, Trash2, Save, ChevronDown, Settings, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BenchmarkData, BenchmarkStatus, Difficulty, Template, Environment } from "@/lib/types/benchmark"
import {
  BENCHMARK_STEPS,
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  DIFFICULTY_OPTIONS,
  DEFAULT_RUBRIC_DIMENSIONS,
} from "@/lib/constants/benchmark"
import { calculateTotalScore, formatFileSize, validateBenchmarkData, generateId } from "@/lib/utils/benchmark"

export default function NewBenchmarkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSaving, setIsSaving] = useState(false)

  // Benchmark data state
  const [benchmarkData, setBenchmarkData] = useState<BenchmarkData>({
    taskBrief: "",
    category: "",
    status: "not_started",
    difficulty: "medium",
    environment: "",
    lazyQuery: "",
    diligentQuery: "",
    notes: "",
    expectedOutput: "",
    uploadedFiles: [],
    rubricDimensions: DEFAULT_RUBRIC_DIMENSIONS,
  })

  // Template and environment state
  const [savedTemplates, setSavedTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "AI Influencers",
      template: "Find influencers in the {{niche}} space with {{min_followers}}+ followers",
    },
  ])
  const [savedEnvironments, setSavedEnvironments] = useState<Environment[]>([
    { id: "1", name: "Basic Web Search", content: "search tools enabled" },
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
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast({
      title: "Saved successfully",
      description: "Your benchmark has been saved.",
    })
  }

  const handleNext = () => {
    if (currentStep < BENCHMARK_STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    // Validate benchmark data before submission
    const validation = validateBenchmarkData(benchmarkData)

    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(", "),
        variant: "destructive",
      })
      return
    }

    // TODO: Replace with actual API call
    console.log("Submitting benchmark:", benchmarkData)

    toast({
      title: "Benchmark submitted",
      description: "Your benchmark has been created successfully.",
    })
    router.push("/benchmarks")
  }

  const handleSaveTemplate = () => {
    if (showSaveTemplateInput && templateNameInput.trim()) {
      const newTemplate: Template = {
        id: generateId(),
        name: templateNameInput,
        template: benchmarkData.diligentQuery,
      }
      setSavedTemplates([...savedTemplates, newTemplate])
      setTemplateNameInput("")
      setShowSaveTemplateInput(false)
      setSelectedTemplateId(newTemplate.id)
      toast({
        title: "Template saved",
        description: `Template "${templateNameInput}" has been saved.`,
      })
    } else {
      setShowSaveTemplateInput(true)
    }
  }

  const handleSaveEnvironment = () => {
    if (showSaveEnvironmentInput && environmentNameInput.trim()) {
      const newEnvironment: Environment = {
        id: generateId(),
        name: environmentNameInput,
        content: benchmarkData.environment,
      }
      setSavedEnvironments([...savedEnvironments, newEnvironment])
      setEnvironmentNameInput("")
      setShowSaveEnvironmentInput(false)
      setSelectedEnvironmentId(newEnvironment.id)
      toast({
        title: "Environment saved",
        description: `Environment "${environmentNameInput}" has been saved.`,
      })
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
      setBenchmarkData({
        ...benchmarkData,
        environment: env.content,
      })
      setSelectedEnvironmentId(envId)
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
      id: generateId(),
      title: "New Dimension",
      description: "Enter description",
      maxScore: 1,
    }
    setBenchmarkData({
      ...benchmarkData,
      rubricDimensions: [...benchmarkData.rubricDimensions, newDimension],
    })
  }

  const removeDimension = (id: string) => {
    if (benchmarkData.rubricDimensions.length <= 1) {
      toast({
        title: "Cannot remove dimension",
        description: "At least one dimension is required.",
        variant: "destructive",
      })
      return
    }
    setBenchmarkData({
      ...benchmarkData,
      rubricDimensions: benchmarkData.rubricDimensions.filter((dim) => dim.id !== id),
    })
  }

  const totalScore = calculateTotalScore(benchmarkData.rubricDimensions)

  return (
    <div className="flex h-full flex-col">
      <StepIndicator currentStep={currentStep} steps={BENCHMARK_STEPS} />

      <div className="flex-1 overflow-auto">
        {/* Info Step */}
        {currentStep === 1 && (
          <div className="px-12 md:px-24 pt-12 pb-24">
            <div className="max-w-3xl space-y-10">
              <div className="space-y-6">
                <div className="space-y-1.5">
                  <Label htmlFor="taskBrief" className="text-base leading-7">
                    Task Brief <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="taskBrief"
                    placeholder="e.g., Find KOL influencers in tech space"
                    value={benchmarkData.taskBrief}
                    onChange={(e) => setBenchmarkData({ ...benchmarkData, taskBrief: e.target.value })}
                    className="text-base"
                  />
                  <p className="text-xs text-muted-foreground leading-7 mt-1">
                    A brief description of the benchmark task
                  </p>
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
                      {CATEGORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
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
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
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
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Query Step */}
        {currentStep === 2 && (
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
                          <p className="text-xs text-muted-foreground leading-7 mt-1">A simpler, less detailed query</p>
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
                          <CardTitle className="text-base tracking-[-0.01em] leading-tight">Expected Output</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
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
                  <div className="space-y-6">
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-sm tracking-[-0.01em] leading-tight">Template Preview</CardTitle>
                          <div className="flex gap-1 flex-shrink-0">
                            <div className="relative">
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md"
                                onClick={() => {
                                  const selectElement = document.getElementById("template-select") as HTMLSelectElement
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
                                  className="h-7 w-24 text-xs"
                                  placeholder="Name"
                                  value={templateNameInput}
                                  onChange={(e) => setTemplateNameInput(e.target.value)}
                                />
                                <Button variant="outline" size="sm" className="h-7 px-2" onClick={handleSaveTemplate}>
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setShowSaveTemplateInput(false)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" className="h-7 px-2" onClick={handleSaveTemplate}>
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-xs leading-5 mt-1">
                          {"Variables like {{variable}} will be highlighted"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="rounded-md bg-accent/50 p-3 font-mono text-xs space-y-3 leading-5 max-h-[300px] overflow-y-auto">
                          {benchmarkData.lazyQuery || benchmarkData.diligentQuery ? (
                            <>
                              {benchmarkData.lazyQuery && (
                                <div>
                                  <p className="text-xs text-muted-foreground mb-1 font-sans">Lazy Query:</p>
                                  <p className="whitespace-pre-wrap break-words">
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
                                  <p className="text-xs text-muted-foreground mb-1 font-sans">Diligent Query:</p>
                                  <p className="whitespace-pre-wrap break-words">
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
                            <p className="text-muted-foreground text-center py-6 text-xs font-sans">
                              Enter queries to see preview with variable highlighting
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-sm tracking-[-0.01em] leading-tight">
                            Initial Environment
                          </CardTitle>
                          <div className="flex gap-1 flex-shrink-0">
                            <div className="relative">
                              <button
                                className="inline-flex items-center px-2 py-1 text-xs bg-accent hover:bg-accent/80 rounded-md"
                                onClick={() => {
                                  const selectElement = document.getElementById(
                                    "environment-select",
                                  ) as HTMLSelectElement
                                  if (selectElement) selectElement.click()
                                }}
                              >
                                <span>Envs</span>
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
                                  className="h-7 w-24 text-xs"
                                  placeholder="Name"
                                  value={environmentNameInput}
                                  onChange={(e) => setEnvironmentNameInput(e.target.value)}
                                />
                                <Button variant="outline" size="sm" className="h-7 px-2" onClick={handleSaveEnvironment}>
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => setShowSaveEnvironmentInput(false)}>
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm" className="h-7 px-2" onClick={handleSaveEnvironment}>
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardDescription className="text-xs leading-5 mt-1">
                          Define the environment configuration
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <Textarea
                          id="environment"
                          placeholder="Describe the environment configuration..."
                          value={benchmarkData.environment}
                          onChange={(e) => setBenchmarkData({ ...benchmarkData, environment: e.target.value })}
                          className="text-xs min-h-[100px] leading-5 resize-none"
                        />
                        <div className="flex items-center text-xs text-muted-foreground leading-5">
                          <Settings className="h-3 w-3 mr-1 flex-shrink-0" />
                          <span>Define initial environment for the agent</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                }
              />
            </div>
          </div>
        )}

        {/* Rubric Step */}
        {currentStep === 3 && (
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
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="ml-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base tracking-[-0.01em] leading-tight">Score Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm leading-7">
                          <span className="text-muted-foreground">Total Score</span>
                          <span className="font-semibold text-orange-500">{totalScore} points</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Dimension Breakdown
                        </p>
                        {benchmarkData.rubricDimensions.map((dimension) => (
                          <div key={dimension.id} className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">{dimension.title}</span>
                              <span className="font-medium text-orange-500">{dimension.maxScore} pts</span>
                            </div>
                            <div className="h-2 rounded-full bg-accent overflow-hidden">
                              <div
                                className="h-full bg-orange-500"
                                style={{ width: `${(dimension.maxScore / totalScore) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Step */}
        {currentStep === 4 && (
          <div className="px-12 md:px-24 pt-12 pb-24">
            <div className="max-w-3xl space-y-10">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="tracking-[-0.01em] leading-tight">Basic Information</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)}>
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground leading-7">Task Brief</p>
                      <p className="font-medium text-base leading-7">{benchmarkData.taskBrief || "Not set"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground leading-7">Category</p>
                      <p className="font-medium text-base leading-7">{benchmarkData.category || "Not set"}</p>
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
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)}>
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 leading-7">Initial Environment</p>
                    <div className="rounded-md bg-accent/50 p-3">
                      <span className="text-sm font-mono leading-7">
                        {benchmarkData.environment || <span className="text-muted-foreground">Not set</span>}
                      </span>
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
                    <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)}>
                      Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {benchmarkData.rubricDimensions.map((dimension) => (
                      <div key={dimension.id} className="flex items-start justify-between p-3 rounded-md bg-accent/50">
                        <div className="flex-1">
                          <p className="font-medium text-base leading-7">{dimension.title}</p>
                          <p className="text-sm text-muted-foreground leading-7">{dimension.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium leading-7">{dimension.maxScore} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex justify-between">
                    <span className="font-medium text-base leading-7">Total Score</span>
                    <span className="font-semibold text-base leading-7">{totalScore} points</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <StickyActionsBar
        onSave={handleSave}
        onNext={currentStep < BENCHMARK_STEPS.length ? handleNext : undefined}
        onPrevious={currentStep > 1 ? handlePrevious : undefined}
        onSubmit={currentStep === BENCHMARK_STEPS.length ? handleSubmit : undefined}
        submitLabel="Submit Benchmark"
        showNext={currentStep < BENCHMARK_STEPS.length}
        showPrevious={currentStep > 1}
        isSaving={isSaving}
      />
    </div>
  )
}
