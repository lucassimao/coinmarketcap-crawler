FROM node:15.5.0-alpine3.10

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY tsconfig.json package* /srv/crawler/
COPY src /srv/crawler/src

WORKDIR /srv/crawler
RUN npm ci

RUN npm run build
RUN npm prune --production

RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont 


CMD ["npm", "start" ]

