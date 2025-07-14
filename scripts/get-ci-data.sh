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

# Step 4: Cancel if Still Running
if [ "$RUN_STATUS" = "in_progress" ] || [ "$RUN_STATUS" = "queued" ]; then
  echo "🛑 Cancelling in-progress run $RUN_ID..."
  gh run cancel "$RUN_ID"
  echo "Waiting for cancellation..."
  sleep 5
  # Refresh status
  LATEST_RUN=$(gh run list --branch "$BRANCH_NAME" --limit 1 --json databaseId,status,conclusion,workflowName,createdAt --jq ".[0]")
  RUN_STATUS=$(echo "$LATEST_RUN" | jq -r ".status")
  RUN_CONCLUSION=$(echo "$LATEST_RUN" | jq -r ".conclusion")
fi

# Step 5: Get Detailed Job and Log Information
JOBS_INFO=$(gh run view "$RUN_ID" --json jobs)

# Debug: Show job structure first
echo "=== DEBUG: Job structure ==="
echo "$JOBS_INFO" | jq '.jobs[0] | keys'

# Get logs for failed jobs only
FAILED_JOBS=$(echo "$JOBS_INFO" | jq -r '.jobs[] | select(.conclusion == "failure") | @base64')
for job_data in $FAILED_JOBS; do
  job_info=$(echo "$job_data" | base64 --decode)
  job_name=$(echo "$job_info" | jq -r '.name')
  job_id=$(echo "$job_info" | jq -r '.id // .databaseId // "unknown"')
  
  echo "=== FAILED JOB: $job_name (ID: $job_id) ==="
  if [ "$job_id" != "unknown" ] && [ "$job_id" != "null" ]; then
    gh run view "$RUN_ID" --job="$job_id" --log 2>/dev/null || echo "Could not retrieve logs for job $job_id"
  else
    echo "No valid job ID found for $job_name"
  fi
  echo ""
done

# Output structured data for Claude analysis
echo "=== CI SUMMARY DATA ==="
echo "PR_NUMBER: $PR_NUMBER"
echo "PR_TITLE: $PR_TITLE"
echo "BRANCH_NAME: $BRANCH_NAME"
echo "RUN_ID: $RUN_ID"
echo "WORKFLOW_NAME: $WORKFLOW_NAME"
echo "RUN_CONCLUSION: $RUN_CONCLUSION"
echo "JOBS_SUMMARY:"
echo "$JOBS_INFO" | jq ".jobs[] | {name: .name, conclusion: .conclusion}"