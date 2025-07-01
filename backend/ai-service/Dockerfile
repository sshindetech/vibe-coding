# Dockerfile for AI Service
FROM node:20-alpine
WORKDIR /app
COPY backend/ai-service/package*.json ./
COPY backend/ai-service ./
RUN npm install --legacy-peer-deps --omit=dev
RUN npm run build
EXPOSE 4002
CMD ["node", "dist/main"]
