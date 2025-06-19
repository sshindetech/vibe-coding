# Dockerfile for NestJS Backend
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Expose the backend port
EXPOSE 3000

CMD ["npm", "run", "start:prod"]
