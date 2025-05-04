# Base image with Bun
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
COPY package.json .npmrc bun.lockb* ./
RUN bun install

# Build stage
FROM base AS build
COPY . .
RUN bun run build

# Production stage
FROM oven/bun:1 AS production
WORKDIR /app

# Copy built artifacts
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Start the app
CMD ["bun", "./build/index.js"]
