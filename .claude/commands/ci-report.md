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

Please analyze this CI run data and provide a comprehensive report. The data includes:

1. **STRUCTURED JOB DATA** - Overview of all jobs with success/failure status
2. **LOG_ANALYSIS_JSON** - Detailed analysis of failed job logs with categorized patterns

Parse the JSON structure and provide this analysis:

## CI Run Analysis for PR #XX: <PR title>

### Overall Status
- Run ID: <run_id>
- Branch: <branch>
- Total Jobs: X
- Failed Jobs: Y
- Successful Jobs: Z

### Detailed Failure Analysis

For EACH failed job, provide:

#### Job: <job_name>
**Error Summary**: <1-2 sentence summary of what failed>

**Root Cause**: <Deep analysis of the actual underlying issue>

**Error Details**:
- Key error messages found in logs
- Stack traces (if any)
- Specific test failures
- File/line numbers where relevant
- Any environment or dependency issues

**Error Patterns**: <Note if this error is related to others>

### Cross-Job Pattern Analysis
- **Test Categories Affected**: (unit tests, E2E tests, site tests, linting, etc.)
- **Browser/Platform Issues**: (Chrome vs Firefox, desktop vs mobile, etc.)
- **Common Error Types**: (timeout, assertion failure, network, dependency, etc.)
- **Failure Correlation**: (Are failures related? Same root cause?)
- **Infrastructure Issues**: (Docker, network, CI environment problems)

### Comprehensive Diagnosis
**Primary Issues** (rank by severity and impact):
1. <Most critical issue with detailed explanation>
2. <Second most critical issue>
3. <Additional issues>

**Secondary Issues** (less critical but should be addressed):
- <List secondary problems>

### Actionable Remediation Plan
**Immediate Actions** (fix these first):
1. <Specific action with exact steps or files to modify>
2. <Next specific action>

**Follow-up Actions** (after immediate fixes):
1. <Additional improvements or preventive measures>
2. <Long-term stability improvements>

**Prevention Strategies**:
- <How to prevent these issues in the future>
- <Suggested improvements to CI/testing setup>

### Code Investigation Required
- **Files to examine**: <List specific files mentioned in errors>
- **Functions/methods to review**: <Specific code locations>
- **Dependencies to check**: <Package versions, installations>

Analyze the logs with extreme thoroughness - every error message, every stack trace, every failure detail matters for accurate diagnosis.

$ARGUMENTS
