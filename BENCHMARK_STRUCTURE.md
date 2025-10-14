# Benchmark Module Structure

## Overview
This document outlines the structure and organization of the benchmark management system.

## Directory Structure

```
/lib
  /types
    benchmark.ts          # TypeScript type definitions
  /constants
    benchmark.ts          # Constants and configuration
  /utils
    benchmark.ts          # Utility functions

/app
  /benchmarks
    page.tsx              # Benchmarks list page
    /create
      page.tsx            # Benchmark creation flow (4 steps)
    /[category]
      page.tsx            # Category view
      /[id]
        page.tsx          # Individual benchmark view
    /[id]
      page.tsx            # Benchmark detail page

/components
  /benchmark
    benchmarks-table.tsx  # Table component
    step-indicator.tsx    # Step progress indicator
    sticky-actions-bar.tsx # Action buttons bar
    split-pane.tsx        # Two-column layout
    status-badge.tsx      # Status display
    difficulty-badge.tsx  # Difficulty display
    version-pill.tsx      # Version display
```

## Core Files

### 1. Type Definitions (`/lib/types/benchmark.ts`)
Centralized TypeScript type definitions for:
- `BenchmarkStatus` - Status enum
- `Difficulty` - Difficulty levels
- `BenchmarkCategory` - Category types
- `RubricDimension` - Scoring rubric structure
- `BenchmarkData` - Complete benchmark data
- `Benchmark` - Benchmark listing item
- `Template` - Query template
- `Environment` - Environment configuration

### 2. Constants (`/lib/constants/benchmark.ts`)
Configuration constants:
- `BENCHMARK_STEPS` - Creation flow steps
- `CATEGORY_OPTIONS` - Available categories
- `CATEGORY_COLORS` - Category color mapping
- `STATUS_OPTIONS` - Available status options
- `STATUS_COLORS` - Status color mapping
- `DIFFICULTY_OPTIONS` - Difficulty level options
- `DIFFICULTY_COLORS` - Difficulty color mapping
- `DEFAULT_RUBRIC_DIMENSIONS` - Default scoring dimensions

### 3. Utility Functions (`/lib/utils/benchmark.ts`)
Helper functions:
- `formatStatus()` - Format status for display
- `calculateTotalScore()` - Calculate total score from rubric
- `formatFileSize()` - Format file size
- `validateBenchmarkData()` - Validate before submission
- `highlightTemplateVariables()` - Parse template variables
- `generateId()` - Generate unique IDs
- `formatCategorySlug()` - Format category for URLs
- `parseCategorySlug()` - Parse category from URLs

## Benchmark Creation Flow

The benchmark creation process follows a 4-step wizard:

### Step 1: Info
- **Purpose**: Basic benchmark information
- **Fields**:
  - Task Brief (required)
  - Category
  - Status
  - Difficulty

### Step 2: Query
- **Purpose**: Define queries and environment
- **Sections**:
  - Preliminary Materials (file uploads)
  - Query Area (lazy & diligent queries)
  - Expected Output (description & files)
  - Template Preview (right sidebar)
  - Initial Environment (right sidebar)

### Step 3: Rubric
- **Purpose**: Define scoring dimensions
- **Features**:
  - Add/remove dimensions
  - Set title, description, max score
  - View score summary
  - Cannot remove last dimension

### Step 4: Review
- **Purpose**: Review and submit
- **Sections**:
  - Basic Information review
  - Query Configuration review
  - Scoring Rubric review
  - Edit buttons for each section

## Key Features

### Validation
- Required fields validation
- Minimum rubric dimensions check
- User-friendly error messages

### Data Management
- Template saving and loading
- Environment configuration saving
- File upload handling

### User Experience
- Step-by-step navigation
- Progress indicator
- Auto-save functionality
- Toast notifications
- Sticky action bar

## Navigation Flow

```
/benchmarks
  ├─ Click "+New benchmark"
  │  └─ /benchmarks/create
  │     ├─ Step 1: Info
  │     ├─ Step 2: Query
  │     ├─ Step 3: Rubric
  │     └─ Step 4: Review → Submit → Back to /benchmarks
  │
  ├─ Click benchmark card
  │  └─ /benchmarks/[category]
  │
  └─ Click specific benchmark
     └─ /benchmarks/[category]/[id]
```

## Best Practices

### 1. Type Safety
- Always import types from `/lib/types/benchmark.ts`
- Use TypeScript strict mode
- Avoid `any` types

### 2. Constants Usage
- Use constants from `/lib/constants/benchmark.ts` for:
  - Select options
  - Color mappings
  - Default values

### 3. Utility Functions
- Use utility functions for common operations
- Keep business logic in utility files
- Avoid duplication

### 4. Component Structure
- Keep components focused and single-purpose
- Use proper TypeScript interfaces
- Follow existing naming conventions

### 5. Error Handling
- Validate data before submission
- Provide clear error messages
- Use toast notifications for feedback

## Future Improvements

1. **API Integration**
   - Replace mock data with real API calls
   - Add loading states
   - Implement error handling

2. **State Management**
   - Consider using Zustand or Context API
   - Implement global state for templates/environments

3. **Form Validation**
   - Add real-time validation
   - Implement field-level error messages
   - Add form dirty state tracking

4. **File Upload**
   - Implement actual file upload to server
   - Add file type validation
   - Add file size limits
   - Show upload progress

5. **Search & Filter**
   - Add more filter options
   - Implement sort functionality
   - Add pagination

## Troubleshooting

### Issue: Can't navigate to create page
**Solution**: The route `/benchmarks/create` should work correctly. If it doesn't:
1. Check Next.js dev server is running
2. Verify file exists at `/app/benchmarks/create/page.tsx`
3. Check browser console for errors
4. Try hard refresh (Cmd+Shift+R)

### Issue: Types not found
**Solution**: Ensure types are imported correctly:
```typescript
import type { BenchmarkData, Difficulty } from "@/lib/types/benchmark"
```

### Issue: Constants not working
**Solution**: Import and use constants:
```typescript
import { BENCHMARK_STEPS, DIFFICULTY_OPTIONS } from "@/lib/constants/benchmark"
```

## Migration Guide

If you're upgrading from old code:

1. **Replace inline types** with imports from `/lib/types/benchmark.ts`
2. **Replace hardcoded arrays** with constants from `/lib/constants/benchmark.ts`
3. **Replace utility logic** with functions from `/lib/utils/benchmark.ts`
4. **Update color classes** to use constant mappings

Example:
```typescript
// Before
const difficultyColors = {
  easy: "bg-green-500/10 text-green-400",
  // ...
}

// After
import { DIFFICULTY_COLORS } from "@/lib/constants/benchmark"
```
