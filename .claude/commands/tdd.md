---
description: "Convert existing plan to TDD or create new TDD plan from scratch"
allowed-tools: ["TodoWrite", "Read", "Grep", "Glob"]
---

# Test-Driven Development Planner

Smart TDD command that handles both scenarios:
- **No arguments**: Convert existing implementation plan to TDD approach
- **With arguments**: Create new TDD plan from scratch for the specified feature

## What this does:

### If todos exist (no arguments):
1. **Analyze current todos** - Review existing implementation tasks
2. **Restructure for TDD** - Reorder to follow "write test first" methodology  
3. **Add test phases** - Insert Red-Green-Refactor cycles for each task

### If no todos exist (with arguments):
1. **Feature decomposition** - Break down feature into testable components
2. **Test strategy** - Plan unit, integration, and E2E tests
3. **Create TDD cycles** - Structure complete Red-Green-Refactor workflow
4. **Framework selection** - Use appropriate test tools (pytest, vitest, playwright)

## TDD Process Applied:

For each implementation component:
- 🔴 **Red**: Write failing test first
- 🟢 **Green**: Implement minimum code to make test pass  
- 🔵 **Refactor**: Clean up and optimize code
- ✅ **Verify**: Confirm tests still pass

## Usage Examples:
- `/make-tdd` (convert existing plan)
- `/make-tdd user authentication system`
- `/make-tdd file upload with progress tracking`

Feature to implement: $ARGUMENTS