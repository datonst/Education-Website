# 🚀 Quick Setup Guide - GitHub Variables & Secrets

## Copy-Paste Values for GitHub Setup

### 📋 GitHub Variables (Settings > Secrets and variables > Actions > Variables tab)

```
AWS_REGION = ap-southeast-1
BACKEND_PORT = 3000
BACKEND_ECR_REPOSITORY = paas-education-backend
FRONTEND_ECR_REPOSITORY = paas-education-frontend
VITE_DOCUMENTDB_DBNAME = users
ECS_CLUSTER_NAME = your-ecs-cluster-name
ECS_BACKEND_SERVICE_NAME = your-backend-service-name
ECS_FRONTEND_SERVICE_NAME = your-frontend-service-name
```

### 🔐 GitHub Secrets (Settings > Secrets and variables > Actions > Secrets tab)

```
AWS_ACCOUNT_ID = your-aws-account-id
AWS_ROLE_TO_ASSUME = arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsRole
AWS_ACCESS_KEY_ID = your-aws-access-key-id
AWS_SECRET_ACCESS_KEY = your-aws-secret-access-key
AWS_BUCKET = team4-storage-backend
COGNITO_USER_POOL_ID = ap-southeast-1_EbjhCWcjJ
COGNITO_APP_CLIENT_ID = 3dmcie4kk8uu6p42r1nlvnqppm
CLOUDFRONT_DOMAIN = secureguard.today
VITE_DOCUMENTDB_URI = mongodb+srv://user:1@cluster0.9l9x3dx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
VITE_BACKEND_URL = http://localhost:3000
```

## 📝 Setup Steps

1. **Go to GitHub Repository**
2. **Navigate to**: Settings > Secrets and variables > Actions


### For Variables:
3. **Click**: Variables tab
4. **Click**: "New repository variable"
5. **Copy-paste** each variable name and value from the Variables section above

### For Secrets:
3. **Click**: Secrets tab  
4. **Click**: "New repository secret"
5. **Copy-paste** each secret name and value from the Secrets section above

## ⚡ One-Click Commands

### Remove sensitive files from git:
```bash
cd edu-projects
./scripts/cleanup-env-files.sh
```

### Commit changes:
```bash
git add .
git commit -m "Configure GitHub Variables and Secrets for secure deployment"
git push
```

## 🔍 Verification

After setup, your workflows will:
- ✅ Use `${{ vars.VARIABLE_NAME }}` for public config
- ✅ Use `${{ secrets.SECRET_NAME }}` for sensitive data
- ✅ Build and deploy securely without exposing credentials

## 🆘 Troubleshooting

### If workflow fails:
1. Check all Variables are created in **Variables** tab
2. Check all Secrets are created in **Secrets** tab  
3. Verify AWS_ACCOUNT_ID matches your actual AWS account
4. Ensure AWS_ROLE_TO_ASSUME ARN is correct

### Common mistakes:
- ❌ Putting secrets in Variables tab
- ❌ Putting variables in Secrets tab
- ❌ Typos in variable/secret names
- ❌ Missing AWS account ID or incorrect ARN format 