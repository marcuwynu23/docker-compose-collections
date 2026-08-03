FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
    RUN npm install --omit=dev && npm cache clean --force

FROM node:22-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY src ./src
EXPOSE 5000
USER appuser
CMD ["node", "src/index.js"]
