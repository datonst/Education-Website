# 🔍 Build Consistency Check - Local vs GitHub Actions

## ✅ Frontend Build Arguments

### Local (`buildimage.sh`):
```bash
--build-arg VITE_AWS_REGION=$VITE_AWS_REGION
--build-arg VITE_AWS_USER_POOL_ID=$VITE_AWS_USER_POOL_ID  
--build-arg VITE_AWS_USER_POOL_CLIENT_ID=$VITE_AWS_USER_POOL_CLIENT_ID
--build-arg VITE_DOCUMENTDB_URI="$VITE_DOCUMENTDB_URI"
--build-arg VITE_DOCUMENTDB_DBNAME=$VITE_DOCUMENTDB_DBNAME
--build-arg VITE_BACKEND_URL=$VITE_BACKEND_URL
```

### GitHub Actions Workflow:
```yaml
build-args: |
  VITE_AWS_REGION=${{ vars.AWS_REGION }}
  VITE_AWS_USER_POOL_ID=${{ secrets.COGNITO_USER_POOL_ID }}
  VITE_AWS_USER_POOL_CLIENT_ID=${{ secrets.COGNITO_APP_CLIENT_ID }}
  VITE_DOCUMENTDB_URI=${{ secrets.VITE_DOCUMENTDB_URI }}
  VITE_DOCUMENTDB_DBNAME=${{ vars.VITE_DOCUMENTDB_DBNAME }}
  VITE_BACKEND_URL=${{ secrets.VITE_BACKEND_URL }}
```

**Status**: ✅ **KHỚP** - Cùng build args, local đọc từ .env, GitHub Actions đọc từ vars/secrets

## ✅ Backend Build Arguments  

### Local (`buildimage.sh`):
```bash
--build-arg PORT=$PORT
--build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
--build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
--build-arg AWS_REGION=$AWS_REGION
--build-arg AWS_BUCKET=$AWS_BUCKET
--build-arg COGNITO_USER_POOL_ID=$COGNITO_USER_POOL_ID
--build-arg COGNITO_APP_CLIENT_ID=$COGNITO_APP_CLIENT_ID
--build-arg CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
```

### GitHub Actions Workflow:
```yaml
build-args: |
  PORT=${{ vars.BACKEND_PORT }}
  AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }}
  AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }}
  AWS_REGION=${{ vars.AWS_REGION }}
  AWS_BUCKET=${{ secrets.AWS_BUCKET }}
  COGNITO_USER_POOL_ID=${{ secrets.COGNITO_USER_POOL_ID }}
  COGNITO_APP_CLIENT_ID=${{ secrets.COGNITO_APP_CLIENT_ID }}
  CLOUDFRONT_DOMAIN=${{ secrets.CLOUDFRONT_DOMAIN }}
```

**Status**: ✅ **KHỚP** - Cùng build args, local đọc từ .env, GitHub Actions đọc từ vars/secrets

## 📋 Variable Mapping

| Local (.env)             | GitHub Variables         | GitHub Secrets          | Type     |
| ------------------------ | ------------------------ | ----------------------- | -------- |
| `AWS_REGION`             | `AWS_REGION`             | -                       | Variable |
| `PORT`                   | `BACKEND_PORT`           | -                       | Variable |
| `VITE_DOCUMENTDB_DBNAME` | `VITE_DOCUMENTDB_DBNAME` | -                       | Variable |
| `AWS_ACCESS_KEY_ID`      | -                        | `AWS_ACCESS_KEY_ID`     | Secret   |
| `AWS_SECRET_ACCESS_KEY`  | -                        | `AWS_SECRET_ACCESS_KEY` | Secret   |
| `AWS_BUCKET`             | -                        | `AWS_BUCKET`            | Secret   |
| `COGNITO_USER_POOL_ID`   | -                        | `COGNITO_USER_POOL_ID`  | Secret   |
| `COGNITO_APP_CLIENT_ID`  | -                        | `COGNITO_APP_CLIENT_ID` | Secret   |
| `CLOUDFRONT_DOMAIN`      | -                        | `CLOUDFRONT_DOMAIN`     | Secret   |
| `VITE_DOCUMENTDB_URI`    | -                        | `VITE_DOCUMENTDB_URI`   | Secret   |
| `VITE_BACKEND_URL`       | -                        | `VITE_BACKEND_URL`      | Secret   |

## 🚀 Usage

### Local Development:
```bash
# Frontend
cd PaaS_AWS-Education-Web-Frontend
./buildimage.sh

# Backend  
cd PaaS_AWS-Education-Web-Backend
./buildimage.sh
```

### GitHub Actions:
- Automatically triggered on push to `main`/`develop` branches
- Uses same build arguments but sources from GitHub Variables/Secrets
- Pushes to ECR repositories

## ✅ Verification Complete

Both local build scripts and GitHub Actions workflows now use **identical build arguments** with appropriate data sources:
- **Local**: Reads from `.env` files  
- **GitHub Actions**: Reads from GitHub Variables/Secrets

The builds will produce consistent Docker images regardless of where they're executed! 🎉 