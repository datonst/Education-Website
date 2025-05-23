#!/bin/bash

echo "🧹 Cleaning up sensitive .env files from repository..."

# Add .env files to .gitignore if not already present
echo "📝 Updating .gitignore..."

if [ ! -f .gitignore ]; then
    touch .gitignore
fi

# Add .env patterns to .gitignore if not already present
grep -qxF ".env" .gitignore || echo ".env" >> .gitignore
grep -qxF "*.env" .gitignore || echo "*.env" >> .gitignore
grep -qxF "PaaS_AWS-Education-Web-Backend/.env" .gitignore || echo "PaaS_AWS-Education-Web-Backend/.env" >> .gitignore
grep -qxF "PaaS_AWS-Education-Web-Frontend/.env" .gitignore || echo "PaaS_AWS-Education-Web-Frontend/.env" >> .gitignore

echo "✅ Updated .gitignore"

# Remove .env files from git index (but keep local files)
echo "🗑️ Removing .env files from git tracking..."

if [ -f "PaaS_AWS-Education-Web-Backend/.env" ]; then
    git rm --cached PaaS_AWS-Education-Web-Backend/.env 2>/dev/null || true
    echo "✅ Removed backend .env from git tracking"
fi

if [ -f "PaaS_AWS-Education-Web-Frontend/.env" ]; then
    git rm --cached PaaS_AWS-Education-Web-Frontend/.env 2>/dev/null || true
    echo "✅ Removed frontend .env from git tracking"
fi

echo ""
echo "🎉 Cleanup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Configure GitHub Secrets as described in GITHUB_SECRETS_SETUP.md"
echo "2. Commit the changes: git add . && git commit -m 'Remove sensitive .env files and update workflows'"
echo "3. Push to GitHub: git push"
echo ""
echo "⚠️  Important: The .env files are still on your local machine but won't be tracked by git anymore." 