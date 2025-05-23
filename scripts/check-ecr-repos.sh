#!/bin/bash

# Script to check existing ECR repositories
# Run this script to verify your ECR setup before running the CI/CD pipeline

echo "🔍 Checking ECR repositories..."

# Set your AWS region (change if needed)
AWS_REGION=${AWS_REGION:-us-east-1}

echo "📍 Using AWS Region: $AWS_REGION"
echo ""

# List all ECR repositories
echo "📋 Available ECR repositories:"
aws ecr describe-repositories --region $AWS_REGION --query 'repositories[*].{Name:repositoryName,URI:repositoryUri,CreatedAt:createdAt}' --output table

echo ""
echo "🔧 Repository configurations:"

# Get repository names
REPOS=$(aws ecr describe-repositories --region $AWS_REGION --query 'repositories[*].repositoryName' --output text)

for repo in $REPOS; do
    echo ""
    echo "📦 Repository: $repo"
    
    # Check scanning configuration
    SCAN_CONFIG=$(aws ecr describe-repositories --repository-names $repo --region $AWS_REGION --query 'repositories[0].imageScanningConfiguration.scanOnPush' --output text)
    echo "  🔍 Vulnerability scanning: $SCAN_CONFIG"
    
    # Check encryption
    ENCRYPTION=$(aws ecr describe-repositories --repository-names $repo --region $AWS_REGION --query 'repositories[0].encryptionConfiguration.encryptionType' --output text)
    echo "  🔒 Encryption: $ENCRYPTION"
    
    # Check lifecycle policy
    if aws ecr get-lifecycle-policy --repository-name $repo --region $AWS_REGION &>/dev/null; then
        echo "  📜 Lifecycle policy: ✅ Configured"
    else
        echo "  📜 Lifecycle policy: ❌ Not configured"
    fi
    
    # Count images
    IMAGE_COUNT=$(aws ecr list-images --repository-name $repo --region $AWS_REGION --query 'length(imageIds)' --output text)
    echo "  🐳 Images count: $IMAGE_COUNT"
done

echo ""
echo "💡 Suggestions:"
echo "  - Update your workflow file (.github/workflows/ci-cd.yml) with the correct repository names"
echo "  - Ensure your GitHub Actions IAM role has access to these repositories"
echo "  - Consider enabling vulnerability scanning if not already enabled"

echo ""
echo "🔧 To update workflow repository names, edit these lines in .github/workflows/ci-cd.yml:"
echo "  BACKEND_ECR_REPOSITORY: your-backend-repo-name"
echo "  FRONTEND_ECR_REPOSITORY: your-frontend-repo-name" 