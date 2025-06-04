#!/bin/bash

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Ensure the script exits on any error
set -e

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}     Creative Papers Docker Setup    ${NC}"
echo -e "${BLUE}======================================${NC}"

# Check if .env file exists
if [ -f ".env" ]; then
    echo -e "${GREEN}Using existing .env file for configuration${NC}"
    # Export all variables from .env file
    export $(grep -v '^#' .env | xargs)
else
    echo -e "${YELLOW}No .env file found. Creating from template...${NC}"
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env file from .env.example${NC}"
        # Export all variables from newly created .env file
        export $(grep -v '^#' .env | xargs)
    else
        echo -e "${YELLOW}No .env.example found. Using default values.${NC}"
        # Set default values
        export MONGODB_URI="mongodb+srv://username:password@cluster0.example.mongodb.net/database?retryWrites=true&w=majority"
        export JWT_SECRET=$(openssl rand -base64 32)
        export NEXT_PUBLIC_APP_URL="http://localhost:3001"
    fi
fi

# Verify we have the required environment variables
if [ -z "$MONGODB_URI" ]; then
    echo -e "${YELLOW}MongoDB URI not found in .env file. Please enter it now:${NC}"
    read -p "> " mongodb_uri
    export MONGODB_URI=${mongodb_uri}
fi

if [ -z "$JWT_SECRET" ]; then
    echo -e "${YELLOW}JWT Secret not found in .env file. Using random generated value.${NC}"
    export JWT_SECRET=$(openssl rand -base64 32)
fi

if [ -z "$NEXT_PUBLIC_APP_URL" ]; then
    export NEXT_PUBLIC_APP_URL="http://localhost:3001"
fi

# Set up environment variables for Docker Compose
echo -e "${BLUE}Setting up Docker environment with your settings...${NC}"

# Create a .env file for reference
if [ -f "env.docker" ]; then
    cp env.docker .env.docker
    sed -i "s|MONGODB_URI=|MONGODB_URI=$MONGODB_URI|g" .env.docker
    sed -i "s|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL|g" .env.docker
    sed -i "s|JWT_SECRET=|JWT_SECRET=$JWT_SECRET|g" .env.docker
    echo -e "${GREEN}Created .env.docker file for reference${NC}"
fi

# Build and start the Docker container
# Environment variables are automatically passed to docker-compose from the current shell
echo -e "${BLUE}Building and starting Docker containers...${NC}"
docker compose up -d --build

# Check if Docker containers started successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Docker setup completed successfully!${NC}"
    echo -e "${GREEN}Your application is now running at: http://localhost:3001${NC}"
else
    echo -e "${RED}Error: Failed to start Docker containers. Please check the logs.${NC}"
    exit 1
fi
