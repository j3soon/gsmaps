# Use Node.js as the base image
FROM node:20-alpine as build

# Install bun (recommended in project README)
RUN apk add --no-cache curl unzip
RUN curl -fsSL https://bun.sh/install | bash

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies using bun
RUN ~/.bun/bin/bun install

# Copy the rest of the application
COPY . .

# Use adapter-node for SvelteKit
RUN node -e "const pkg=JSON.parse(require('fs').readFileSync('package.json')); \
    pkg.devDependencies['@sveltejs/adapter-node']='*'; \
    require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

RUN ~/.bun/bin/bun install

# Update svelte.config.js to use adapter-node
RUN sed -i "s/adapter-auto/adapter-node/g" svelte.config.js

# Build the application
RUN ~/.bun/bin/bun run build

# Production stage
FROM node:20-alpine as production

# Set the working directory
WORKDIR /app

# Copy package.json for production dependencies
COPY package.json ./
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable
ENV PORT=3000
ENV HOST=0.0.0.0

# Command to run the application
CMD ["node", "build"]