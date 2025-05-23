FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_AWS_REGION
ARG VITE_AWS_USER_POOL_ID
ARG VITE_AWS_USER_POOL_CLIENT_ID
ARG VITE_DOCUMENTDB_URI
ARG VITE_DOCUMENTDB_DBNAME
ARG VITE_BACKEND_URL

RUN echo "VITE_AWS_REGION=$VITE_AWS_REGION" > .env && \
    echo "VITE_AWS_USER_POOL_ID=$VITE_AWS_USER_POOL_ID" >> .env && \
    echo "VITE_AWS_USER_POOL_CLIENT_ID=$VITE_AWS_USER_POOL_CLIENT_ID" >> .env && \
    echo "VITE_DOCUMENTDB_URI=$VITE_DOCUMENTDB_URI" >> .env && \
    echo "VITE_DOCUMENTDB_DBNAME=$VITE_DOCUMENTDB_DBNAME" >> .env && \
    echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" >> .env

# Build ứng dụng
RUN npm run build

# Stage 2: Tạo image production
FROM nginx:alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy nginx configurations
COPY --from=build /app/nginx-main.conf /etc/nginx/nginx.conf
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY --from=build /app/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 80

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Use dumb-init with custom entrypoint for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["/entrypoint.sh"]