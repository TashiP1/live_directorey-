# Stage 1: Build dependencies
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Stage 2: Production (distroless)
FROM gcr.io/distroless/nodejs18

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

CMD ["app.js"]

