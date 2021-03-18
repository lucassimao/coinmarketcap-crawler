FROM node:15.5.0-alpine3.10

COPY tsconfig.json package* /srv/backend/
COPY src /srv/backend/src

WORKDIR /srv/backend
RUN npm ci

RUN npm run build
RUN npm prune --production


EXPOSE ${PORT}
CMD ["npm", "start" ]

