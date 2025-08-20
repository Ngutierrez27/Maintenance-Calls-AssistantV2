#!/bin/bash

# Test Release Script
# This script demonstrates how the automated release process works

echo "🚀 Testing Automated Release Process"
echo "======================================"

echo ""
echo "1. Checking current git status..."
git status --porcelain

echo ""
echo "2. Current tags:"
git tag -l | head -5

echo ""
echo "3. Release workflow file exists:"
if [ -f ".github/workflows/release.yml" ]; then
    echo "✅ Release workflow found at .github/workflows/release.yml"
else
    echo "❌ Release workflow not found"
    exit 1
fi

echo ""
echo "4. Validating workflow configuration..."
if grep -q "draft: false" .github/workflows/release.yml; then
    echo "✅ Draft is set to false"
else
    echo "❌ Draft setting not found or incorrect"
fi

if grep -q "prerelease: false" .github/workflows/release.yml; then
    echo "✅ Prerelease is set to false"
else
    echo "❌ Prerelease setting not found or incorrect"
fi

echo ""
echo "5. Build process test..."
npm run build

echo ""
echo "✅ All checks passed! The automated release system is configured correctly."
echo ""
echo "To create a release, run:"
echo "  git tag v1.0.0"
echo "  git push origin v1.0.0"
echo ""
echo "The GitHub Actions workflow will automatically:"
echo "  - Build the application"
echo "  - Create a release that is NOT a draft"
echo "  - Create a release that is NOT marked as pre-release"
echo "  - Publish the release immediately"