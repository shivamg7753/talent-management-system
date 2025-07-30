# Dockerfile
FROM node:20-bullseye-slim

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev     

COPY src ./src

ENV NODE_ENV=production
EXPOSE 8082
CMD ["node", "src/server.js"]
