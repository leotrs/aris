---
description: "Convert PRD to GitHub Projects with epics and tasks"
allowed-tools: Read(*:*), Write(*:*), Bash(*:*), WebSearch(*:*), Task(*:*)
thinking-mode: ultra-hard
---

# PRD to GitHub Issues Converter

Convert a Product Requirements Document into actionable GitHub Issues with epics and tasks.

**Usage:**
- `/breakdown-to-tasks <prd-file-path>` - Convert PRD to GitHub Issues structure

## CRITICAL: Argument Validation

```bash
# MUST be the first thing the command does
if [ -z "$ARGUMENTS" ]; then
    echo "❌ ERROR: No PRD file path provided"
    echo "Usage: /breakdown-to-tasks <prd-file-path>"
    echo "Example: /breakdown-to-tasks .claude/prds/my-feature.md"
    exit 1
fi

PRD_FILE_PATH="$ARGUMENTS"

# Validate PRD file exists
if [ ! -f "$PRD_FILE_PATH" ]; then
    echo "❌ ERROR: PRD file not found: $PRD_FILE_PATH"
    echo "Please ensure the file exists and try again."
    exit 1
fi

echo "✅ PRD file validated: $PRD_FILE_PATH"
```

## Process Overview

This command will:
1. **Validate arguments** - FAIL IMMEDIATELY if no PRD file path provided
2. **Read and analyze the PRD** from the specified file path
3. **Break down into epics and tasks** following agile best practices
4. **Generate detailed task issues** with complete context
5. **Create all GitHub issues** with proper labeling and structure

## Implementation Steps

### 1. PRD Analysis
- Read the PRD file and keep its entirety in the context window
- Identify acceptance criteria and technical requirements
- Map user stories to implementation tasks
- Determine epic boundaries and dependencies based on PRD content

### 2. Epic & Task Breakdown
- Analyze PRD structure to identify natural epic boundaries
- Create epics based on implementation phases and system components
- Size tasks appropriately (S/M/L) based on complexity
- Map dependencies between tasks and epics

### 3. Task Definition
Each task includes:
- **Task Overview**: Epic context, goal, size, PR scope
- **PRD Context**: Problem statement, acceptance criteria, user stories
- **Epic Context**: Epic goal, dependencies, integration points
- **Codebase Context**: Architecture patterns, file locations, examples
- **Implementation Details**: Technical requirements, security considerations
- **Testing Requirements**: 
  - Unit tests for features implemented in this task only
  - Integration/E2E tests that ONLY involve already-implemented features (not from same PRD/epic)
  - Do NOT test database migrations
  - Do NOT include tests for features from other tasks in same PRD/epic
- **Acceptance Criteria & Definition of Done**: Combined section with specific deliverables and completion criteria

### 4. Issue Title Format
Issue titles must include PRD and epic prefixes:
- Format: `[PRD-{prd-name} EP-{epic-name}] {task-title}`
- Example: `[PRD-auth EP-login] Implement OAuth provider integration`

### 5. Epic Integration Issues
Each epic must create an additional integration issue:
- **Title Format**: `[PRD-{prd-name} EP-{epic-name}] Epic Integration & E2E Tests`
- **Purpose**: Implement integration/E2E tests that span multiple tasks within the epic
- **Dependencies**: All tasks within the epic must be completed first
- **Content**: Tests that verify feature interactions across the epic's tasks

### 6. PRD Final Integration Issue
The PRD must create a final integration issue:
- **Title Format**: `[PRD-{prd-name}] Final Integration & Acceptance Validation`
- **Purpose**: 
  - Validate ALL acceptance criteria for the entire PRD
  - Implement integration/E2E tests that span multiple epics
  - Final end-to-end validation of the complete feature set
- **Dependencies**: All epics and their integration issues must be completed first

### 7. GitHub Issues Creation
- Create all task issues, epic integration issues, and PRD final issue with complete context (parallelized)
- Apply appropriate labels for epic grouping and task categorization
- Set up issue relationships and dependencies through descriptions

## Command Execution

The command will:
1. **Validate arguments** - FAIL IMMEDIATELY if no PRD file path provided
2. **Analyze the PRD** and validate it contains necessary sections
3. **Generate task breakdown** with proper sizing and dependencies
4. **Generate all issues** with complete context for Claude instances (parallelized):
   - Individual task issues for each feature implementation
   - Epic integration issues for cross-task testing within each epic
   - PRD final integration issue for cross-epic validation
5. **Output summary** of created issues and their relationships

## Required PRD Sections

The PRD must contain:
- Executive Summary
- Problem & Solution
- User Analysis with personas and scenarios
- Scope Definition with user stories
- Technical Requirements (Frontend, Backend, Database)
- Acceptance Criteria (Functional, UX, Technical)
- Implementation Plan with phases

## Output Structure

The command will create:
- **Task issues** with complete context for implementation
- **Epic integration issues** for cross-task testing within each epic
- **PRD final integration issue** for cross-epic validation and complete acceptance criteria
- **Proper labeling** for epic grouping and task categorization
- **Issue relationships** documented through descriptions and dependencies

## Task Context Template

Each task will include comprehensive context:

