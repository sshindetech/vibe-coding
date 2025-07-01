# Dockerfile for Gateway Service
FROM node:20-alpine
WORKDIR /app
COPY backend/gateway/package*.json ./
COPY backend/gateway ./
RUN npm install --legacy-peer-deps --omit=dev
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]

