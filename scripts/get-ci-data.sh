#!/bin/bash
set -e

# Enhanced CI Data Gathering Script with Artifact Analysis
# Usage: ./get-ci-data.sh [PR_NUMBER]

# Step 1: Determine PR Number
if [ -n "$1" ]; then
  PR_NUMBER="$1"
else
  CURRENT_BRANCH=$(git branch --show-current)
  PR_NUMBER=$(gh pr list --head "$CURRENT_BRANCH" --json number --jq ".[0].number // empty")
  if [ -z "$PR_NUMBER" ]; then
    echo "❌ No open PR found for branch: $CURRENT_BRANCH"
    echo "Create a PR first or specify a PR number as an argument."
    exit 1
  fi
fi

# Create temp directory for artifacts
TEMP_DIR=$(mktemp -d)
trap "rm -rf $TEMP_DIR" EXIT

# Step 2: Get PR Information
PR_INFO=$(gh pr view "$PR_NUMBER" --json title,headRefName,statusCheckRollup)
PR_TITLE=$(echo "$PR_INFO" | jq -r ".title")
BRANCH_NAME=$(echo "$PR_INFO" | jq -r ".headRefName")

# Step 3: Get Most Recent COMPLETED Workflow Run (skip in-progress ones)
ALL_RUNS=$(gh run list --branch "$BRANCH_NAME" --limit 5 --json databaseId,status,conclusion,workflowName,createdAt)
LATEST_RUN=$(echo "$ALL_RUNS" | jq '.[] | select(.status == "completed") | select(.workflowName == "CI")' | jq -s '.[0] // empty')

if [ "$(echo "$LATEST_RUN" | jq -r '. // "null"')" = "null" ]; then
  echo "❌ No completed CI runs found for branch: $BRANCH_NAME"
  echo "Recent runs:"
  echo "$ALL_RUNS" | jq '.[] | {status, conclusion, workflowName, createdAt}'
  exit 1
fi

RUN_ID=$(echo "$LATEST_RUN" | jq -r ".databaseId")
RUN_STATUS=$(echo "$LATEST_RUN" | jq -r ".status")
RUN_CONCLUSION=$(echo "$LATEST_RUN" | jq -r ".conclusion")
WORKFLOW_NAME=$(echo "$LATEST_RUN" | jq -r ".workflowName")

# Step 4: Validate Run is Complete and Has Logs
echo "📊 Analyzing completed CI run: $RUN_ID"
echo "📅 Run created: $(echo "$LATEST_RUN" | jq -r ".createdAt")"
echo "🎯 Conclusion: $RUN_CONCLUSION"

# Step 5: Get Comprehensive Job and Log Data
FULL_RUN_INFO=$(gh run view "$RUN_ID" --json jobs,conclusion,status,name,createdAt,url)

