# Dockerfile for Excel Service
FROM node:20-alpine
# WORKDIR /app
# COPY backend/excel-service/package*.json ./
# COPY backend/excel-service ./

WORKDIR /
COPY . .

RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 4001
CMD ["node", "dist/main"]
