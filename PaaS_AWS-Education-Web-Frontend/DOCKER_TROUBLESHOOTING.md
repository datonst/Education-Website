# Docker Container Troubleshooting Guide

## Issues Fixed

### 1. Container Restart Loop
**Problem**: Container was experiencing frequent restarts with SIGTERM signals.

**Root Causes**:
- Missing proper signal handling
- No health check endpoint
- Resource constraints
- Running as root user

**Solutions Implemented**:
- Added `dumb-init` for proper signal handling
- Created `/health` endpoint for health checks
- Added resource limits in docker-compose.yml
- Running as non-root nginx user
- Added custom entrypoint script for graceful shutdown

### 2. Health Check Configuration
**Added**: 
- `/health` endpoint that returns 200 status
- Docker HEALTHCHECK directive
- ELB-compatible health checks

### 3. Security Improvements
- Running as non-root user (nginx)
- Added security headers
- Disabled server tokens
- Proper file permissions

### 4. Performance Optimizations
- Auto worker processes
- Optimized worker connections
- Gzip compression
- Static asset caching
- Efficient nginx configuration

## Usage

### Build and Run
```bash
# Build the image
docker build -t frontend-app .

# Run with docker-compose (recommended)
docker-compose up -d

# Or run directly
docker run -p 80:80 frontend-app
```

### Environment Variables
Make sure to set these in your `.env` file:
```
VITE_AWS_REGION=your-region
VITE_AWS_USER_POOL_ID=your-pool-id
VITE_AWS_USER_POOL_CLIENT_ID=your-client-id
VITE_DOCUMENTDB_URI=your-db-uri
VITE_DOCUMENTDB_DBNAME=your-db-name
VITE_BACKEND_URL=your-backend-url
```

### Health Check
Test the health endpoint:
```bash
curl http://localhost/health
# Should return: healthy
```

### Monitoring
Check container logs:
```bash
docker logs <container-id>
```

Check container stats:
```bash
docker stats <container-id>
```

## AWS ECS Deployment

### Task Definition Updates
```json
{
  "healthCheck": {
    "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost/health || exit 1"],
    "interval": 30,
    "timeout": 5,
    "retries": 3,
    "startPeriod": 60
  },
  "memory": 256,
  "cpu": 256
}
```

### Load Balancer Health Check
- **Path**: `/health`
- **Port**: 80
- **Protocol**: HTTP
- **Healthy threshold**: 2
- **Unhealthy threshold**: 3
- **Timeout**: 5 seconds
- **Interval**: 30 seconds

## Troubleshooting Commands

### Check nginx configuration
```bash
docker exec <container-id> nginx -t
```

### Check running processes
```bash
docker exec <container-id> ps aux
```

### Check file permissions
```bash
docker exec <container-id> ls -la /usr/share/nginx/html/
```

### Monitor resource usage
```bash
docker exec <container-id> cat /proc/meminfo
docker exec <container-id> cat /proc/loadavg
```

## Common Issues

### 1. Permission Denied
- Ensure files are owned by nginx user
- Check that entrypoint script is executable

### 2. Health Check Failing
- Verify `/health` endpoint is accessible
- Check nginx is running: `docker exec <container-id> ps aux | grep nginx`

### 3. High Memory Usage
- Monitor with `docker stats`
- Adjust memory limits in docker-compose.yml
- Check for memory leaks in application

### 4. Slow Response Times
- Check worker process configuration
- Monitor nginx access logs
- Verify gzip compression is working

## Files Modified

1. `Dockerfile` - Improved with security and stability features
2. `nginx.conf` - Added health endpoint and optimizations
3. `nginx-main.conf` - Main nginx configuration for containers
4. `entrypoint.sh` - Custom startup script with logging
5. `docker-compose.yml` - Resource limits and health checks
6. This troubleshooting guide

## Next Steps

1. Deploy the updated container
2. Monitor health checks in AWS ECS/ELB
3. Check CloudWatch logs for any remaining issues
4. Adjust resource limits based on actual usage 