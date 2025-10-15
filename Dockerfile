FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src ./src
COPY proto ./proto

RUN mkdir -p logs storage

EXPOSE 50051-50053

CMD ["node", "src/index.js"]
