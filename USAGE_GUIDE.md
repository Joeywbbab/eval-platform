# 🎉 前端优化使用指南

## 📋 概览

本指南介绍所有新增功能的使用方法，包括国际化、错误处理、加载状态等。

---

## 🌐 国际化 (i18n) 使用

### 1. 基础用法

在任何组件中使用翻译：

```typescript
"use client"

import { useTranslations } from "@/hooks/use-translations"

export function MyComponent() {
  // 使用命名空间
  const t = useTranslations("dashboard") // 对应 locales/en.json 中的 "dashboard" 键

  return (
    <div>
      <h1>{t("title")}</h1> {/* Dashboard / 仪表盘 */}
      <p>{t("subtitle")}</p>
    </div>
  )
}
```

### 2. 带参数的翻译

```typescript
const t = useTranslations("traces")

// 翻译: "5 items pending" 或 "5 个待处理项"
<p>{t("itemsPending", { count: 5 })}</p>
```

### 3. 通用翻译（无命名空间）

```typescript
const tCommon = useTranslations("common")

<button>{tCommon("loading")}</button> // Loading... / 加载中...
<button>{tCommon("cancel")}</button>  // Cancel / 取消
```

### 4. 语言切换

用户可以通过顶部导航栏的地球图标切换语言：

```
English ⟷ 中文
```

语言偏好会自动保存在 localStorage 中。

### 5. 添加新翻译

编辑 `/locales/en.json` 和 `/locales/zh.json`:

```json
// locales/en.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is a description"
  }
}

// locales/zh.json
{
  "myFeature": {
    "title": "我的功能",
    "description": "这是一个描述"
  }
}
```

在组件中使用：

```typescript
const t = useTranslations("myFeature")
<h1>{t("title")}</h1>
```

---

## 🛡️ 错误处理

### 1. 使用 ErrorBoundary 包裹组件

```typescript
import { ErrorBoundary } from "@/components/error-boundary"

export default function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

**效果：** 如果组件出错，会显示友好的错误界面和重试按钮。

### 2. 安全的 Storage 操作

```typescript
import { storage, STORAGE_KEYS } from "@/lib/storage"

// ✅ 正确方式 - 自动处理错误
const data = storage.get<MyType>(STORAGE_KEYS.FEEDBACK_QUEUE, [])
const success = storage.set(STORAGE_KEYS.FEEDBACK_QUEUE, newData)

// ❌ 避免这样 - 无错误处理
localStorage.setItem("key", JSON.stringify(data))
```

**效果：** Storage 满时自动显示 toast 提示用户清理缓存。

### 3. Toast 通知

```typescript
import { toast } from "sonner"

// 成功提示
toast.success("操作成功", {
  description: "数据已保存"
})

// 错误提示
toast.error("操作失败", {
  description: "请重试"
})

// 加载提示
toast.loading("处理中...")
```

---

## ⏳ 加载状态

### 1. 表格骨架屏

```typescript
import { SkeletonTable } from "@/components/ui/skeleton-table"

{isLoading ? (
  <SkeletonTable rows={5} columns={7} />
) : (
  <Table>
    {/* 实际表格内容 */}
  </Table>
)}
```

### 2. 全页加载

```typescript
import { LoadingPage, LoadingSpinner } from "@/components/ui/loading-spinner"

// 全页加载
if (isLoading) {
  return <LoadingPage text="加载数据中..." />
}

// 局部加载
<LoadingSpinner size="md" text="处理中..." />
```

---

## 📭 空状态

```typescript
import { EmptyState } from "@/components/ui/empty-state"
import { Inbox } from "lucide-react"

<EmptyState
  icon={Inbox}
  title="暂无数据"
  description="点击下方按钮创建第一条记录"
  action={{
    label: "创建记录",
    onClick: () => router.push("/create")
  }}
/>
```

---

## ✅ 确认对话框

```typescript
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useState } from "react"

const [showDialog, setShowDialog] = useState(false)

<ConfirmDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  title="删除确认"
  description="确定要删除这条记录吗？此操作不可撤销。"
  confirmText="删除"
  cancelText="取消"
  onConfirm={() => {
    // 执行删除操作
    handleDelete()
  }}
  variant="destructive" // 红色警告样式
/>
```

---

## 🎨 性能优化的组件

### 1. MetricCard（指标卡片）

```typescript
import { MetricCard } from "@/components/dashboard/metric-card"

<MetricCard
  title="总追踪数"
  value={24}
  trend={{
    value: "+12%",
    direction: "up",
    label: "相比上周"
  }}
/>
```

### 2. 懒加载图表

```typescript
import { PerformanceChart } from "@/components/dashboard/performance-chart"
import { FeedbackChart } from "@/components/dashboard/feedback-chart"

// 自动懒加载，显示 skeleton
<PerformanceChart data={chartData} />
<FeedbackChart data={feedbackData} />
```

---

## 🔧 实用 Hooks

### 1. useDebounce - 搜索防抖

```typescript
import { useDebounce } from "@/hooks/use-debounce"
import { useState } from "react"

const [searchQuery, setSearchQuery] = useState("")
const debouncedQuery = useDebounce(searchQuery, 300) // 300ms 延迟

// 使用 debouncedQuery 进行搜索
useEffect(() => {
  // 只在用户停止输入 300ms 后执行
  performSearch(debouncedQuery)
}, [debouncedQuery])
```

### 2. useLocalStorage - localStorage 状态

```typescript
import { useLocalStorage } from "@/hooks/use-local-storage"

const [preferences, setPreferences, removePreferences] = useLocalStorage(
  "user-preferences",
  { theme: "dark", language: "en" }
)

// 使用方式类似 useState
setPreferences({ ...preferences, theme: "light" })

// 删除
removePreferences()
```

### 3. useLocale - 语言状态

```typescript
import { useLocale } from "@/hooks/use-locale"

const { locale, setLocale, toggleLocale } = useLocale()

console.log(locale) // "en" 或 "zh"

// 切换语言
setLocale("zh")

// 在英文和中文间切换
toggleLocale()
```

---

## 📁 完整使用示例

### 创建一个完整的优化页面

```typescript
"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "@/hooks/use-translations"
import { useDebounce } from "@/hooks/use-debounce"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { ErrorBoundary } from "@/components/error-boundary"
import { SkeletonTable } from "@/components/ui/skeleton-table"
import { EmptyState } from "@/components/ui/empty-state"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"
import { Inbox } from "lucide-react"

