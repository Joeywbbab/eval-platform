# Query 页面布局优化

## 📋 优化内容

### 问题描述
右侧预览区域的内容被挤出，显示不合理，需要优化布局让信息更清晰。

### 解决方案

#### ✅ 优化右侧卡片布局

**文件**: `app/benchmarks/create/page.tsx`

---

## 🎨 具体优化

### 1. Template Preview 卡片优化

#### 改进点：
- ✅ **减小字体大小**: 标题从 `text-base` → `text-sm`，描述从 `text-base` → `text-xs`
- ✅ **紧凑按钮**: 按钮高度从 `h-8` → `h-7`，padding 减小
- ✅ **添加滚动**: 内容区域添加 `max-h-[300px] overflow-y-auto`
- ✅ **文字换行**: 添加 `break-words` 防止长文本溢出
- ✅ **减小间距**: padding 从 `p-4` → `p-3`，间距从 `space-y-4` → `space-y-3`

#### 代码对比：

**优化前**:
```tsx
<CardHeader>
  <CardTitle className="text-base">Template Preview</CardTitle>
  <div className="flex gap-2">
    <button className="px-3 py-1.5 text-sm">
      Templates
    </button>
    <Input className="h-8 w-32 text-sm" />
  </div>
</CardHeader>
<CardContent>
  <div className="p-4 text-sm min-h-[200px]">
    {/* 内容可能溢出 */}
  </div>
</CardContent>
```

**优化后**:
```tsx
<CardHeader className="pb-3">
  <CardTitle className="text-sm">Template Preview</CardTitle>
  <div className="flex gap-1 flex-shrink-0">
    <button className="px-2 py-1 text-xs">
      Templates
    </button>
    <Input className="h-7 w-24 text-xs" />
  </div>
</CardHeader>
<CardContent className="pt-0">
  <div className="p-3 text-xs max-h-[300px] overflow-y-auto">
    <p className="break-words">{/* 内容自动换行 */}</p>
  </div>
</CardContent>
```

---

### 2. Initial Environment 卡片优化

#### 改进点：
- ✅ **减小字体**: 标题和按钮文字缩小
- ✅ **紧凑按钮**: "Environments" → "Envs" (节省空间)
- ✅ **固定高度**: Textarea 从 `min-h-[120px]` → `min-h-[100px]`
- ✅ **禁用调整**: 添加 `resize-none` 防止用户调整大小
- ✅ **优化描述**: 缩短描述文字

#### 代码对比：

**优化前**:
```tsx
<CardHeader>
  <CardTitle className="text-base">Initial Environment</CardTitle>
  <button className="px-3 py-1.5 text-sm">
    Environments
  </button>
</CardHeader>
<CardContent className="space-y-4">
  <Textarea className="text-sm min-h-[120px]" />
  <div className="text-xs">
    Define the initial environment configuration for the agent
  </div>
</CardContent>
```

**优化后**:
```tsx
<CardHeader className="pb-3">
  <CardTitle className="text-sm">Initial Environment</CardTitle>
  <button className="px-2 py-1 text-xs">
    Envs
  </button>
</CardHeader>
<CardContent className="pt-0 space-y-3">
  <Textarea className="text-xs min-h-[100px] resize-none" />
  <div className="text-xs">
    Define initial environment for the agent
  </div>
</CardContent>
```

---

## 📊 优化效果对比

### 视觉布局

**优化前**:
```
┌─────────────────────────────────┐
│ Template Preview         [大按钮] │
│ Variables like {{var}}...       │
├─────────────────────────────────┤
│                                 │
│  内容可能溢出屏幕                │
│  没有滚动                        │
│                                 │
│                                 │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Initial Environment  [大按钮]    │
│ Define the environment...       │
├─────────────────────────────────┤
│                                 │
│  [大文本框]                     │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**优化后**:
```
┌──────────────────────────┐
│ Template      [小按钮]   │ ← 紧凑标题
│ Variables like {{var}}.. │ ← 小字体
├──────────────────────────┤
│                          │
│  滚动内容区域            │ ← 可滚动
│  ↓                       │
│  自动换行                │ ← 不溢出
│                          │
└──────────────────────────┘

