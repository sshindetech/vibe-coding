# Dockerfile for NestJS Backend
FROM node:20-alpine

WORKDIR /

COPY . .

# Install production dependencies
RUN npm install

# Build the static web app
RUN npm run build

# Expose the backend port
EXPOSE 3000

CMD ["node", "dist/main"]
