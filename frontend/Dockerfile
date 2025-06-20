# Dockerfile for Expo React Native Frontend (Web build)
FROM node:20-alpine

WORKDIR /

COPY . .

RUN npm install

# Build the static web app
RUN npx expo export -p web

# Use nginx to serve the static files
FROM nginx:alpine
COPY --from=0 /app/dist/web /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
