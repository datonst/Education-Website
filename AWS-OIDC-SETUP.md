# AWS OIDC Setup for GitHub Actions CI/CD Pipeline

This document provides step-by-step instructions to set up AWS OIDC (OpenID Connect) integration with GitHub Actions for secure, keyless authentication.

## Prerequisites

- AWS Account with administrative access
- GitHub repository with the CI/CD workflows
- AWS CLI installed and configured

## Step 1: Create OIDC Identity Provider in AWS

1. Open the AWS Management Console and navigate to IAM
2. Go to **Identity providers** → **Add provider**
3. Choose **OpenID Connect**
4. Configure the provider:
   - **Provider URL**: `https://token.actions.githubusercontent.com`
   - **Audience**: `sts.amazonaws.com`
5. Click **Add provider**

## Step 2: Create IAM Role for GitHub Actions

Create an IAM role that GitHub Actions will assume:

```bash
# Create trust policy document
cat > github-actions-trust-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Federated": "arn:aws:iam::YOUR_AWS_ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
            },
            "Action": "sts:AssumeRoleWithWebIdentity",
            "Condition": {
                "StringLike": {
                    "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/YOUR_REPO_NAME:*"
                },
                "StringEquals": {
                    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
                }
            }
        }
    ]
}
EOF

# Create the role
aws iam create-role \
    --role-name GitHubActions-CI-CD-Role \
    --assume-role-policy-document file://github-actions-trust-policy.json
```

## Step 3: Attach Policies to the Role

Attach necessary policies for ECR and ECS operations:

```bash
# ECR permissions
cat > ecr-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage",
                "ecr:CreateRepository",
                "ecr:DescribeRepositories",
                "ecr:PutLifecyclePolicy"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# ECS permissions (if using ECS deployment)
cat > ecs-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecs:UpdateService",
                "ecs:DescribeServices",
                "ecs:DescribeTasks",
                "ecs:ListTasks",
                "ecs:DescribeClusters"
            ],
            "Resource": "*"
        }
    ]
}
EOF

# Create and attach policies
aws iam create-policy \
    --policy-name GitHubActions-ECR-Policy \
    --policy-document file://ecr-policy.json

aws iam create-policy \
    --policy-name GitHubActions-ECS-Policy \
    --policy-document file://ecs-policy.json

aws iam attach-role-policy \
    --role-name GitHubActions-CI-CD-Role \
    --policy-arn arn:aws:iam::YOUR_AWS_ACCOUNT_ID:policy/GitHubActions-ECR-Policy

aws iam attach-role-policy \
    --role-name GitHubActions-CI-CD-Role \
    --policy-arn arn:aws:iam::YOUR_AWS_ACCOUNT_ID:policy/GitHubActions-ECS-Policy
```

## Step 4: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

Go to **Repository Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Required Secrets:

1. **AWS_ACCOUNT_ID**
   - Value: Your 12-digit AWS account ID

2. **AWS_ROLE_TO_ASSUME**
   - Value: `arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/GitHubActions-CI-CD-Role`

### Application Configuration Secrets:

3. **VITE_AWS_REGION**
   - Value: `us-east-1` (or your preferred region)

4. **VITE_AWS_USER_POOL_ID**
   - Value: Your Cognito User Pool ID

5. **VITE_AWS_USER_POOL_CLIENT_ID**
   - Value: Your Cognito User Pool Client ID

6. **VITE_DOCUMENTDB_URI**
   - Value: Your DocumentDB connection string

7. **VITE_DOCUMENTDB_DBNAME**
   - Value: Your DocumentDB database name

8. **VITE_BACKEND_URL**
   - Value: Your backend API URL

### ECS Deployment Secrets (if using ECS):

9. **ECS_CLUSTER_NAME**
   - Value: Your ECS cluster name

10. **ECS_BACKEND_SERVICE_NAME**
    - Value: Your ECS backend service name

11. **ECS_FRONTEND_SERVICE_NAME**
    - Value: Your ECS frontend service name

## Step 5: Create ECR Repositories

You can either:

1. **Use the automated setup workflow**: 
   - Go to GitHub Actions → Run workflow → "Setup AWS Infrastructure"

2. **Create manually via AWS CLI**:
   ```bash
   # Create backend repository
   aws ecr create-repository \
       --repository-name paas-education-backend \
       --image-scanning-configuration scanOnPush=true

   # Create frontend repository
   aws ecr create-repository \
       --repository-name paas-education-frontend \
       --image-scanning-configuration scanOnPush=true
   ```

## Step 6: Test the Pipeline

1. Commit and push your changes to the `main` or `develop` branch
2. Check GitHub Actions tab to see the workflow execution
3. Verify that Docker images are successfully pushed to ECR

## Troubleshooting

### Common Issues:

1. **"No assume role policy found"**
   - Ensure the trust policy is correctly configured with your GitHub repository details

2. **"Access denied to ECR"**
   - Verify ECR permissions are attached to the IAM role

3. **"Invalid OIDC token"**
   - Check that the OIDC provider URL and audience are correct

4. **Build arguments not found**
   - Ensure all required secrets are added to GitHub repository settings

## Security Best Practices

1. **Principle of Least Privilege**: Only grant minimum required permissions
2. **Repository Restriction**: Limit the OIDC trust policy to specific repositories
3. **Branch Protection**: Use the condition to restrict to specific branches if needed
4. **Secret Rotation**: Regularly rotate sensitive values like database credentials
5. **Audit Logs**: Monitor CloudTrail for OIDC assume role activities

## Monitoring and Logs

- **CloudWatch Logs**: Monitor ECS service logs
- **ECR Console**: Check image push history and vulnerability scans
- **GitHub Actions**: Review workflow execution logs
- **AWS CloudTrail**: Audit API calls made by GitHub Actions

## Additional Resources

- [AWS OIDC Documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)
- [ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/) 