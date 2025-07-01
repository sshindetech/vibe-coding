# Dockerfile for Gateway Service
FROM node:20-alpine
# WORKDIR /app
# COPY backend/gateway/package*.json ./
# COPY backend/gateway ./

WORKDIR /
COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]

