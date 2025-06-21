# Use official Node base image
FROM node:20-slim

# Install Puppeteer dependencies + emoji fonts
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxext6 \
    libnss3 \
    libxss1 \
    libxtst6 \
    libglib2.0-0 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libxshmfence1 \
    libu2f-udev \
    libvulkan1 \
    wget \
    xdg-utils \
    ghostscript \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN yarn

# Build your app if necessary (e.g., Next.js)
RUN yarn build

# Start the app
CMD ["yarn", "start"]
