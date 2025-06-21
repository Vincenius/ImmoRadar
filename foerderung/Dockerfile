FROM node:20-slim

RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-symbola \
    fontconfig \
    wget \
    libasound2 libatk-bridge2.0-0 libatk1.0-0 libcups2 \
    libdbus-1-3 libx11-xcb1 libxcomposite1 libxdamage1 \
    libxrandr2 libxext6 libnss3 libxss1 libxtst6 \
    libglib2.0-0 libgtk-3-0 libgdk-pixbuf2.0-0 \
    libxshmfence1 libu2f-udev libvulkan1 xdg-utils ghostscript \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Twemoji SVGinOT color font
RUN wget -qO /tmp/twemoji.tar.gz \
    https://github.com/13rac1/twemoji-color-font/releases/download/v15.1.0/TwitterColorEmoji-SVGinOT-Linux-15.1.0.tar.gz \
 && mkdir -p /usr/share/fonts/truetype/twemoji \
 && tar -xzf /tmp/twemoji.tar.gz -C /usr/share/fonts/truetype/twemoji \
 && fc-cache -f -v

# Install EmojiOne Color SVGinOT via eosrei mirror v1.4
RUN wget -qO /tmp/emojione.tar.gz \
    https://github.com/eosrei/emojione-color-font/releases/download/v1.4/EmojiOneColor-SVGinOT-Linux-1.4.tar.gz \
 && mkdir -p /usr/share/fonts/truetype/emojione \
 && tar -xzf /tmp/emojione.tar.gz -C /usr/share/fonts/truetype/emojione \
 && fc-cache -f -v

WORKDIR /app
COPY . .
RUN yarn && yarn build
CMD ["yarn", "start"]
