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

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]