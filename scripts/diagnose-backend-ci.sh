#!/bin/bash
set -e

# Backend Process Diagnostic Script for CI
# This script will prove definitively whether the backend process is being killed before E2E tests run

# Validate environment variables first
node docker/env-check.js

SCRIPT_START=$(date +%s)
LOG_FILE="/tmp/backend-diagnosis.log"
BACKEND_PID_FILE="/tmp/backend.pid"
RENDER_TEST_LOG="/tmp/render-tests.log"

echo "=== BACKEND DIAGNOSTIC SCRIPT STARTED ===" | tee -a "$LOG_FILE"
echo "Timestamp: $(date)" | tee -a "$LOG_FILE"
echo "Script PID: $$" | tee -a "$LOG_FILE"
echo "Current directory: $(pwd)" | tee -a "$LOG_FILE"
echo "Environment variables:" | tee -a "$LOG_FILE"
env | grep -E "(ENV|DB_URL|JWT_SECRET|TEST_USER)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Function to log with timestamp
log_with_time() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $message" | tee -a "$LOG_FILE"
}

# Function to test /render endpoint
test_render_endpoint() {
    local test_num="$1"
    local timestamp=$(date +%s)
    local duration=$((timestamp - SCRIPT_START))
    
    log_with_time "RENDER TEST #$test_num (${duration}s since script start)"
    
    # Test with simple RSM content
    local response=$(curl -s -w "HTTP_STATUS:%{http_code}" \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"source": ":rsm:\n# Test Heading\n\nTest paragraph.\n\n::"}' \
        http://localhost:8000/render 2>&1)
    
    local http_status=$(echo "$response" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
    local body=$(echo "$response" | sed 's/HTTP_STATUS:[0-9]*$//')
    
    if [ "$http_status" = "200" ]; then
        if echo "$body" | grep -q "manuscriptwrapper" && echo "$body" | grep -q "Test Heading"; then
            log_with_time "✅ RENDER TEST #$test_num: SUCCESS - Got valid RSM HTML (${#body} chars)"
            echo "[$timestamp] SUCCESS: HTTP $http_status, HTML length: ${#body}" >> "$RENDER_TEST_LOG"
            return 0
        else
            log_with_time "❌ RENDER TEST #$test_num: FAIL - Got HTTP 200 but invalid HTML"
            echo "[$timestamp] FAIL: HTTP 200 but invalid HTML: $body" >> "$RENDER_TEST_LOG"
            return 1
        fi
    else
        log_with_time "❌ RENDER TEST #$test_num: FAIL - HTTP $http_status"
        echo "[$timestamp] FAIL: HTTP $http_status, Response: $response" >> "$RENDER_TEST_LOG"
        return 1
    fi
}

# Function to check if backend process is alive
check_backend_process() {
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            local process_info=$(ps -p "$pid" -o pid,ppid,cmd --no-headers)
            log_with_time "✅ Backend process ALIVE: $process_info"
            return 0
        else
            log_with_time "❌ Backend process DEAD: PID $pid no longer exists"
            return 1
        fi
    else
        log_with_time "❌ Backend PID file missing: $BACKEND_PID_FILE"
        return 1
    fi
}

# Function to show full process tree
show_process_tree() {
    log_with_time "Current process tree:"
    if command -v pstree >/dev/null 2>&1; then
        pstree -p $$ | tee -a "$LOG_FILE"
    else
        ps -ef | grep -E "(uvicorn|python|bash)" | grep -v grep | tee -a "$LOG_FILE"
    fi
    echo "" | tee -a "$LOG_FILE"
}

# Function to monitor system resources
show_system_resources() {
    log_with_time "System resources:"
    echo "Memory usage:" | tee -a "$LOG_FILE"
    free -h | tee -a "$LOG_FILE"
    echo "Disk usage:" | tee -a "$LOG_FILE"
    df -h | tee -a "$LOG_FILE"
    echo "Load average:" | tee -a "$LOG_FILE"
    uptime | tee -a "$LOG_FILE"
    echo "" | tee -a "$LOG_FILE"
}

# Trap to handle script termination
cleanup() {
    log_with_time "SCRIPT TERMINATING - Cleanup started"
    show_process_tree
    
    if [ -f "$BACKEND_PID_FILE" ]; then
        local pid=$(cat "$BACKEND_PID_FILE")
        log_with_time "Attempting to kill backend process: $pid"
        kill "$pid" 2>/dev/null || log_with_time "Backend process already dead or couldn't kill"
        sleep 2
        kill -9 "$pid" 2>/dev/null || true
    fi
    
    log_with_time "=== FINAL DIAGNOSIS SUMMARY ==="
    if [ -f "$RENDER_TEST_LOG" ]; then
        local success_count=$(grep -c "SUCCESS" "$RENDER_TEST_LOG" || echo "0")
        local fail_count=$(grep -c "FAIL" "$RENDER_TEST_LOG" || echo "0")
        log_with_time "Render tests: $success_count successes, $fail_count failures"
        
        if [ "$fail_count" -gt 0 ]; then
            log_with_time "RENDER FAILURES DETECTED:"
            grep "FAIL" "$RENDER_TEST_LOG" | tail -5 | tee -a "$LOG_FILE"
        fi
    fi
    
    log_with_time "Full logs available in:"
    log_with_time "- Main log: $LOG_FILE"
    log_with_time "- Render tests: $RENDER_TEST_LOG"
    log_with_time "=== DIAGNOSIS COMPLETE ==="
}

trap cleanup EXIT

# Start backend with extensive logging
log_with_time "Starting backend with diagnostic monitoring..."
show_system_resources
show_process_tree

# Ensure we're in the backend directory
cd backend || {
    log_with_time "FATAL: Cannot change to backend directory"
    exit 1
}

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    log_with_time "FATAL: Backend .venv not found. Running uv sync..."
    uv sync --group test --group dev || {
        log_with_time "FATAL: uv sync failed"
        exit 1
    }
fi

# Start backend in background with output capture
log_with_time "Executing: uv run uvicorn main:app --host 0.0.0.0 --port 8000"
uv run uvicorn main:app --host 0.0.0.0 --port 8000 > /tmp/backend-stdout.log 2> /tmp/backend-stderr.log &
BACKEND_PID=$!

# Save PID for monitoring
echo "$BACKEND_PID" > "$BACKEND_PID_FILE"
log_with_time "Backend started with PID: $BACKEND_PID"

# Wait for backend to start with detailed progress
log_with_time "Waiting for backend to start (max 30 seconds)..."
for i in {1..30}; do
    if check_backend_process; then
        if curl -f http://localhost:8000/health >/dev/null 2>&1; then
            log_with_time "✅ Backend health check passed after ${i}s"
            break
        else
            log_with_time "Backend process alive but health check failed (attempt $i/30)"
        fi
    else
        log_with_time "Backend process died during startup (attempt $i/30)"
        log_with_time "STDOUT: $(tail -5 /tmp/backend-stdout.log 2>/dev/null || echo 'No stdout')"
        log_with_time "STDERR: $(tail -5 /tmp/backend-stderr.log 2>/dev/null || echo 'No stderr')"
    fi
    
    if [ $i -eq 30 ]; then
        log_with_time "FATAL: Backend failed to start within 30 seconds"
        show_process_tree
        exit 1
    fi
    
    sleep 1
done

# Test render endpoint immediately after startup
log_with_time "Testing /render endpoint immediately after startup..."
if test_render_endpoint 1; then
    log_with_time "✅ Initial /render test successful"
else
    log_with_time "❌ Initial /render test FAILED - this is the problem!"
    log_with_time "Backend stdout: $(cat /tmp/backend-stdout.log)"
    log_with_time "Backend stderr: $(cat /tmp/backend-stderr.log)"
fi

# Start continuous monitoring
log_with_time "Starting continuous monitoring for 120 seconds..."
test_counter=1
start_time=$(date +%s)

while [ $(($(date +%s) - start_time)) -lt 120 ]; do
    current_time=$(date +%s)
    elapsed=$((current_time - start_time))
    
    # Check process every 10 seconds
    if [ $((elapsed % 10)) -eq 0 ]; then
        if ! check_backend_process; then
            log_with_time "🚨 BACKEND PROCESS DIED at ${elapsed}s"
            log_with_time "Last 10 lines of stdout:"
            tail -10 /tmp/backend-stdout.log | tee -a "$LOG_FILE"
            log_with_time "Last 10 lines of stderr:"
            tail -10 /tmp/backend-stderr.log | tee -a "$LOG_FILE"
            show_process_tree
            exit 1
        fi
    fi
    
    # Test /render endpoint every 15 seconds
    if [ $((elapsed % 15)) -eq 0 ] && [ $elapsed -gt 0 ]; then
        test_counter=$((test_counter + 1))
        if ! test_render_endpoint $test_counter; then
            log_with_time "🚨 RENDER ENDPOINT FAILED at ${elapsed}s"
            if check_backend_process; then
                log_with_time "Backend process still alive but /render not working"
            else
                log_with_time "Backend process died, that's why /render failed"
            fi
        fi
    fi
    
    # Show detailed status every 30 seconds
    if [ $((elapsed % 30)) -eq 0 ] && [ $elapsed -gt 0 ]; then
        log_with_time "=== STATUS UPDATE at ${elapsed}s ==="
        check_backend_process
        show_process_tree
        
        # Check for any new error output
        if [ -s /tmp/backend-stderr.log ]; then
            local new_errors=$(tail -5 /tmp/backend-stderr.log)
            if [ -n "$new_errors" ]; then
                log_with_time "Recent backend errors: $new_errors"
            fi
        fi
    fi
    
    sleep 1
done

log_with_time "✅ Monitoring complete - backend survived 120 seconds"
log_with_time "Final process check:"
check_backend_process
log_with_time "Final /render test:"
test_render_endpoint "FINAL"

# If we get here, backend stayed alive the whole time
log_with_time "🎉 CONCLUSION: Backend process stayed alive and /render endpoint worked"
log_with_time "The problem is NOT that the backend dies during testing"