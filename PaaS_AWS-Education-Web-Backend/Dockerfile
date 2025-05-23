FROM node:22-alpine

# Set working directory
WORKDIR /app

# Accept build arguments
ARG PORT=3000
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG AWS_REGION
ARG AWS_BUCKET
ARG COGNITO_USER_POOL_ID
ARG COGNITO_APP_CLIENT_ID
ARG CLOUDFRONT_DOMAIN

# Set environment variables
ENV PORT=${PORT}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_REGION=${AWS_REGION}
ENV AWS_BUCKET=${AWS_BUCKET}
ENV COGNITO_USER_POOL_ID=${COGNITO_USER_POOL_ID}
ENV COGNITO_APP_CLIENT_ID=${COGNITO_APP_CLIENT_ID}
ENV CLOUDFRONT_DOMAIN=${CLOUDFRONT_DOMAIN}

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy application code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]
