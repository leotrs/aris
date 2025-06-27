#!/bin/bash
set -e

# Function to check if a process is running
check_process() {
    local pidfile=$1
    local service_name=$2
    
    if [ ! -f "$pidfile" ]; then
        echo "$service_name PID file not found: $pidfile"
        return 1
    fi
    
    local pid=$(cat "$pidfile" 2>/dev/null || echo "")
    if [ -z "$pid" ]; then
        echo "$service_name PID file is empty: $pidfile"
        return 1
    fi
    
    if ! kill -0 "$pid" 2>/dev/null; then
        echo "$service_name process (PID $pid) is not running"
        return 1
    fi
    
    return 0
}

# Function to show logs if available
show_logs() {
    local logfile=$1
    local service_name=$2
    
    if [ -f "$logfile" ]; then
        echo "=== $service_name logs ==="
        tail -20 "$logfile"
        echo "=== End $service_name logs ==="
    else
        echo "No $service_name log file found: $logfile"
    fi
}

# Get test command from arguments
TEST_COMMAND="$*"

if [ -z "$TEST_COMMAND" ]; then
    echo "Usage: $0 <test-command>"
    echo "Example: $0 npm run test:e2e -- --grep \"@standard\""
    exit 1
fi

echo "Running E2E tests: $TEST_COMMAND"

# Monitor backend process before tests
echo "Checking backend process before tests..."
if ! check_process "../backend/backend.pid" "Backend"; then
    echo "Backend process not running before tests!"
    show_logs "../backend/backend.log" "Backend"
    exit 1
fi

# Run the tests
echo "Starting tests..."
if eval "$TEST_COMMAND"; then
    echo "Tests passed successfully!"
    exit 0
else
    test_exit_code=$?
    echo "Tests failed with exit code $test_exit_code"
    
    # Check backend status after test failure
    echo "Checking backend process status after test failure..."
    if ! check_process "../backend/backend.pid" "Backend"; then
        echo "Backend process died during tests!"
        show_logs "../backend/backend.log" "Backend"
    else
        echo "Backend process still running. Recent backend logs:"
        show_logs "../backend/backend.log" "Backend"
    fi
    
    exit $test_exit_code
fi