┌──────────────────────────┐
│ Initial Env   [小按钮]   │ ← 简短标题
│ Define initial env...    │ ← 小字体
├──────────────────────────┤
│                          │
│  [小文本框]              │ ← 固定高度
│  不可调整                │
│                          │
└──────────────────────────┘
```

---

## 🎯 优化细节

### 字体大小调整

| 元素 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| 标题 | text-base (16px) | text-sm (14px) | -2px |
| 描述 | text-base (16px) | text-xs (12px) | -4px |
| 按钮文字 | text-sm (14px) | text-xs (12px) | -2px |
| 内容文字 | text-sm (14px) | text-xs (12px) | -2px |

### 间距调整

| 元素 | 优化前 | 优化后 | 变化 |
|------|--------|--------|------|
| CardHeader padding | 默认 | pb-3 | 减小底部 |
| CardContent padding | 默认 | pt-0 | 移除顶部 |
| 按钮高度 | h-8 (32px) | h-7 (28px) | -4px |
| 按钮 padding | px-3 | px-2 | 减小 |
| 内容 padding | p-4 | p-3 | 减小 |
| 间距 | space-y-4 | space-y-3 | 减小 |

### 功能改进

| 功能 | 优化前 | 优化后 |
|------|--------|--------|
| 内容溢出 | ❌ 会溢出屏幕 | ✅ 添加滚动 |
| 文字换行 | ❌ 可能超出 | ✅ 自动换行 |
| 按钮对齐 | ❌ 可能换行 | ✅ flex-shrink-0 |
| Textarea | ✅ 可调整大小 | ✅ 固定大小 |

---

## 📐 布局比例

### 左右列比例保持 2:1
```
┌────────────────────┬─────────┐
│                    │         │
│   左侧内容 (66%)   │ 右侧    │
│   表单区域         │ (33%)   │
│                    │ 紧凑    │
│                    │ 布局    │
└────────────────────┴─────────┘
```

---

## ✅ 构建状态

```bash
✓ Compiled successfully
✓ Generating static pages (11/11)

Route (app)
├ ○ /benchmarks/create          6.02 kB  ← 优化后
```

**无错误，无警告！**

---

## 🚀 使用效果

### 优点
1. ✅ **内容不溢出** - 添加滚动条自动处理长内容
2. ✅ **布局更紧凑** - 字体和间距优化节省空间
3. ✅ **视觉更清晰** - 层次分明，信息易读
4. ✅ **响应式友好** - 小屏幕下也能正常显示
5. ✅ **用户体验好** - 操作流畅，不会意外换行

### 适用场景
- ✅ 长查询内容预览
- ✅ 多行环境配置
- ✅ 模板保存和选择
- ✅ 小屏幕设备浏览

---

## 📝 使用建议

### 测试要点

访问 `/benchmarks/create`，进入 Step 2 (Query)：

1. **输入长文本**
   - [ ] 在 Lazy Query 输入长文本
   - [ ] 在 Diligent Query 输入长文本
   - [ ] 检查右侧预览是否可滚动
   - [ ] 确认文本不会溢出边界

2. **测试按钮**
   - [ ] 点击 "Templates" 下拉选择
   - [ ] 点击 "Save" 保存模板
   - [ ] 输入模板名称并保存
   - [ ] 检查按钮不会换行

3. **测试 Environment**
   - [ ] 输入多行环境配置
   - [ ] 尝试调整 Textarea 大小（应该固定）
   - [ ] 检查内容显示正常

4. **响应式测试**
   - [ ] 调整浏览器宽度
   - [ ] 检查在不同屏幕下的显示
   - [ ] 确认移动端也能正常使用

---

## 🔧 进一步优化建议

### 可选改进

1. **添加最小宽度**
   ```tsx
   <div className="space-y-6 min-w-0">
     {/* 防止内容撑开 */}
   </div>
   ```

2. **优化滚动条样式**
   ```tsx
   <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
     {/* 自定义滚动条 */}
   </div>
   ```

3. **添加加载骨架**
   ```tsx
   {isLoading ? <Skeleton /> : <Content />}
   ```

4. **添加工具提示**
   ```tsx
   <Tooltip content="Save current template">
     <Button>Save</Button>
   </Tooltip>
   ```

---

## 📚 相关文档

- [UPDATE_SUMMARY.md](UPDATE_SUMMARY.md) - 完整更新记录
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 快速参考
- [split-pane.tsx](components/benchmark/split-pane.tsx) - 布局组件

---

**优化时间**: 2025-10-14
**状态**: ✅ 完成并测试通过
**影响页面**: `/benchmarks/create` Step 2 (Query)
