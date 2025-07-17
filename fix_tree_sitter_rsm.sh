#!/bin/bash

# Script to fix work email commits in tree-sitter-rsm repository
# Run this from the journey directory: ./aris/fix_tree_sitter_rsm.sh

set -e

WORK_EMAIL="leo.torres@fgsglobal.com"
PERSONAL_EMAIL="leo@leotrs.com"
PERSONAL_NAME="Leo Torres"

echo "🔧 Fixing commit emails in tree-sitter-rsm repository..."
echo "Work email: $WORK_EMAIL → Personal email: $PERSONAL_EMAIL"
echo ""

cd "rsm/tree-sitter-rsm"

# Configure git for this repo
git config user.email "$PERSONAL_EMAIL"
git config user.name "$PERSONAL_NAME"

# Check if there are any commits with work email
work_commits=$(git log --all --pretty=format:"%ae" | grep -c "$WORK_EMAIL" || true)

if [ "$work_commits" -eq 0 ]; then
    echo "✅ No work email commits found in tree-sitter-rsm"
else
    echo "🔄 Found $work_commits commits with work email, fixing..."
    
    # Suppress filter-branch warning
    export FILTER_BRANCH_SQUELCH_WARNING=1
    
    # Fix the commit emails
    git filter-branch --env-filter "
        if [ \"\$GIT_COMMITTER_EMAIL\" = \"$WORK_EMAIL\" ]
        then
            export GIT_COMMITTER_NAME=\"$PERSONAL_NAME\"
            export GIT_COMMITTER_EMAIL=\"$PERSONAL_EMAIL\"
        fi
        if [ \"\$GIT_AUTHOR_EMAIL\" = \"$WORK_EMAIL\" ]
        then
            export GIT_AUTHOR_NAME=\"$PERSONAL_NAME\"
            export GIT_AUTHOR_EMAIL=\"$PERSONAL_EMAIL\"
        fi
    " --tag-name-filter cat -- --branches --tags
    
    # Clean up backup refs
    rm -rf .git/refs/original/
    
    echo "✅ Fixed commits in tree-sitter-rsm"
    echo "⚠️  You'll need to force push: git push --force-with-lease origin main"
fi

cd ../..
echo ""
echo "🎉 tree-sitter-rsm repository processed!"
echo ""
echo "Next steps:"
echo "1. cd rsm/tree-sitter-rsm"
echo "2. Run: git push --force-with-lease origin main"