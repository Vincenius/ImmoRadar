# Use official Node base image
FROM node:20-slim

# Install system dependencies including emoji-compatible fonts
RUN apt-get update && apt-get install -y \
    fontconfig \
    locales \
    ca-certificates \
    fonts-liberation \
    fonts-noto \
    fonts-noto-color-emoji \
    fonts-symbola \
    fonts-emojione \
    fonts-twemoji \
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

# Set locale to German
RUN locale-gen de_DE.UTF-8

ENV LANG=de_DE.UTF-8
ENV LANGUAGE=de_DE:de
ENV LC_ALL=de_DE.UTF-8

# Rebuild font cache
RUN fc-cache -f -v

# Set working directory
WORKDIR /app

# Copy app source
COPY . .

# Install dependencies
RUN yarn

# Build app (if required)
RUN yarn build

# Start the app
CMD ["yarn", "start"]
