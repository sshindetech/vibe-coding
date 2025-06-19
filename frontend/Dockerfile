# Dockerfile for Expo React Native Frontend (Web build)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Build the static web app
RUN npx expo export:web

# Use nginx to serve the static files
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