export default function MyPage() {
  const router = useRouter()
  const t = useTranslations("myFeature")
  const tCommon = useTranslations("common")

  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null })

  // 防抖搜索
  const debouncedSearch = useDebounce(searchQuery, 300)

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = storage.get(STORAGE_KEYS.MY_DATA, [])
        setData(stored)
      } catch (error) {
        toast.error(t("loadError"))
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // 删除操作
  const handleDelete = useCallback((id: string) => {
    const newData = data.filter(item => item.id !== id)
    setData(newData)

    const success = storage.set(STORAGE_KEYS.MY_DATA, newData)
    if (success) {
      toast.success(tCommon("success"))
    }

    setDeleteConfirm({ open: false, id: null })
  }, [data, tCommon])

  // 加载状态
  if (isLoading) {
    return (
      <div className="p-6">
        <SkeletonTable rows={5} columns={4} />
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="p-6">
        <h1>{t("title")}</h1>

        {/* 搜索框 */}
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
        />

        {/* 空状态 */}
        {data.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={t("noData")}
            description={t("noDataDesc")}
            action={{
              label: t("createNew"),
              onClick: () => router.push("/create")
            }}
          />
        ) : (
          // 数据列表
          <div>
            {data.map(item => (
              <div key={item.id}>
                {item.name}
                <button onClick={() => setDeleteConfirm({ open: true, id: item.id })}>
                  {tCommon("delete")}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* 删除确认 */}
        <ConfirmDialog
          open={deleteConfirm.open}
          onOpenChange={(open) => setDeleteConfirm({ open, id: null })}
          title={t("deleteTitle")}
          description={t("deleteDesc")}
          confirmText={tCommon("delete")}
          cancelText={tCommon("cancel")}
          onConfirm={() => handleDelete(deleteConfirm.id)}
          variant="destructive"
        />
      </div>
    </ErrorBoundary>
  )
}
```

---

## 🎯 最佳实践

### 1. 总是使用 ErrorBoundary

```typescript
// ✅ 好的做法
export default function Page() {
  return (
    <ErrorBoundary>
      <PageContent />
    </ErrorBoundary>
  )
}

// ❌ 避免 - 错误会导致整个应用崩溃
export default function Page() {
  return <PageContent />
}
```

### 2. 使用 storage 而不是 localStorage

```typescript
// ✅ 好的做法 - 有错误处理
import { storage, STORAGE_KEYS } from "@/lib/storage"
const data = storage.get(STORAGE_KEYS.MY_DATA, [])
const success = storage.set(STORAGE_KEYS.MY_DATA, newData)

// ❌ 避免 - 可能导致应用崩溃
const data = JSON.parse(localStorage.getItem("myData"))
localStorage.setItem("myData", JSON.stringify(newData))
```

### 3. 搜索使用防抖

```typescript
// ✅ 好的做法 - 减少不必要的计算
const debouncedQuery = useDebounce(searchQuery, 300)

// ❌ 避免 - 每次输入都触发
<Input onChange={(e) => performSearch(e.target.value)} />
```

### 4. 提供用户反馈

```typescript
// ✅ 好的做法 - 用户知道发生了什么
const handleSave = () => {
  const success = storage.set(KEY, data)
  if (success) {
    toast.success("保存成功")
  }
}

// ❌ 避免 - 用户不知道操作是否成功
const handleSave = () => {
  storage.set(KEY, data)
}
```

### 5. 使用翻译而不是硬编码文本

```typescript
// ✅ 好的做法 - 支持多语言
const t = useTranslations("myFeature")
<h1>{t("title")}</h1>

// ❌ 避免 - 只支持一种语言
<h1>My Title</h1>
```

---

## 🚀 快速开始

1. **运行开发服务器**
```bash
npm run dev
```

2. **切换语言**
   - 点击顶部导航栏的地球图标
   - 选择 English 或 中文

3. **查看优化效果**
   - Dashboard: http://localhost:3000/dashboard
   - Traces: http://localhost:3000/tracing/traces
   - Feedback: http://localhost:3000/evaluation/feedback

4. **测试错误处理**
   - 打开浏览器控制台
   - 尝试填满 localStorage
   - 观察 toast 通知

---

## 📚 相关文档

- [OPTIMIZATION_SUMMARY.md](./OPTIMIZATION_SUMMARY.md) - 详细的优化总结
- [locales/en.json](./locales/en.json) - 英文翻译
- [locales/zh.json](./locales/zh.json) - 中文翻译

---

## 🆘 常见问题

### Q: 如何添加新的翻译键？

A: 在 `locales/en.json` 和 `locales/zh.json` 中添加相同的键，然后在组件中使用 `useTranslations()` 访问。

### Q: Toast 通知不显示？

A: 确保在 `app/layout.tsx` 中已经添加了 `<Toaster />` 组件（已包含在 sonner 中）。

### Q: ErrorBoundary 没有捕获错误？

A: ErrorBoundary 只能捕获渲染时的错误，不能捕获事件处理器中的错误。事件处理器中的错误需要 try-catch。

### Q: 语言切换后没有生效？

A: 页面刷新后会生效。如果需要立即生效，可以在 `useLocale` 的 `setLocale` 中取消注释 `window.location.reload()`。

---

**最后更新：** 2025-10-31
**版本：** 2.0.0
