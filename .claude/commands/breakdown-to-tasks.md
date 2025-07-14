---
description: "Convert PRD to GitHub Projects with epics and tasks"
allowed-tools: Read(*:*), Write(*:*), Bash(*:*), WebSearch(*:*), Task(*:*)
thinking-mode: ultra-hard
---

# PRD to GitHub Projects Converter

Convert a Product Requirements Document into actionable GitHub Projects with epics and tasks.

**Usage:**
- `/breakdown-to-tasks <prd-file-path>` - Convert PRD to GitHub Projects structure

## Process Overview

This command will:
1. **Read and analyze the PRD** from the specified file path
2. **Break down into epics and tasks** following agile best practices
3. **Create GitHub Project structure** using gh CLI
4. **Generate detailed task issues** with complete context
5. **Set up project automation** and custom fields

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
- **Testing Requirements**: Unit tests derived from acceptance criteria
- **Definition of Done**: Specific deliverables and requirements

### 4. GitHub Project Creation
- Create project with gh CLI
- Set up custom fields (Epic, Task Type, Size, PR Status, Dependencies)
- Configure automation rules
- Create all task issues with complete context (parallelized)

## Command Execution

The command will:
1. **Analyze the PRD** and validate it contains necessary sections
2. **Generate task breakdown** with proper sizing and dependencies
3. **Create GitHub Project** with all custom fields and automation
4. **Generate all task issues** with complete context for Claude instances (parallelized)
5. **Output project URL**

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
- **GitHub Project** with all epics and tasks
- **Task issues** with complete context for implementation
- **Progress tracking** setup with custom fields

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

### Acceptance Criteria (Relevant)
[Specific criteria this task addresses]

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
[Unit tests derived from acceptance criteria]

## Definition of Done
[Specific deliverables and completion criteria]
```

## GitHub CLI Integration

The command will use gh CLI to:
- Create the project: `gh project create`
- Set up custom fields: `gh project field-create`
- Create task issues: `gh issue create` (parallelized)
- Add items to project: `gh project item-add`
- Set field values: `gh project item-edit`

## Success Criteria

Command succeeds when:
- GitHub Project is created with all custom fields
- All epics and tasks are properly structured
- Task issues contain complete implementation context
- Project automation is configured

## Instructions for Implementation

1. **Validate arguments** - Check if `$ARGUMENTS` contains a PRD file path, fail if empty
2. **Read the PRD file** from the path specified in `$ARGUMENTS`
3. **Analyze and validate** the PRD structure contains all required sections
4. **Generate epic and task breakdown** by:
   - Analyzing PRD sections to identify natural boundaries
   - Creating epics based on implementation phases and system components
   - Sizing tasks appropriately based on complexity
   - Mapping dependencies between tasks and epics
5. **Create GitHub Project** using gh CLI commands
6. **Generate task issues** with comprehensive context for each task (use parallelization for efficiency)
7. **Set up automation** and custom fields for project management
8. **Output project information** and management scripts

The implementation should dynamically analyze any PRD structure and create appropriate
epics and tasks, ensuring each task has sufficient context for independent
implementation by Claude instances.
