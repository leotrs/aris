---
description: "Analyze CI status for PR (current branch or specified PR number)"
allowed-tools: Bash(*:*)
---

# CI Report Analysis

Gather CI data for GitHub PR and analyze failure patterns.

**Usage:**
- `/ci-report` - Analyze CI for current branch's PR
- `/ci-report 123` - Analyze CI for PR #123

!./scripts/get-ci-data.sh "$ARGUMENTS"

Please analyze this CI run data and provide a report in this exact format:

## CI Run Analysis for PR #XX: <PR title>

### Overall Status
- Run ID: <run_id>
- Branch: <branch>
- Total Jobs: X
- Failed Jobs: Y
- Successful Jobs: Z

### Failure Pattern Analysis
<Analyze the failure logs and job names to identify patterns like:>
- Are unit tests failing? E2E tests? Site tests?
- Desktop vs mobile issues?
- Browser-specific failures?
- Common error types across failures?
- Any dominant error pattern?

### Recommended Actions
<Provide 2-3 actionable next steps based on the failure analysis>

$ARGUMENTS
