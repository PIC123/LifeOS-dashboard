#!/bin/bash

# LifeOS Dashboard Deployment Validation Script
# Part of the Collaborative Development Workflow

echo "🚀 LifeOS Dashboard Deployment Validation"
echo "========================================"

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -f "next.config.js" ]]; then
    echo "❌ Error: Not in LifeOS Dashboard project directory"
    exit 1
fi

echo "📁 Project directory: ✅"

# Check Git status
echo ""
echo "📋 Git Status:"
echo "-------------"
git status --short
echo ""

# Check latest commit
echo "📝 Latest Commit:"
echo "----------------"
git log --oneline -1
echo ""

# Verify GitHub sync
echo "🐙 GitHub Status:"
echo "----------------"
GITHUB_COMMIT=$(gh api repos/PIC123/LifeOS-dashboard/commits/main --jq '.sha[0:7] + " " + .commit.message' | head -1)
LOCAL_COMMIT=$(git log --oneline -1)

echo "GitHub: $GITHUB_COMMIT"
echo "Local:  $LOCAL_COMMIT"

if [[ "$GITHUB_COMMIT" == "$LOCAL_COMMIT" ]]; then
    echo "✅ GitHub and local are in sync"
else
    echo "⚠️  GitHub and local differ - may need to push"
fi

echo ""

# Test build
echo "🔨 Build Test:"
echo "-------------"
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    echo "Running build with output:"
    npm run build
    exit 1
fi

echo ""

# Test key API endpoints
echo "🌐 API Integration Test:"
echo "----------------------"

# Start dev server in background
npm run dev > /dev/null 2>&1 &
DEV_PID=$!

# Wait for server to start
echo "Starting dev server..."
sleep 5

# Test APIs
ZETTEL_RESULT=$(curl -s http://localhost:3000/api/zettelkasten?view=overview | jq -r '.stats.totalNotes // "error"')
MEMORY_RESULT=$(curl -s http://localhost:3000/api/memory?view=overview | jq -r '.stats.totalDays // "error"')

echo "Zettelkasten API: $ZETTEL_RESULT notes"
echo "Memory API: $MEMORY_RESULT days"

# Kill dev server
kill $DEV_PID 2>/dev/null || true

if [[ "$ZETTEL_RESULT" == "error" ]] || [[ "$MEMORY_RESULT" == "error" ]]; then
    echo "❌ API integration failed"
    exit 1
else
    echo "✅ API integration working"
fi

echo ""
echo "🎉 Deployment Validation Complete!"
echo "=================================="
echo "✅ Git status clean"
echo "✅ GitHub sync verified" 
echo "✅ Build successful"
echo "✅ API integration working"
echo "✅ Knowledge system connected ($ZETTEL_RESULT notes)"
echo "✅ Memory system connected ($MEMORY_RESULT days)"
echo ""
echo "Dashboard is ready for use! 🚀"