# Extract structured job data
echo "=== STRUCTURED JOB DATA ==="
echo "$FULL_RUN_INFO" | jq '{
  run_info: {
    name: .name,
    conclusion: .conclusion,
    status: .status,
    created_at: .createdAt,
    url: .url
  },
  job_summary: [
    .jobs[] | {
      name: .name,
      conclusion: .conclusion,
      status: .status,
      id: (.databaseId // .id),
      started_at: .startedAt,
      completed_at: .completedAt,
      url: .url
    }
  ],
  failed_jobs: [
    .jobs[] | select(.conclusion == "failure") | {
      name: .name,
      id: (.databaseId // .id),
      steps: [
        .steps[]? | select(.conclusion == "failure") | {
          name: .name,
          conclusion: .conclusion,
          number: .number
        }
      ]
    }
  ]
}'

# Download and analyze failure artifacts
echo ""
echo "=== DOWNLOADING FAILURE ARTIFACTS ==="

FAILED_JOBS=$(echo "$FULL_RUN_INFO" | jq -r '.jobs[] | select(.conclusion == "failure") | .name')
ARTIFACTS_FOUND=false

for job_name in $FAILED_JOBS; do
  echo ""
  echo "=== PROCESSING FAILED JOB: $job_name ==="
  
  # Try to download artifacts for this job
  echo "Attempting to download artifacts for $job_name..."
  gh run download "$RUN_ID" --dir "$TEMP_DIR" --pattern "*failure*" 2>/dev/null
  
  # Check if any artifacts were actually downloaded
  if [ -d "$TEMP_DIR" ] && [ "$(find "$TEMP_DIR" -name "failure-summary.json" | wc -l)" -gt 0 ]; then
    ARTIFACTS_FOUND=true
    echo "✅ Downloaded artifacts for $job_name"
    
    # Look for failure summary in downloaded artifacts
    FAILURE_SUMMARIES=$(find "$TEMP_DIR" -name "failure-summary.json" -exec cat {} \; 2>/dev/null || echo "")
    
    if [ -n "$FAILURE_SUMMARIES" ]; then
      echo "=== ARTIFACT_DATA ==="
      echo "$FAILURE_SUMMARIES"
    fi
    
    # Look for Playwright reports
    PLAYWRIGHT_REPORTS=$(find "$TEMP_DIR" -name "*.html" | head -3)
    if [ -n "$PLAYWRIGHT_REPORTS" ]; then
      echo "=== PLAYWRIGHT_REPORTS_AVAILABLE ==="
      echo "$PLAYWRIGHT_REPORTS"
    fi
    
    # Look for test result files
    TEST_RESULT_FILES=$(find "$TEMP_DIR" -name "*.json" -path "*/test-results/*" | head -5)
    if [ -n "$TEST_RESULT_FILES" ]; then
      echo "=== TEST_RESULT_FILES ==="
      for file in $TEST_RESULT_FILES; do
        echo "File: $file"
        cat "$file" 2>/dev/null | head -20 || echo "Could not read file"
        echo "---"
      done
    fi
  else
    echo "❌ CRITICAL ERROR: No failure artifacts found for $job_name"
    echo "This indicates either:"
    echo "1. The CI run is too old (before artifact collection was implemented)"
    echo "2. The artifact generation failed"
    echo "3. The artifacts have expired"
    echo ""
    echo "Cannot perform meaningful analysis without failure artifacts."
    echo "Re-run the CI or use a more recent failure with artifacts."
    exit 1
  fi
done

# Get successful jobs summary
SUCCESS_JOBS=$(echo "$FULL_RUN_INFO" | jq -r '.jobs[] | select(.conclusion == "success") | .name')
echo ""
echo "=== SUCCESSFUL_JOBS ==="
echo "$SUCCESS_JOBS"

# Note: If we reach here, all artifacts were found successfully

# Get additional context data
echo ""
echo "=== ADDITIONAL_CONTEXT ==="
echo "CI_CONFIG_INFO:"
if [ -f ".github/workflows/ci.yml" ]; then
  echo "CI configuration file exists"
else
  echo "❌ CI configuration file missing"
fi

echo "RECENT_COMMITS:"
git log --oneline -5 2>/dev/null || echo "Could not get recent commits"

# Exit with error if any logs could not be retrieved
if [ "$LOGS_RETRIEVAL_FAILED" = true ]; then
  echo "❌ CRITICAL: Unable to retrieve logs for one or more failed jobs"
  echo "Cannot perform thorough analysis without complete log data"
  exit 1
fi

# Output structured data for Claude analysis
echo "=== CI SUMMARY DATA ==="
echo "PR_NUMBER: $PR_NUMBER"
echo "PR_TITLE: $PR_TITLE"
echo "BRANCH_NAME: $BRANCH_NAME"
echo "RUN_ID: $RUN_ID"
echo "WORKFLOW_NAME: $WORKFLOW_NAME"
echo "RUN_CONCLUSION: $RUN_CONCLUSION"
echo "JOBS_SUMMARY:"
echo "$FULL_RUN_INFO" | jq ".jobs[] | {name: .name, conclusion: .conclusion}"
