# Dockerfile for Excel Service
FROM node:20-alpine
WORKDIR /app
COPY backend/excel-service/package*.json ./
COPY backend/excel-service ./
RUN npm install --legacy-peer-deps --omit=dev
RUN npm run build
EXPOSE 4001
CMD ["node", "dist/main"]