```markdown
## Task Overview
**Epic:** [Epic Name]
**Goal:** [Brief description]
**Size:** [S/M/L based on complexity]
**PR Scope:** [Single focused change description]

## PRD Context
### Problem Statement
[Relevant problem this task solves]

### User Stories Addressed
[User stories this task fulfills]

## Epic Context
**Epic Goal:** [Overall epic objective]
**This task enables:** [Dependencies and related tasks]
**Dependencies:** [What must be done first]

## Codebase Context
### Current Architecture
[Relevant patterns and file locations]

### Implementation Details
[Specific technical requirements]

## Testing Requirements
- Unit tests for features implemented in this task only
- Integration/E2E tests that ONLY involve already-implemented features (not from same PRD/epic)
- Do NOT test database migrations
- Do NOT include tests for features from other tasks in same PRD/epic

## Acceptance Criteria & Definition of Done
- [ ] [Specific criteria this task addresses]
- [ ] [Additional functional requirements]
- [ ] [Testing requirements completed]
- [ ] [Code quality standards met]
- [ ] [Documentation updated if needed]
```

## Epic Integration Issue Template

```markdown
## Epic Integration Overview
**Epic:** [Epic Name]
**Goal:** Implement integration and E2E tests that span multiple tasks within this epic
**Dependencies:** All tasks within this epic must be completed first

## PRD Context
### Problem Statement
[How this epic solves part of the overall PRD problem]

### User Stories Addressed
[User stories that span multiple tasks in this epic]

## Integration Testing Requirements
- Integration tests that verify feature interactions across tasks in this epic
- E2E tests that validate complete user workflows within this epic
- Cross-task feature validation
- Do NOT test features from other epics

## Acceptance Criteria & Definition of Done
- [ ] All tasks within epic are completed and integrated
- [ ] Integration tests cover task interactions within epic
- [ ] E2E tests validate complete epic workflows
- [ ] All epic-level acceptance criteria are met
- [ ] Epic is ready for cross-epic integration
```

## PRD Final Integration Issue Template

```markdown
## PRD Final Integration Overview
**PRD:** [PRD Name]
**Goal:** Final validation of ALL acceptance criteria and cross-epic integration
**Dependencies:** All epics and their integration issues must be completed first

## PRD Context
### Complete Problem Statement
[Full problem this PRD solves]

### All User Stories
[Complete list of user stories from the PRD]

## Final Integration Testing Requirements
- Integration tests that span multiple epics
- E2E tests that validate complete user workflows across the entire PRD
- Cross-epic feature validation
- Complete acceptance criteria validation

## Complete PRD Acceptance Criteria & Definition of Done
- [ ] All epics and their integration issues are completed
- [ ] All functional requirements from PRD are implemented
- [ ] All UX requirements from PRD are met
- [ ] All technical requirements from PRD are satisfied
- [ ] Cross-epic integration tests pass
- [ ] Complete E2E user workflows validated
- [ ] All acceptance criteria from original PRD are met
- [ ] PRD is ready for production deployment
```

## GitHub CLI Integration

The command will use gh CLI to:
- Create all issues: `gh issue create` (parallelized)
  - Individual task issues for each feature implementation
  - Epic integration issues for cross-task testing within each epic
  - PRD final integration issue for cross-epic validation
- Apply labels: `gh issue edit --add-label` for epic grouping and categorization

## Success Criteria

Command succeeds when:
- All epics and tasks are properly structured
- Task issues contain complete implementation context with restricted testing scope
- Epic integration issues are created for cross-task testing within each epic
- PRD final integration issue is created for cross-epic validation
- All issues are properly labeled and categorized
- Issue relationships and dependencies are clearly documented

## Instructions for Implementation

1. **Validate arguments** - Check if `$ARGUMENTS` contains a PRD file path, fail if empty
2. **Read the PRD file** from the path specified in `$ARGUMENTS`
3. **Analyze and validate** the PRD structure contains all required sections
4. **Generate epic and task breakdown** by:
   - Analyzing PRD sections to identify natural boundaries
   - Creating epics based on implementation phases and system components
   - Sizing tasks appropriately based on complexity
   - Mapping dependencies between tasks and epics
5. **Generate all issues** with comprehensive context (use parallelization for efficiency):
   - **Individual task issues**:
     - **CRITICAL**: Use title format `[PRD-{prd-name} EP-{epic-name}] {task-title}`
     - **CRITICAL**: Include only ONE checklist - the "Acceptance Criteria & Definition of Done" section
     - **CRITICAL**: Testing scope limited to task features and pre-existing features only
     - Follow the exact task template structure provided
   - **Epic integration issues**:
     - **CRITICAL**: Use title format `[PRD-{prd-name} EP-{epic-name}] Epic Integration & E2E Tests`
     - **CRITICAL**: Only test features that span multiple tasks within the same epic
     - Follow the exact epic integration template structure provided
   - **PRD final integration issue**:
     - **CRITICAL**: Use title format `[PRD-{prd-name}] Final Integration & Acceptance Validation`
     - **CRITICAL**: Include ALL acceptance criteria from the entire PRD
     - **CRITICAL**: Test features that span multiple epics
     - Follow the exact PRD final integration template structure provided
6. **Apply appropriate labels** for epic grouping and task categorization
7. **Output summary** of created issues and their relationships

The implementation should dynamically analyze any PRD structure and create appropriate
epics and tasks, ensuring each task has sufficient context for independent
implementation by Claude instances.