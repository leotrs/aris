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

# Wait for backend server
echo "Waiting for backend server..."
timeout 90 bash -c 'until curl -f http://localhost:8000/health >/dev/null 2>&1; do 
    echo "Backend not ready, waiting..."; 
    
    # Check if backend process is still running
    if ! check_process "backend/backend.pid" "Backend"; then
        echo "Backend process died! Checking logs:"
        show_logs "backend/backend.log" "Backend"
        exit 1
    fi
    
    sleep 3; 
done' || {
    echo "Backend health check timed out or failed"
    if ! check_process "backend/backend.pid" "Backend"; then
        echo "Backend process is not running"
        show_logs "backend/backend.log" "Backend"
    else
        echo "Backend process is running but health check failed"
        show_logs "backend/backend.log" "Backend"
    fi
    exit 1
}

echo "Backend server is ready!"

# Wait for frontend server
echo "Waiting for frontend server..."
timeout 90 bash -c 'until curl -f http://localhost:5173 >/dev/null 2>&1; do 
    echo "Frontend not ready, waiting..."; 
    
    # Check if frontend process is still running
    if ! check_process "frontend/frontend.pid" "Frontend"; then
        echo "Frontend process died! Checking logs:"
        show_logs "frontend/frontend.log" "Frontend"
        exit 1
    fi
    
    sleep 3; 
done' || {
    echo "Frontend health check timed out or failed"
    if ! check_process "frontend/frontend.pid" "Frontend"; then
        echo "Frontend process is not running"
        show_logs "frontend/frontend.log" "Frontend"
    else
        echo "Frontend process is running but health check failed"
        show_logs "frontend/frontend.log" "Frontend"
    fi
    exit 1
}

echo "Frontend server is ready!"