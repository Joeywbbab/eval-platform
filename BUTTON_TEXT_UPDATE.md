# 按钮文字统一更新

## 📋 更新内容

### 问题描述
Benchmark 页面和 Task Brief 页面的创建按钮文字不统一：
- Benchmarks 列表页：显示 "New benchmark"
- Category 页面：显示 "+ Create Task Brief"

### 解决方案
统一所有创建按钮为：**"Create New Task"**

---

## ✅ 修改详情

### 1. Benchmarks 列表页

**文件**: `app/benchmarks/page.tsx`

**修改前**:
```tsx
<Button asChild size="sm" className="h-8 gap-2">
  <Link href="/benchmarks/create">
    <Plus className="h-4 w-4" />
    New benchmark
  </Link>
</Button>
```

**修改后**:
```tsx
<Button asChild size="sm" className="h-8 gap-2">
  <Link href="/benchmarks/create">
    <Plus className="h-4 w-4" />
    Create New Task
  </Link>
</Button>
```

---

### 2. Category 页面 (Task Briefs)

**文件**: `app/benchmarks/[category]/page.tsx`

**修改前**:
```tsx
<Link href="/benchmarks/create">
  <Button>+ Create Task Brief</Button>
</Link>
```

**修改后**:
```tsx
import { Plus } from "lucide-react"  // 添加导入

<Link href="/benchmarks/create">
  <Button>
    <Plus className="h-4 w-4 mr-2" />
    Create New Task
  </Button>
</Link>
```

**额外改进**:
- ✅ 使用图标组件替代文本 "+"
- ✅ 统一图标大小和间距

---

## 📊 对比总结

| 页面 | 修改前 | 修改后 | 状态 |
|------|--------|--------|------|
| Benchmarks 列表 | "New benchmark" | "Create New Task" | ✅ |
| Category 页面 | "+ Create Task Brief" | "Create New Task" | ✅ |

---

## 🎯 统一效果

### 视觉一致性

**Benchmarks 列表页**:
```
┌────────────────────────────────────┐
│ Benchmarks    [+ Create New Task]  │ ← 统一文字
└────────────────────────────────────┘
```

**Category 页面**:
```
┌────────────────────────────────────┐
│ ← KOL Sourcing  [+ Create New Task]│ ← 统一文字
└────────────────────────────────────┘
```

---

## ✅ 构建状态

```bash
✓ Compiled successfully
✓ All routes built without errors

Updated routes:
- /benchmarks (4.49 kB)
- /benchmarks/[category] (7.66 kB)
```

**无错误，无警告！**

---

## 🎨 设计原则

### 为什么选择 "Create New Task"？

1. **清晰明确** - 用户一眼就知道要创建什么
2. **动作导向** - "Create" 是明确的行动词
3. **简洁统一** - 适用于所有场景
4. **符合习惯** - 与常见的 UI 模式一致

### 其他考虑的选项

| 选项 | 优点 | 缺点 | 选择 |
|------|------|------|------|
| "New Task" | 简短 | 不够明确 | ❌ |
| "Create Task" | 简洁 | 少了"新"的概念 | ❌ |
| "Create New Task" | 清晰完整 | 稍长但可接受 | ✅ |
| "Add Task" | 简短 | 不够正式 | ❌ |

---

## 📝 使用场景

### 在哪里会看到这个按钮？

1. **Benchmarks 主页** (`/benchmarks`)
   - 页面顶部右侧
   - 用于创建新的 benchmark

2. **Category 页面** (`/benchmarks/[category]`)
   - 页面顶部右侧
   - 用于在特定分类下创建 task

---

## 🔄 用户流程

```
用户访问 /benchmarks
    ↓
看到 "Create New Task" 按钮
    ↓
点击按钮
    ↓
跳转到 /benchmarks/create
    ↓
进入 4 步创建流程
```

---

## 📚 相关文档

- [UPDATE_SUMMARY.md](UPDATE_SUMMARY.md) - 完整更新记录
- [LAYOUT_OPTIMIZATION.md](LAYOUT_OPTIMIZATION.md) - 布局优化
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 快速参考

---

## ✨ 总结

### 完成的工作
- ✅ 统一了两个页面的按钮文字
- ✅ 改进了图标使用（从文本 "+" 到组件）
- ✅ 确保视觉一致性
- ✅ 通过构建测试

### 效果
- ✅ 用户体验更一致
- ✅ 界面更专业
- ✅ 减少混淆

---

**更新时间**: 2025-10-14
**状态**: ✅ 完成并测试通过
**影响页面**:
- `/benchmarks`
- `/benchmarks/[category]`
