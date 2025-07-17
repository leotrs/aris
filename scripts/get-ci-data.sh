#!/bin/bash
set -e

# CI Data Gathering Script for Claude Analysis
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

# Step 2: Get PR Information
PR_INFO=$(gh pr view "$PR_NUMBER" --json title,headRefName,statusCheckRollup)
PR_TITLE=$(echo "$PR_INFO" | jq -r ".title")
BRANCH_NAME=$(echo "$PR_INFO" | jq -r ".headRefName")

# Step 3: Get Latest Workflow Run
LATEST_RUN=$(gh run list --branch "$BRANCH_NAME" --limit 1 --json databaseId,status,conclusion,workflowName,createdAt --jq ".[0]")
RUN_ID=$(echo "$LATEST_RUN" | jq -r ".databaseId")
RUN_STATUS=$(echo "$LATEST_RUN" | jq -r ".status")
RUN_CONCLUSION=$(echo "$LATEST_RUN" | jq -r ".conclusion")
WORKFLOW_NAME=$(echo "$LATEST_RUN" | jq -r ".workflowName")

# Step 4: Cancel if Still Running and Wait for Logs
if [ "$RUN_STATUS" = "in_progress" ] || [ "$RUN_STATUS" = "queued" ]; then
  echo "🛑 Cancelling in-progress run $RUN_ID..."
  gh run cancel "$RUN_ID"
  echo "Waiting for cancellation and logs to be available..."

  # Wait for cancellation to complete with retries
  MAX_WAIT=120  # 2 minutes max
  WAIT_TIME=0
  SLEEP_INTERVAL=5

  while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    sleep $SLEEP_INTERVAL
    WAIT_TIME=$((WAIT_TIME + SLEEP_INTERVAL))

    # Check if run is completed
    LATEST_RUN=$(gh run list --branch "$BRANCH_NAME" --limit 1 --json databaseId,status,conclusion,workflowName,createdAt --jq ".[0]")
    RUN_STATUS=$(echo "$LATEST_RUN" | jq -r ".status")
    RUN_CONCLUSION=$(echo "$LATEST_RUN" | jq -r ".conclusion")

    if [ "$RUN_STATUS" = "completed" ]; then
      echo "✅ Run cancelled successfully after ${WAIT_TIME}s"
      break
    fi

    echo "⏳ Still waiting for cancellation... (${WAIT_TIME}s elapsed)"
  done

  if [ "$RUN_STATUS" != "completed" ]; then
    echo "⚠️ Run may still be cancelling, but proceeding with analysis..."
  fi
fi

# Step 5: Get Detailed Job and Log Information as JSON
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

# Get detailed logs for failed jobs with structured output
FAILED_JOBS=$(echo "$FULL_RUN_INFO" | jq -r '.jobs[] | select(.conclusion == "failure") | @base64')
LOGS_RETRIEVAL_FAILED=false
for job_data in $FAILED_JOBS; do
  job_info=$(echo "$job_data" | base64 --decode)
  job_name=$(echo "$job_info" | jq -r '.name')
  job_id=$(echo "$job_info" | jq -r '.databaseId // .id // "unknown"')

  echo ""
  echo "=== FAILED JOB LOGS: $job_name (ID: $job_id) ==="

  if [ "$job_id" != "unknown" ] && [ "$job_id" != "null" ]; then
    # Get raw logs (limited to last 500 lines for performance)
    RAW_LOGS=$(gh run view "$RUN_ID" --job="$job_id" --log 2>/dev/null | tail -500 || echo "Could not retrieve logs for job $job_id")

    # Output structured log analysis as JSON
    echo "=== LOG_ANALYSIS_JSON ==="
    echo "$RAW_LOGS" | jq -Rs '{
      job_name: "'"$job_name"'",
      job_id: "'"$job_id"'",
      raw_logs: .,
      analysis: {
        test_failures: [
          (. | split("\n")[] | select(test("FAILED|Error:|FAIL|✗|×|AssertionError|TimeoutError"; "i")))
        ],
        file_paths: [
          (. | match("(?:at |in |/)([a-zA-Z0-9_/-]+\\.(spec|test|js|ts|py))(?::|:([0-9]+)(?::([0-9]+))?)?"; "g") | .string)
        ] | unique,
        specific_tests: [
          (. | split("\n")[] | select(test("describe\\(|it\\(|test\\(|✓|✗|×|PASS|FAIL"; "i")))
        ],
        e2e_patterns: [
          (. | split("\n")[] | select(test("playwright|expect.*toBeVisible|expect.*toHaveText|locator|waitForSelector|TimeoutError"; "i")))
        ],
        backend_patterns: [
          (. | split("\n")[] | select(test("pytest|AssertionError|def test_|FAILED.*\\.py::|ERROR.*\\.py::"; "i")))
        ],
        lint_errors: [
          (. | split("\n")[] | select(test("eslint|ruff|error.*:[0-9]+:[0-9]+|warning.*:[0-9]+:[0-9]+"; "i")))
        ],
        build_errors: [
          (. | split("\n")[] | select(test("ERROR in|Module not found|Cannot resolve|Build failed|npm ERR!"; "i")))
        ],
        flaky_indicators: [
          (. | split("\n")[] | select(test("intermittent|flaky|race condition|timeout.*exceeded|network.*error|connection.*refused"; "i")))
        ]
      }
    }'
  else
    echo "No valid job ID found for $job_name"
    LOGS_RETRIEVAL_FAILED=true
  fi
done

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
