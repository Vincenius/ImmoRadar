# Use official Node base image
FROM node:20-slim

# Install Ghostscript
RUN apt-get update && \
    apt-get install -y ghostscript && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Build your app if necessary (e.g., Next.js)
# RUN npm run build

# Start the app
CMD ["npm", "start"]
