# Docker Setup for GSMaps

This document explains how to build and run the GSMaps application using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your system

## Building the Docker Image

Navigate to the project directory and run:

```bash
docker build -t gsmaps .
```

This will build a Docker image with the tag `gsmaps`.

## Running the Container

Once the image is built, you can run the application with:

```bash
docker run -p 3000:3000 gsmaps
```

This will start the application and make it accessible at http://localhost:3000.

## Environment Variables

You can customize the Omniverse server connection by passing environment variables:

```bash
docker run -p 3000:3000 \
  -e OMNIVERSE_SERVER_IP=your_server_ip \
  -e OMNIVERSE_SIGNALING_PORT=your_port \
  -e OMNIVERSE_MEDIA_PORT=your_port \
  gsmaps
```

## Docker Compose

For easier management, you can use Docker Compose. Create a `docker-compose.yml` file:

```yaml
version: '3'
services:
  gsmaps:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OMNIVERSE_SERVER_IP=172.28.33.205
      - OMNIVERSE_SIGNALING_PORT=49100
      - OMNIVERSE_MEDIA_PORT=1024
```

Then run the application with:

```bash
docker-compose up
```

## Production Deployment

For production, consider adding a reverse proxy like Nginx to handle HTTPS, load balancing, etc.