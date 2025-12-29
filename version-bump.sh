#!/bin/bash

# Version Bump Script for ZenBlock
# Usage: ./version-bump.sh [major|minor|patch]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current version from package.json
CURRENT_VERSION=$(node -p "require('./package.json').version")

echo -e "${YELLOW}Current version: ${CURRENT_VERSION}${NC}"

# Parse version
IFS='.' read -r -a version_parts <<< "$CURRENT_VERSION"
major="${version_parts[0]}"
minor="${version_parts[1]}"
patch="${version_parts[2]}"

# Determine new version
case "$1" in
  major)
    major=$((major + 1))
    minor=0
    patch=0
    ;;
  minor)
    minor=$((minor + 1))
    patch=0
    ;;
  patch)
    patch=$((patch + 1))
    ;;
  *)
    echo -e "${RED}Usage: $0 [major|minor|patch]${NC}"
    echo "  major: 1.0.0 -> 2.0.0"
    echo "  minor: 1.0.0 -> 1.1.0"
    echo "  patch: 1.0.0 -> 1.0.1"
    exit 1
    ;;
esac

NEW_VERSION="${major}.${minor}.${patch}"

echo -e "${GREEN}New version: ${NEW_VERSION}${NC}"

# Update package.json
echo "Updating package.json..."
if command -v jq &> /dev/null; then
  jq ".version = \"$NEW_VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json
else
  sed -i "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
fi

# Skip README badge updates - GitHub Actions will handle this
echo "Skipping README badge updates (GitHub Actions will handle this)"

# Git operations
echo "Committing changes..."
git add package.json
git commit -m "chore: bump version to $NEW_VERSION"

echo -e "${GREEN}Version bumped to ${NEW_VERSION}${NC}"
echo ""
echo "Next steps:"
echo "  1. Review the changes: git show"
echo "  2. Push to GitHub: git push origin master"
echo "  3. The GitHub Action will automatically:"
echo "     - Create tag v${NEW_VERSION}"
echo "     - Build and push Docker images"
echo "     - Create a GitHub Release"
echo ""
echo -e "${YELLOW}Or manually create tag:${NC}"
echo "  git tag v${NEW_VERSION}"
echo "  git push origin v${NEW_VERSION}"
