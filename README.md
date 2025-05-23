# PaaS AWS Education Web Application

A full-stack web application built with React frontend and Node.js backend, deployed on AWS using containerized infrastructure.

## 🏗️ Architecture

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + MongoDB
- **Infrastructure**: AWS ECS + ECR + DocumentDB
- **Authentication**: AWS Cognito
- **CI/CD**: GitHub Actions with AWS OIDC

## 📁 Project Structure

```
edu-projects/
├── PaaS_AWS-Education-Web-Frontend/     # React frontend application
├── PaaS_AWS-Education-Web-Backend/      # Node.js backend API
├── .github/
│   └── workflows/
│       ├── ci-cd.yml                    # Main CI/CD pipeline
│       └── setup-infrastructure.yml     # Infrastructure setup (optional)
└── AWS-OIDC-SETUP.md                   # AWS OIDC configuration guide
```

## 🚀 CI/CD Pipeline Features

### Automated Build & Deployment
- **Multi-stage Docker builds** for both frontend and backend
- **Secure authentication** using AWS OIDC (no long-lived credentials)
- **Automatic ECR image pushing** with latest and SHA tags
- **Security scanning** with Trivy vulnerability scanner
- **Zero-downtime deployment** to ECS services
- **Repository verification** before pushing images

### Pipeline Triggers
- **Push to main/develop**: Full build, test, and deploy
- **Pull requests to main**: Build and test only

### Security Features
- ✅ OIDC authentication (keyless)
- ✅ Container vulnerability scanning
- ✅ ECR image encryption
- ✅ Lifecycle policies for image cleanup
- ✅ Principle of least privilege IAM roles

## 🛠️ Setup Instructions

### 1. Prerequisites
- AWS Account with administrative access
- GitHub repository
- **Existing ECR repositories** (already created)
- AWS CLI installed

### 2. Configure ECR Repository Names
Update the repository names in `.github/workflows/ci-cd.yml` to match your existing ECR repositories:

```yaml
env:
  BACKEND_ECR_REPOSITORY: your-backend-repo-name
  FRONTEND_ECR_REPOSITORY: your-frontend-repo-name
```

### 3. Configure AWS OIDC
Follow the detailed setup guide in [`AWS-OIDC-SETUP.md`](./AWS-OIDC-SETUP.md)

### 4. Configure GitHub Secrets
Add these secrets to your GitHub repository:

| Secret Name                    | Description                     | Example                                                                                                                 |
| ------------------------------ | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `AWS_ACCOUNT_ID`               | Your AWS account ID             | `123456789012`                                                                                                          |
| `AWS_ROLE_TO_ASSUME`           | IAM role ARN for GitHub Actions | `arn:aws:iam::123456789012:role/GitHubActions-CI-CD-Role`                                                               |
| `VITE_AWS_REGION`              | AWS region                      | `us-east-1`                                                                                                             |
| `VITE_AWS_USER_POOL_ID`        | Cognito User Pool ID            | `us-east-1_abcdefgh`                                                                                                    |
| `VITE_AWS_USER_POOL_CLIENT_ID` | Cognito Client ID               | `1234567890abcdefgh`                                                                                                    |
| `VITE_DOCUMENTDB_URI`          | DocumentDB connection string    | `mongodb://username:password@docdb-cluster.cluster-xxx.us-east-1.docdb.amazonaws.com:27017/?ssl=true&retryWrites=false` |
| `VITE_DOCUMENTDB_DBNAME`       | Database name                   | `education_db`                                                                                                          |
| `VITE_BACKEND_URL`             | Backend API URL                 | `https://api.yourdomain.com`                                                                                            |

**For ECS deployment (optional):**
| Secret Name                 | Description           |
| --------------------------- | --------------------- |
| `ECS_CLUSTER_NAME`          | ECS cluster name      |
| `ECS_BACKEND_SERVICE_NAME`  | Backend service name  |
| `ECS_FRONTEND_SERVICE_NAME` | Frontend service name |

### 5. Test the Pipeline
1. Commit and push your changes to the `main` or `develop` branch
2. Check GitHub Actions tab to see the workflow execution
3. Verify that Docker images are successfully pushed to your existing ECR repositories

## 📋 Workflow Details

### Main CI/CD Pipeline (`.github/workflows/ci-cd.yml`)

```yaml
# Triggered on:
- push: [main, develop]
- pull_request: [main]

# Jobs:
1. build-and-push:
   - Checkout code
   - Configure AWS OIDC
   - Verify ECR repositories exist
   - Build & push Docker images
   - Security scan with Trivy
   - Output image information

2. deploy (main branch only):
   - Deploy to ECS
   - Wait for deployment completion
   - Send notifications
```

The pipeline will automatically verify that your ECR repositories exist before attempting to push images.

## 🐳 Docker Images

### Backend Image
- **Base**: `node:22-alpine`
- **Port**: 3000
- **Features**: Production-ready Node.js API

### Frontend Image
- **Multi-stage build**: Build stage + Nginx serving
- **Base**: `nginx:alpine`
- **Port**: 80
- **Features**: Optimized React build with Nginx

## 🔍 Monitoring & Observability

### Image Security
- **Vulnerability scanning** on every push
- **Results** available in GitHub Security tab
- **Automated** security alerts

### Deployment Tracking
- **Status checks** in GitHub Actions
- **ECS service health** monitoring
- **CloudWatch logs** integration

## 🔧 Local Development

### Backend
```bash
cd PaaS_AWS-Education-Web-Backend
npm install
npm run dev
```

### Frontend
```bash
cd PaaS_AWS-Education-Web-Frontend
npm install
npm run dev
```

### Docker Development
```bash
# Build backend
docker build -t education-backend ./PaaS_AWS-Education-Web-Backend

# Build frontend
docker build -t education-frontend ./PaaS_AWS-Education-Web-Frontend

# Run with docker-compose
docker-compose up -d
```

## 🚨 Troubleshooting

### Common Pipeline Issues

1. **ECR Repository Not Found**
   ```
   Error: Repository does not exist
   ```
   - Check repository names in workflow match your actual ECR repository names
   - Verify repositories exist in the correct AWS region
   - Ensure IAM role has ECR describe permissions

2. **OIDC Authentication Failed**
   ```
   Error: Could not assume role with OIDC
   ```
   - Check IAM role trust policy
   - Verify GitHub repository name in trust policy
   - Ensure OIDC provider is correctly configured

3. **ECR Access Denied**
   ```
   Error: no basic auth credentials
   ```
   - Verify ECR permissions in IAM role
   - Check AWS region configuration
   - Ensure repositories exist

4. **Build Arguments Missing**
   ```
   Error: Build arg VITE_* not found
   ```
   - Check all GitHub secrets are configured
   - Verify secret names match exactly
   - Ensure secrets are available to the workflow

### Debug Steps
1. Check GitHub Actions logs for detailed error messages
2. Verify AWS CloudTrail for API call failures
3. Review ECR console for image push status
4. Monitor ECS console for service health

## 📚 Additional Resources

- [AWS OIDC Setup Guide](./AWS-OIDC-SETUP.md)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECR User Guide](https://docs.aws.amazon.com/AmazonECR/latest/userguide/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Create a Pull Request

The CI/CD pipeline will automatically build and test your changes!

## 📄 License

This project is licensed under the ISC License - see the package.json files for details. 