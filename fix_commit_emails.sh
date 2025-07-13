#!/bin/bash

# Script to fix work email commits in RSM repositories
# Run this from the journey directory: ./aris/fix_commit_emails.sh

set -e

WORK_EMAIL="leo.torres@fgsglobal.com"
PERSONAL_EMAIL="leo@leotrs.com"
PERSONAL_NAME="Leo Torres"

echo "🔧 Fixing commit emails in RSM repositories..."
echo "Work email: $WORK_EMAIL → Personal email: $PERSONAL_EMAIL"
echo ""

# Repositories to fix
REPOS=("rsm" "tree-sitter-rsm" "rsm-lsp")

for repo in "${REPOS[@]}"; do
    echo "📁 Processing $repo..."
    
    if [ ! -d "$repo" ]; then
        echo "❌ Repository $repo not found, skipping"
        continue
    fi
    
    cd "$repo"
    
    # Configure git for this repo
    git config user.email "$PERSONAL_EMAIL"
    git config user.name "$PERSONAL_NAME"
    
    # Check if there are any commits with work email
    work_commits=$(git log --all --pretty=format:"%ae" | grep -c "$WORK_EMAIL" || true)
    
    if [ "$work_commits" -eq 0 ]; then
        echo "✅ No work email commits found in $repo"
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
        
        echo "✅ Fixed commits in $repo"
        echo "⚠️  You'll need to force push: git push --force-with-lease origin main"
    fi
    
    cd ..
    echo ""
done

echo "🎉 All repositories processed!"
echo ""
echo "Next steps:"
echo "1. cd into each repository"
echo "2. Run: git push --force-with-lease origin main"
echo "3. Or run: git push --force-with-lease origin <branch-name>"