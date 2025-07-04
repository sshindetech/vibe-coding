# Dockerfile for AI Service
FROM node:20-alpine
WORKDIR /
COPY . .
RUN npm install --legacy-peer-deps
RUN npm run build
EXPOSE 4002
CMD ["node", "dist/main"]
