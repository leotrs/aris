#!/bin/bash

# Simple wrapper to run backend diagnosis in CI
# Usage: ./scripts/run-backend-diagnosis.sh

echo "🔍 Starting Backend Process Diagnosis"
echo "======================================"

# Ensure we're in the project root
cd "$(dirname "$0")/.." || exit 1

# Run the diagnostic script
./scripts/diagnose-backend-ci.sh

# Show the results
echo ""
echo "📊 DIAGNOSIS RESULTS:"
echo "===================="

if [ -f "/tmp/backend-diagnosis.log" ]; then
    echo "Full diagnostic log:"
    cat /tmp/backend-diagnosis.log
    echo ""
fi

if [ -f "/tmp/render-tests.log" ]; then
    echo "Render endpoint test results:"
    cat /tmp/render-tests.log
    echo ""
fi

echo "🏁 Diagnosis complete. Check the logs above for evidence."