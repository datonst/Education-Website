#!/bin/sh

# Enable strict error handling
set -e

# Function to log messages
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle shutdown gracefully
shutdown() {
    log "Received shutdown signal, stopping nginx gracefully..."
    nginx -s quit
    wait $!
    log "Nginx stopped"
    exit 0
}

# Set up signal handlers
trap shutdown SIGTERM SIGINT

# Validate nginx configuration
log "Validating nginx configuration..."
nginx -t

# Check if required files exist
if [ ! -f "/usr/share/nginx/html/index.html" ]; then
    log "ERROR: index.html not found in /usr/share/nginx/html/"
    exit 1
fi

# Log system information
log "Starting nginx with the following configuration:"
log "- Worker processes: auto"
log "- Worker connections: 1024"
log "- Memory limit: $(cat /sys/fs/cgroup/memory/memory.limit_in_bytes 2>/dev/null || echo 'unlimited')"

# Start nginx in background
log "Starting nginx..."
nginx -g "daemon off;" &

# Store nginx PID
NGINX_PID=$!

# Wait for nginx to start
sleep 2

# Check if nginx is running
if ! kill -0 $NGINX_PID 2>/dev/null; then
    log "ERROR: nginx failed to start"
    exit 1
fi

log "Nginx started successfully with PID $NGINX_PID"

# Wait for nginx process
wait $NGINX_PID 