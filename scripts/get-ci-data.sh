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
LATEST_RUN=$(echo "$ALL_RUNS" | jq '.[] | select(.status == "completed") | select(.workflowName == "CI")' | jq -s 'sort_by(.createdAt) | reverse | .[0] // empty')

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

# Download all failure artifacts once
echo ""
echo "=== DOWNLOADING FAILURE ARTIFACTS ==="

FAILED_JOBS=$(echo "$FULL_RUN_INFO" | jq -r '.jobs[] | select(.conclusion == "failure") | .name' | sort -u)

echo "Attempting to download all failure artifacts..."
# Download all artifacts since pattern matching is unreliable
gh run download "$RUN_ID" --dir "$TEMP_DIR" 2>/dev/null || echo "Failed to download some artifacts"

# Check if any artifacts were downloaded
if [ -d "$TEMP_DIR" ] && [ "$(find "$TEMP_DIR" -type f | wc -l)" -gt 0 ]; then
  echo "✅ Downloaded artifacts successfully"
  
  # Process each failed job and match with its artifacts
  for job_name in $FAILED_JOBS; do
    echo ""
    echo "=== PROCESSING FAILED JOB: $job_name ==="
    
    # Look for artifact directories that match this job name
    MATCHING_ARTIFACTS=""
    for artifact_dir in "$TEMP_DIR"/*; do
      if [ -d "$artifact_dir" ]; then
        # Extract job identifier from artifact directory name
        ARTIFACT_NAME=$(basename "$artifact_dir")
        
        # Match E2E job names with artifact names
        # E2E jobs have format like "e2e-desktop-chrome (auth)" -> "e2e-desktop-chrome-failure-auth"
        # or "e2e-site (chromium, desktop)" -> "e2e-site-failure-chromium-desktop"
        JOB_NORMALIZED=$(echo "$job_name" | sed 's/[^a-zA-Z0-9-]//g' | tr '[:upper:]' '[:lower:]')
        ARTIFACT_NORMALIZED=$(echo "$ARTIFACT_NAME" | sed 's/failure//' | sed 's/[^a-zA-Z0-9-]//g' | tr '[:upper:]' '[:lower:]')
        
        if [[ "$ARTIFACT_NORMALIZED" == *"$JOB_NORMALIZED"* ]] || [[ "$JOB_NORMALIZED" == *"$ARTIFACT_NORMALIZED"* ]]; then
          MATCHING_ARTIFACTS="$artifact_dir"
          break
        fi
      fi
    done
    
    if [ -n "$MATCHING_ARTIFACTS" ]; then
      echo "=== ARTIFACT_DIRECTORY: $MATCHING_ARTIFACTS ==="
      
      # Look for structured failure summary first
      if [ -f "$MATCHING_ARTIFACTS/failure-summary.json" ]; then
        echo "=== STRUCTURED_FAILURE_DATA ==="
        cat "$MATCHING_ARTIFACTS/failure-summary.json"
      fi
      
      # Look for E2E output logs
      if [ -f "$MATCHING_ARTIFACTS/e2e_output.log" ]; then
        echo "=== E2E_OUTPUT_SUMMARY ==="
        echo "Analyzing E2E test failures..."
        
        # Extract key failure information from Playwright logs
        FAILED_TESTS=$(grep -E "✗|×|FAILED.*spec" "$MATCHING_ARTIFACTS/e2e_output.log" | head -5 || echo "No specific failed tests found")
        ERROR_SUMMARY=$(grep -A3 -B1 -E "Error:|TimeoutError|AssertionError|expect.*to" "$MATCHING_ARTIFACTS/e2e_output.log" | head -10 || echo "No error details found")
        
        echo "Failed Tests:"
        echo "$FAILED_TESTS"
        echo ""
        echo "Error Details:"
        echo "$ERROR_SUMMARY"
      fi
      
      # Look for test output logs  
      if [ -f "$MATCHING_ARTIFACTS/test-output-tail.log" ]; then
        echo "=== TEST_OUTPUT_TAIL ==="
        head -15 "$MATCHING_ARTIFACTS/test-output-tail.log"
      fi
      
      # Show test results directory structure
      if [ -d "$MATCHING_ARTIFACTS/test-results" ]; then
        echo "=== TEST_RESULTS_STRUCTURE ==="
        find "$MATCHING_ARTIFACTS/test-results" -name "*.png" | head -5 | while read screenshot; do
          echo "Screenshot: $(basename "$screenshot")"
        done
        
        TRACE_COUNT=$(find "$MATCHING_ARTIFACTS/test-results" -name "trace.zip" | wc -l)
        echo "Trace files available: $TRACE_COUNT"
      fi
    else
      echo "⚠️ No matching artifacts found for $job_name"
      echo "Available artifact directories:"
      ls -1 "$TEMP_DIR"/ | sed 's/^/- /'
    fi
  done
else
  echo "❌ CRITICAL ERROR: No artifacts found"
  echo "This indicates either:"
  echo "1. The CI run is too old (artifacts may have expired)"
  echo "2. No artifacts were generated for this run"
  echo "3. The download failed"
  echo ""
  echo "Available artifacts from API:"
  gh api repos/leotrs/aris/actions/runs/"$RUN_ID"/artifacts --jq '.artifacts[].name'
  exit 1
fi

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
