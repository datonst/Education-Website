# GitHub Secrets và Variables Configuration

Để workflows hoạt động đúng, bạn cần cấu hình cả **GitHub Secrets** (cho dữ liệu nhạy cảm) và **GitHub Variables** (cho dữ liệu cấu hình công khai).

## 🔧 GitHub Variables (Không nhạy cảm - Plain text)

Các giá trị này sẽ hiển thị dưới dạng plain text và được sử dụng cho cấu hình không nhạy cảm:

### AWS Configuration Variables
```
AWS_REGION=ap-southeast-1
```

### Application Configuration Variables
```
BACKEND_PORT=3000
BACKEND_ECR_REPOSITORY=paas-education-backend
FRONTEND_ECR_REPOSITORY=paas-education-frontend
VITE_DOCUMENTDB_DBNAME=users
```

### ECS Configuration Variables (nếu sử dụng ECS)
```
ECS_CLUSTER_NAME=your-ecs-cluster-name
ECS_BACKEND_SERVICE_NAME=your-backend-service-name
ECS_FRONTEND_SERVICE_NAME=your-frontend-service-name
```

## 🔐 GitHub Secrets (Nhạy cảm - Encrypted)

Các giá trị này sẽ được mã hóa và sử dụng cho thông tin nhạy cảm:

### AWS Authentication Secrets
```
AWS_ACCOUNT_ID=your-aws-account-id
AWS_ROLE_TO_ASSUME=arn:aws:iam::YOUR_ACCOUNT_ID:role/GitHubActionsRole
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
```

### Application Secrets
```
AWS_BUCKET=team4-storage-backend
COGNITO_USER_POOL_ID=ap-southeast-1_EbjhCWcjJ
COGNITO_APP_CLIENT_ID=3dmcie4kk8uu6p42r1nlvnqppm
CLOUDFRONT_DOMAIN=secureguard.today
VITE_DOCUMENTDB_URI=mongodb+srv://user:1@cluster0.9l9x3dx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
VITE_BACKEND_URL=http://localhost:3000
```

## 📝 Cách cấu hình GitHub Secrets và Variables

### Cấu hình Variables:
1. Vào repository trên GitHub
2. Chọn **Settings** > **Secrets and variables** > **Actions**
3. Chọn tab **Variables**
4. Nhấn **New repository variable**
5. Thêm từng variable với tên và giá trị tương ứng

### Cấu hình Secrets:
1. Vào repository trên GitHub
2. Chọn **Settings** > **Secrets and variables** > **Actions**
3. Chọn tab **Secrets**
4. Nhấn **New repository secret**
5. Thêm từng secret với tên và giá trị tương ứng

## 🛡️ Lưu ý bảo mật

### Variables (Public):
- ✅ Tên repository, region, port numbers
- ✅ Database names (không có connection string)
- ✅ Cluster names, service names
- ❌ **KHÔNG sử dụng** cho API keys, passwords, connection strings

### Secrets (Private):
- ✅ AWS credentials, API keys
- ✅ Database connection strings với credentials
- ✅ Domain names có thể nhạy cảm
- ✅ User pool IDs, client IDs

## 🔄 Workflow References

- **Variables**: `${{ vars.VARIABLE_NAME }}`
- **Secrets**: `${{ secrets.SECRET_NAME }}`

## ✅ Kiểm tra cấu hình

Sau khi cấu hình xong, workflows sẽ:
1. Sử dụng Variables cho cấu hình công khai
2. Sử dụng Secrets cho thông tin nhạy cảm
3. Build Docker images với environment variables được inject đúng cách
4. Deploy an toàn mà không expose thông tin nhạy cảm

## 📋 Danh sách tổng hợp cần cấu hình

### Variables (11 items):
- AWS_REGION
- BACKEND_PORT
- BACKEND_ECR_REPOSITORY
- FRONTEND_ECR_REPOSITORY
- VITE_DOCUMENTDB_DBNAME
- ECS_CLUSTER_NAME
- ECS_BACKEND_SERVICE_NAME
- ECS_FRONTEND_SERVICE_NAME

### Secrets (8 items):
- AWS_ACCOUNT_ID
- AWS_ROLE_TO_ASSUME
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_BUCKET
- COGNITO_USER_POOL_ID
- COGNITO_APP_CLIENT_ID
- CLOUDFRONT_DOMAIN
- VITE_DOCUMENTDB_URI
- VITE_BACKEND_URL 