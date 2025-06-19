# Dockerfile for NestJS Backend
FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --production

COPY backend ./

# Expose the backend port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
